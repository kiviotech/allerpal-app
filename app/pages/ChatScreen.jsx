import React, { useState, useRef, useEffect } from "react";
import * as Notifications from 'expo-notifications';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import useAuthStore from "../../useAuthStore";
import { createNewMessage } from "../../src/services/messageServices";
import { sendMessageToRestaurant } from '../../src/services/chatService';
import { 
  getChatById, 
  getChatsByUserAndRestaurant, 
  getChatHistoryWithMessages 
} from '../../src/api/repositories/chatRepositories';
import { fetchRestaurantDetails } from '../../src/services/restaurantServices';
import chatPollingService from '../../src/services/chatPollingService';
import { MEDIA_BASE_URL } from './Chat';

const ChatScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [waitTimeRemaining, setWaitTimeRemaining] = useState(null);
  const [pollingError, setPollingError] = useState(null);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const params = useLocalSearchParams();
  const { chatId, restaurantDocumentId } = params;
  const {user} = useAuthStore();
  const userEmail = user?.email;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [chatStatus, setChatStatus] = useState(null);
  const [lastMessageTime, setLastMessageTime] = useState(null);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    console.log("[ChatScreen] Initializing with params:", { chatId, restaurantDocumentId });
    
    // Set user email in chat polling service
    if (userEmail) {
      chatPollingService.setUserEmail(userEmail);
    }
    
    fetchChatDetails();

    // Start polling for this chat only if we have a chat ID
    if (chatId) {
      // Ensure lastMessageTime is not in the future
      const validLastMessageTime = getValidLastMessageTime(lastMessageTime);
      
      chatPollingService.startChatPolling(
        chatId,
        validLastMessageTime,
        handleNewMessages,
        handleStatusChange,
        handlePollingError
      );
    }

    // Cleanup polling on unmount
    return () => {
      if (chatId) {
        chatPollingService.stopChatPolling(chatId);
      }
    };
  }, [chatId, restaurantDocumentId, userEmail]);

  // Check if user can send a message based on chat status and last message time
  useEffect(() => {
    checkMessageSendingPermission();
  }, [messages, chatStatus]);

  // Update the wait time remaining every minute
  useEffect(() => {
    if (!canSendMessage && waitTimeRemaining) {
      const timer = setInterval(() => {
        checkMessageSendingPermission();
      }, 60000); // Check every minute
      
      return () => clearInterval(timer);
    }
  }, [canSendMessage, waitTimeRemaining]);

  // Helper function to ensure we have a valid lastMessageTime
  const getValidLastMessageTime = (timestamp) => {
    if (!timestamp) {
      return new Date().toISOString();
    }
    
    const messageDate = new Date(timestamp);
    const currentDate = new Date();
    
    // Check if date is valid
    if (isNaN(messageDate.getTime())) {
      console.warn(`[ChatScreen] Invalid lastMessageTime: ${timestamp}, using current time`);
      return currentDate.toISOString();
    }
    
    // Check if date is in the future
    if (messageDate > currentDate) {
      console.warn(`[ChatScreen] Future lastMessageTime detected: ${timestamp}, using current time`);
      return currentDate.toISOString();
    }
    
    return timestamp;
  };

  const handleNewMessages = (newMessages) => {
    if (!newMessages || !newMessages.length) {
      console.log("[ChatScreen] No new messages to process");
      return;
    }
    
    console.log(`[ChatScreen] Processing ${newMessages.length} new messages`);
    
    setMessages(prevMessages => {
      // Create a map of existing messages by ID for quick lookup
      const existingMessagesMap = new Map();
      prevMessages.forEach(msg => existingMessagesMap.set(msg.id, msg));
      
      // Process new messages
      newMessages.forEach(newMsg => {
        // Skip if the message is already in our list
        if (existingMessagesMap.has(newMsg.id)) {
          return;
        }
        
        // Add new message to map
        existingMessagesMap.set(newMsg.id, {
          id: newMsg.id,
          content: newMsg.text || newMsg.content,
          sender: newMsg.sender,
          timestamp: newMsg.timestamp || newMsg.createdAt,
          read: newMsg.read || false,
          status: 'sent'
        });
      });
      
      // Convert map back to array and sort by timestamp
      const updatedMessages = Array.from(existingMessagesMap.values())
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      // Update last message time
      if (updatedMessages.length > 0) {
        const latestMessage = updatedMessages[updatedMessages.length - 1];
        setLastMessageTime(latestMessage.timestamp);
      }
      
      // Scroll to bottom if new messages were added
      if (updatedMessages.length > prevMessages.length && flatListRef.current) {
        setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: true });
        }, 100);
      }
      
      return updatedMessages;
    });
  };

  const handleStatusChange = (newStatus) => {
    setChatStatus(newStatus);
  };

  const handlePollingError = (error) => {
    setPollingError(error.message);
    Alert.alert(
      'Connection Error',
      'Having trouble getting new messages. Please check your connection and try again.',
      [
        { text: 'Retry', onPress: () => {
          setPollingError(null);
          if (chatId) {
            // Set user email before restarting polling
            if (userEmail) {
              chatPollingService.setUserEmail(userEmail);
            }
            
            chatPollingService.startChatPolling(
              chatId,
              lastMessageTime,
              handleNewMessages,
              handleStatusChange,
              handlePollingError
            );
          }
        }},
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  const checkMessageSendingPermission = () => {
    // If no messages, user can send a message
    if (!messages || messages.length === 0) {
      setCanSendMessage(true);
      setWaitTimeRemaining(null);
      return;
    }

    // Get the last message
    const lastMessage = [...messages].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )[0];

    // If the last message is from the restaurant, user can send a message
    if (lastMessage.sender === 'restaurant' || lastMessage.sender === 'bot') {
      setCanSendMessage(true);
      setWaitTimeRemaining(null);
      return;
    }

    // If the chat status is 'responded', user can send a message
    if (chatStatus === 'responded') {
      setCanSendMessage(true);
      setWaitTimeRemaining(null);
      return;
    }

    // Check if 24 hours have passed since the last user message
    const lastMessageTime = new Date(lastMessage.timestamp);
    const currentTime = new Date();
    const hoursSinceLastMessage = (currentTime - lastMessageTime) / (1000 * 60 * 60);
    
    if (hoursSinceLastMessage >= 24) {
      setCanSendMessage(true);
      setWaitTimeRemaining(null);
    } else {
      setCanSendMessage(false);
      
      // Calculate remaining wait time
      const remainingHours = Math.floor(24 - hoursSinceLastMessage);
      const remainingMinutes = Math.floor((24 - hoursSinceLastMessage - remainingHours) * 60);
      
      setWaitTimeRemaining({
        hours: remainingHours,
        minutes: remainingMinutes
      });
    }
  };

  // Helper function to process messages from API response
  const processMessagesFromResponse = (rawMessages) => {
    if (!rawMessages || !Array.isArray(rawMessages)) {
      console.warn('[ChatScreen] No messages found in response, returning empty array');
      return [];
    }
    
    console.log(`[ChatScreen] Processing ${rawMessages.length} messages from response`);
    
    // Map and format the messages
    return rawMessages.map(msg => ({
      id: msg.id,
      content: msg.text || msg.content || '',
      sender: msg.sender || 'unknown',
      timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
      status: 'sent',
      read: !!msg.read
    }))
    // Sort by timestamp (oldest first)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const fetchChatDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // No chat ID but restaurant ID and user are available - check if a chat already exists
      if (!chatId && restaurantDocumentId && user?.id) {
        console.log("[ChatScreen] No chat ID provided but restaurant ID exists. Checking for existing chat.");
        
        try {
          const existingChatResponse = await getChatsByUserAndRestaurant(user.id, restaurantDocumentId);
          const existingChat = existingChatResponse?.data?.data;
          
          // If an existing chat was found, update the URL and use it
          if (existingChat && existingChat.id) {
            console.log("[ChatScreen] Found existing chat:", existingChat.id);
            router.setParams({ chatId: existingChat.id });
            
            // Get full chat data with messages
            const fullChatResponse = await getChatHistoryWithMessages(existingChat.id);
            const fullChatData = fullChatResponse?.data?.data;
            
            if (fullChatData) {
              console.log(`[ChatScreen] Loaded existing chat with ${fullChatData.messages?.length || 0} messages`);
              
              // Process messages from the response
              const processedMessages = processMessagesFromResponse(fullChatData.messages || []);
              
              // Update state with chat data
              setMessages(processedMessages);
              setChatStatus(fullChatData.status);
              setLastMessageTime(fullChatData.lastMessageTime);
            } else {
              // If full chat data couldn't be loaded, use the basic chat info
              setMessages([]);
              setChatStatus(existingChat.status);
              setLastMessageTime(existingChat.lastMessageTime);
            }
            
            // Start polling for this chat
            chatPollingService.startChatPolling(
              existingChat.id,
              getValidLastMessageTime(existingChat.lastMessageTime),
              handleNewMessages,
              handleStatusChange,
              handlePollingError
            );
          } else {
            // This is a new chat, just fetch restaurant details
            console.log("[ChatScreen] No existing chat found, preparing for new chat");
            if (restaurantDocumentId) {
              const restaurantResponse = await fetchRestaurantDetails(restaurantDocumentId);
              if (restaurantResponse?.data?.data) {
                setRestaurant(restaurantResponse.data.data);
                setChatStatus('new');
                setMessages([]);
              } else {
                throw new Error('Could not fetch restaurant details');
              }
            }
          }
        } catch (error) {
          console.error("[ChatScreen] Error checking for existing chats:", error);
          // Even on error, try to fetch restaurant details
          const restaurantResponse = await fetchRestaurantDetails(restaurantDocumentId);
          if (restaurantResponse?.data?.data) {
            setRestaurant(restaurantResponse.data.data);
            setChatStatus('new');
            setMessages([]);
          }
        }
        
        setIsLoading(false);
        return;
      }
      
      // If we have a chatId, fetch the existing chat
      if (chatId) {
        console.log("[ChatScreen] Fetching existing chat with ID:", chatId);
        const response = await getChatHistoryWithMessages(chatId);
        const chatData = response?.data?.data;
        
        if (chatData) {
          console.log(`[ChatScreen] Loaded chat with ${chatData.messages?.length || 0} messages`);
          
          // Process messages from the response
          const processedMessages = processMessagesFromResponse(chatData.messages || []);
          
          // Update state with chat data
          setMessages(processedMessages);
          setChatStatus(chatData.status);
          setLastMessageTime(chatData.lastMessageTime);
          
          // Fetch restaurant details if we have a restaurant ID
          if (chatData.restaurantId || chatData.restaurant?.documentId || restaurantDocumentId) {
            const restaurantResponse = await fetchRestaurantDetails(
              chatData.restaurantId || 
              chatData.restaurant?.documentId || 
              restaurantDocumentId
            );
            setRestaurant(restaurantResponse.data?.data);
          }
        } else {
          throw new Error('Chat not found');
        }
      } else {
        throw new Error('No chat ID or restaurant ID provided');
      }
    } catch (error) {
      console.error('[ChatScreen] Error fetching chat details:', error);
      
      // Set a more user-friendly error message
      if (!chatId && !restaurantDocumentId) {
        setError('No chat or restaurant information provided. Please go back and try again.');
      } else if (!chatId) {
        // If only restaurant ID is provided, don't show an error as we're creating a new chat
        setError(null);
      } else {
        setError('Failed to load chat. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !canSendMessage || isInputDisabled) return;

    const tempMessageId = `temp-${Date.now()}`;
    const newMessage = {
      id: tempMessageId,
      content: userInput.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    try {
      setIsInputDisabled(true);
      
      // Add temporary message to the list
      setMessages(prev => [...prev, newMessage]);
      setUserInput('');
      
      // Scroll to bottom
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }

      // If we don't have a chatId yet but have restaurantDocumentId, we need to create a chat first
      let currentChatId = chatId;
      
      if (!currentChatId && restaurantDocumentId) {
        console.log("[ChatScreen] Creating new chat with restaurant:", restaurantDocumentId);
        
        if (!user?.id) {
          throw new Error('You must be logged in to start a chat');
        }
        
        // Create a new chat
        const newChatResponse = await sendMessageToRestaurant(
          user.id,
          restaurantDocumentId,
          newMessage.content,
          user.username || user.email || 'User'
        );
        
        if (newChatResponse && newChatResponse.id) {
          currentChatId = newChatResponse.id;
          console.log("[ChatScreen] New chat created with ID:", currentChatId);
          
          // Update the URL with the new chat ID
          router.setParams({ chatId: currentChatId });
          
          // Start polling for the new chat
          chatPollingService.startChatPolling(
            currentChatId,
            new Date().toISOString(),
            handleNewMessages,
            handleStatusChange,
            handlePollingError
          );
          
          // Update message status to sent
          setMessages(prev => prev.map(msg => 
            msg.id === tempMessageId ? {
              ...msg,
              id: newChatResponse.messageId || msg.id, // Use the real message ID if available
              status: 'sent'
            } : msg
          ));
          
          // Check if the response contains the message data
          if (newChatResponse.messages && newChatResponse.messages.length > 0) {
            const responseMessages = newChatResponse.messages.map(msg => ({
              ...msg,
              status: 'sent'
            }));
            
            // Replace all messages with the ones from the response
            setMessages(responseMessages);
          }
          
          // Set chat status from response if available
          if (newChatResponse.status) {
            setChatStatus(newChatResponse.status);
          }
          
          // Set last message time
          setLastMessageTime(new Date().toISOString());
          return;
        } else {
          throw new Error('Failed to create chat');
        }
      }

      // For existing chats, send the message normally
      if (currentChatId) {
        // Send message to backend
        const response = await createNewMessage(currentChatId, {
          content: newMessage.content,
          type: 'text'
        });

        // Check if response has data and update message properly
        if (response.data?.data) {
          // Update message with actual data from server
          setMessages(prev => prev.map(msg => 
            msg.id === tempMessageId ? {
              ...response.data.data,
              status: 'sent'
            } : msg
          ));
          
          // Check if we need to update lastMessageTime
          if (response.data.data.timestamp) {
            setLastMessageTime(response.data.data.timestamp);
          }
        } else {
          console.error('[ChatScreen] Message created but no response data:', response);
          // At least update the temp message status
          setMessages(prev => prev.map(msg => 
            msg.id === tempMessageId ? {
              ...msg,
              status: 'sent'
            } : msg
          ));
        }

        // Send message to restaurant if needed
        if (restaurant && restaurant.email) {
          await sendMessageToRestaurant(currentChatId, response.data?.data?.id);
        }
      } else {
        throw new Error('No chat ID available to send message');
      }
      
    } catch (error) {
      console.error('[ChatScreen] Error sending message:', error);
      
      // Update message status to error
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessageId ? {
          ...msg,
          status: 'error'
        } : msg
      ));

      Alert.alert(
        'Error',
        error.message || 'Failed to send message. Please try again.',
        [
          { text: 'OK' }
        ]
      );
    } finally {
      setIsInputDisabled(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUserMessage = item.sender === 'user';
    const messageStatus = item.status || 'sent';

    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessage : styles.otherMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isUserMessage ? styles.userBubble : styles.otherBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUserMessage ? styles.userMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          {isUserMessage && (
            <View style={styles.messageStatus}>
              {messageStatus === 'sending' && (
                <ActivityIndicator size="small" color="#999" />
              )}
              {messageStatus === 'sent' && (
                <Ionicons name="checkmark" size={16} color="#999" />
              )}
              {messageStatus === 'error' && (
                <Ionicons name="alert-circle" size={16} color="#ff4444" />
              )}
            </View>
          )}
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {restaurant ? restaurant.name : 'Chat'}
        </Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchChatDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {(!chatId && restaurantDocumentId && messages.length === 0) && (
            <View style={styles.newChatContainer}>
              <Text style={styles.newChatText}>
                Start chatting with {restaurant?.name || 'this restaurant'}
              </Text>
              <Text style={styles.newChatSubtext}>
                Type a message below to begin a conversation
              </Text>
            </View>
          )}
          
          {pollingError && (
            <View style={styles.pollingErrorBanner}>
              <Text style={styles.pollingErrorText}>
                Connection issues. Some messages may be delayed.
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setPollingError(null);
                  if (chatId) {
                    chatPollingService.startChatPolling(
                      chatId,
                      lastMessageTime,
                      handleNewMessages,
                      handleStatusChange,
                      handlePollingError
                    );
                  }
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {(chatId || messages.length > 0) && (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messageList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onRefresh={fetchChatDetails}
              refreshing={isLoading}
            />
          )}

          <View style={styles.inputContainer}>
            {!canSendMessage && waitTimeRemaining && (
              <Text style={styles.waitTimeText}>
                Please wait {waitTimeRemaining.hours}h {waitTimeRemaining.minutes}m before sending another message
              </Text>
            )}
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={userInput}
                onChangeText={setUserInput}
                placeholder="Type a message..."
                multiline
                editable={canSendMessage && !isInputDisabled}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!canSendMessage || !userInput.trim() || isInputDisabled) && styles.sendButtonDisabled
                ]}
                onPress={handleSendMessage}
                disabled={!canSendMessage || !userInput.trim() || isInputDisabled}
              >
                <Ionicons name="send" size={24} color={
                  (!canSendMessage || !userInput.trim() || isInputDisabled) ? '#999' : '#00aced'
                } />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: '#00aced',
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  waitTimeText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#00aced',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pollingErrorBanner: {
    backgroundColor: '#fff3cd',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pollingErrorText: {
    color: '#856404',
    flex: 1,
    marginRight: 8,
  },
  messageStatus: {
    position: 'absolute',
    right: -20,
    bottom: 0,
  },
  newChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
    margin: 16,
    borderRadius: 12,
  },
  newChatText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#00aced',
  },
  newChatSubtext: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ChatScreen;

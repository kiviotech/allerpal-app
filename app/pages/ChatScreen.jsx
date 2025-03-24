import React, { useState, useRef, useEffect } from "react";
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
import { getChatById, checkChatMessages } from '../../src/api/repositories/chatRepositories';
import { fetchRestaurantDetails } from '../../src/services/restaurantServices';
import { MEDIA_BASE_URL } from './Chat';

const ChatScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [waitTimeRemaining, setWaitTimeRemaining] = useState(null);
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
  const [checkingMessages, setCheckingMessages] = useState(false);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    console.log("[ChatScreen] Initializing with params:", { chatId, restaurantDocumentId });
    fetchChatDetails();
  }, [chatId, restaurantDocumentId]);

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

  // Check for new messages when component mounts and periodically
  useEffect(() => {
    if (chatId) {
      checkForNewMessages();
      
      // Check for new messages every 10 seconds
      const interval = setInterval(checkForNewMessages, 10000);
      
      return () => clearInterval(interval);
    }
  }, [chatId]);

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

  const checkForNewMessages = async () => {
    if (checkingMessages || !chatId) return;
    
    try {
      setCheckingMessages(true);
      console.log('[ChatScreen] Checking for new messages...');
      
      const response = await checkChatMessages(chatId, lastMessageTime);
      const { newMessages, unreadCount, status } = response.data?.data || {};
      
      if (newMessages && newMessages.length > 0) {
        console.log('[ChatScreen] Found new messages:', newMessages);
        
        // Update messages state with new messages
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          
          newMessages.forEach(newMsg => {
            const existingIndex = updatedMessages.findIndex(msg => msg.id === newMsg.id);
            
            if (existingIndex === -1) {
              // Add new message if it doesn't exist
              updatedMessages.push(newMsg);
            }
          });
          
          // Sort by timestamp
          return updatedMessages.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
        });
        
        // Update last message time
        const latestMessage = newMessages.reduce((latest, msg) => {
          return !latest || new Date(msg.timestamp) > new Date(latest.timestamp) ? msg : latest;
        }, null);
        
        if (latestMessage) {
          setLastMessageTime(latestMessage.timestamp);
        }
      }
      
      // Update chat status and unread count if changed
      if (status) {
        setChatStatus(status);
      }
      
    } catch (error) {
      console.error('[ChatScreen] Error checking for new messages:', error);
    } finally {
      setCheckingMessages(false);
    }
  };

  const fetchChatDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("[ChatScreen] Fetching chat details with:", { chatId, restaurantDocumentId });
      
      // Fetch chat details if chatId is available
      if (chatId) {
        console.log("[ChatScreen] Fetching chat with ID:", chatId);
        try {
          const chatResponse = await getChatById(chatId);
          const chatData = chatResponse.data?.data;
          
          if (chatData) {
            console.log("[ChatScreen] Chat data:", chatData);
            
            // Set restaurant data from the chat
            if (chatData.restaurant) {
              console.log("[ChatScreen] Setting restaurant from chat data:", chatData.restaurant);
              setRestaurant(chatData.restaurant);
            }
            
            // Set chat status
            setChatStatus(chatData.status || 'active');
            
            // Set messages from the chat
            if (chatData.messages && Array.isArray(chatData.messages)) {
              console.log("[ChatScreen] Setting messages from chat data:", chatData.messages.length);
              setMessages(chatData.messages);
            } else {
              console.log("[ChatScreen] No messages found in chat data");
              setMessages([]);
            }
            
            // Check if user can send a message
            checkMessageSendingPermission();
            
            // Set initial lastMessageTime from the most recent message
            if (chatData.messages && Array.isArray(chatData.messages) && chatData.messages.length > 0) {
              const latestMessage = chatData.messages.reduce((latest, msg) => {
                return !latest || new Date(msg.timestamp) > new Date(latest.timestamp) ? msg : latest;
              }, null);
              
              if (latestMessage) {
                setLastMessageTime(latestMessage.timestamp);
              }
            }
          } else {
            console.error("[ChatScreen] No chat data found");
            setError("Chat not found. Please try again.");
          }
        } catch (error) {
          console.error("[ChatScreen] Error fetching chat:", error);
          setError("Failed to load chat. Please try again.");
        }
      } else if (restaurantDocumentId) {
        // Fetch restaurant details for new chat
        console.log("[ChatScreen] Fetching restaurant with documentId:", restaurantDocumentId);
        try {
          const restaurantResponse = await fetchRestaurantDetails(restaurantDocumentId);
          if (restaurantResponse.data) {
            console.log("[ChatScreen] Setting restaurant from direct fetch:", restaurantResponse.data);
            setRestaurant(restaurantResponse.data);
            setMessages([]); // Initialize with empty messages for new chat
            setCanSendMessage(true); // Enable message sending for new chat
            setWaitTimeRemaining(null);
          }
        } catch (error) {
          console.error("[ChatScreen] Error fetching restaurant details:", error);
          setError("Failed to load restaurant details. Please try again.");
        }
      } else {
        console.log("[ChatScreen] No chatId or restaurantDocumentId available");
        setError("No chat or restaurant information available.");
      }
    } catch (error) {
      console.error("[ChatScreen] Error fetching chat details:", error);
      setError("Failed to load chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !canSendMessage) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const messageText = userInput.trim();
      setUserInput(''); // Clear input field immediately for better UX
      
      // Add message to UI optimistically
      const newMessage = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'user',
        timestamp: new Date().toISOString(),
        read: true
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Temporarily disable sending more messages
      setCanSendMessage(false);
      
      // Send message to restaurant via email
      if (user?.id && (restaurantDocumentId || chatId)) {
        console.log("[ChatScreen] Sending message to restaurant:", { 
          userId: user.id, 
          restaurantDocumentId: restaurantDocumentId || restaurant?.documentId, 
          chatId 
        });
        
        // Use the restaurant's documentId for sending messages
        const docId = restaurantDocumentId || restaurant?.documentId;
        if (!docId) {
          console.error("[ChatScreen] No restaurant documentId available for sending message");
          throw new Error("Restaurant documentId is missing");
        }
        
        const userName = user?.username || user?.email || 'AllerPal User';
        
        // Create chat if it doesn't exist, or send message to existing chat
        const updatedChat = await sendMessageToRestaurant(
          user.id,
          docId,
          messageText,
          userName
        );
        
        if (updatedChat && updatedChat.id) {
          if (!chatId) {
            // If this is a new chat, update the URL with the chat ID
            console.log("[ChatScreen] New chat created, updating URL with chat ID:", updatedChat.id);
            router.setParams({ chatId: updatedChat.id });
          }
          // Fetch the updated chat details
          fetchChatDetails();
        } else {
          throw new Error("Failed to send message");
        }
      } else {
        console.error("[ChatScreen] Missing user ID or restaurant documentId");
        throw new Error("Missing user ID or restaurant documentId");
      }
    } catch (error) {
      console.error("[ChatScreen] Error sending message:", error);
      setError("Failed to send message. Please try again.");
      
      // Remove the optimistically added message
      setMessages(prev => prev.filter(msg => msg.id !== Date.now().toString()));
      
      // Re-enable sending messages if there was an error
      setCanSendMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Format the wait time remaining
  const formatWaitTime = () => {
    if (!waitTimeRemaining) return '';
    
    if (waitTimeRemaining.hours > 0) {
      return `${waitTimeRemaining.hours} hour${waitTimeRemaining.hours !== 1 ? 's' : ''} and ${waitTimeRemaining.minutes} minute${waitTimeRemaining.minutes !== 1 ? 's' : ''}`;
    } else {
      return `${waitTimeRemaining.minutes} minute${waitTimeRemaining.minutes !== 1 ? 's' : ''}`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/pages/Chat')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {restaurant?.name || 'Chat'}
        </Text>
      </View>

      {isLoading || checkingMessages ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00aced" />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      ) : error && !messages.length ? (
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
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === "user" ? styles.userMessageContainer : styles.botMessageContainer,
            ]}
          >
            <Text style={item.sender === "user" ? styles.userMessage : styles.botMessage}>
              {item.text}
            </Text>
          </View>
        )}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onRefresh={checkForNewMessages}
          refreshing={checkingMessages}
        />
      )}

      {!canSendMessage && waitTimeRemaining && (
        <View style={styles.waitingBanner}>
          <Ionicons name="time-outline" size={20} color="#555" />
          <Text style={styles.waitingText}>
            Please wait for the restaurant to respond or try again in {formatWaitTime()}.
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={[styles.input, !canSendMessage && styles.inputDisabled]}
            value={userInput}
            onChangeText={setUserInput}
            placeholder={canSendMessage ? "Type a message..." : "Waiting for response..."}
            multiline
            editable={canSendMessage}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              (!userInput.trim() || !canSendMessage || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!userInput.trim() || !canSendMessage || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    elevation: 2,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#2196F3",
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE",
  },
  userMessage: {
    color: "#FFF",
  },
  botMessage: {
    color: "#000",
  },
  footer: {
    backgroundColor: "#FFF",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#00aced',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorBanner: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    right: 10,
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBannerText: {
    color: 'white',
    flex: 1,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  waitingBanner: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  waitingText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
    flex: 1,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
});

export default ChatScreen;

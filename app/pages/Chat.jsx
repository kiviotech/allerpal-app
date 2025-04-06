import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../../useAuthStore";
import { createNewInbox, fetchInboxByuserId, fetchInboxByuserResto } from "../../src/services/inboxServices";
import { getChatsByUserId, checkNewMessages } from '../../src/api/repositories/chatRepositories';
import { fetchRestaurantDetails } from '../../src/services/restaurantServices';
import { getChatsByUserAndRestaurant, sendMessageToRestaurant } from '../../src/services/chatService';
// import Resto from "../../assets/Resto.png"
export const MEDIA_BASE_URL = "http://localhost:1402";

const chats = [
  { id: 1, name: "John Doe", lastMessage: "Hey, how are you?", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Alice Smith", lastMessage: "Let's meet up!", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: 3, name: "Bob Johnson", lastMessage: "I'll call you later.", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Emma Wilson", lastMessage: "Just got home!", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
];

const Chat = () => {
  const { user } = useAuthStore();
  const { restaurantId, restaurantName } = useLocalSearchParams();
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const userId = user?.id;
  const [checkingMessages, setCheckingMessages] = useState(false);
  const checking = React.useRef(false);

  useEffect(() => {
    if (user?.id) {
      // If restaurantId is provided, handle it first
      if (restaurantId) {
        handleRestaurantChat();
      } else {
        // Otherwise, just fetch all chats
        fetchInbox();
      }
    }
  }, [user?.id, restaurantId]);

  // Check for new messages when component mounts and periodically
  useEffect(() => {
    if (user?.id) {
      checkForNewMessages();
      
      // Check for new messages every 30 seconds
      const interval = setInterval(checkForNewMessages, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  /**
   * Check for new messages across all user's chats
   */
  const checkForNewMessages = async () => {
    if (checking.current || !user?.id) return;
    
    try {
      checking.current = true;
      setCheckingMessages(true);
      
      console.log(`[Chat] Checking for new messages for user: ${user.id}`);
      
      // Validate user ID
      if (!user.id) {
        console.error('[Chat] Cannot check messages: User ID is undefined');
        throw new Error('User ID is required to check messages');
      }
      
      const response = await checkNewMessages(user.id);
      
      // Process new messages if available
      if (response && response.data && response.data.data) {
        const chatsWithNewMessages = response.data.data;
        
        if (chatsWithNewMessages.length > 0) {
          console.log(`[Chat] Found new messages in ${chatsWithNewMessages.length} chats`);
          
          // Update inbox
          fetchInbox();
          
          // Show notification
          showNotification('New Messages', `You have new messages in ${chatsWithNewMessages.length} conversations`);
        }
      }
    } catch (error) {
      console.error('[Chat] Error checking for new messages:', error);
      
      // For 400 Bad Request errors, don't show an error message to the user
      // This is likely due to a parameter issue which we'll handle silently
      if (error.response && error.response.status !== 400) {
        setError('Failed to check for new messages. Please try again.');
        
        // For server errors, wait longer before retrying
        if (error.response && error.response.status >= 500) {
          setTimeout(() => {
            setError(null);
          }, 60000); // Clear error after 1 minute
          return;
        }
        
        // For other errors, clear after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } finally {
      checking.current = false;
      setCheckingMessages(false);
    }
  };

  // Update the handleRestaurantChat function to handle 404 errors
  const handleRestaurantChat = async () => {
    if (!user?.id || !restaurantId) return;
    
    try {
      setLoading(true);
      console.log("[Chat] Handling restaurant chat for restaurant documentId:", restaurantId);
      
      // Check if a chat already exists for this user and restaurant using documentId
      let existingChats = [];
      try {
        const chatsResponse = await getChatsByUserAndRestaurant(user.id, restaurantId);
        existingChats = chatsResponse?.data?.data || [];
        console.log("[Chat] Found existing chats:", existingChats.length);
      } catch (error) {
        console.error("[Chat] Error checking for existing chats:", error);
        // Continue with creating a new chat
        existingChats = [];
      }
      
      if (existingChats && existingChats.length > 0) {
        // Chat exists, navigate to the existing chat
        const chatId = existingChats[0].id;
        console.log("[Chat] Found existing chat, navigating to:", chatId);
        
        router.replace({
          pathname: "/pages/ChatScreen",
          params: { chatId }
        });
      } else {
        // No chat exists, create a new one with a welcome message
        console.log("[Chat] No existing chat found, creating new chat with documentId:", restaurantId);
        
        // Get restaurant details for the name if not provided
        let restName = restaurantName;
        if (!restName) {
          try {
            // Use documentId to fetch restaurant details
            const restaurantResponse = await fetchRestaurantDetails(restaurantId);
            restName = restaurantResponse.data?.name || 'Restaurant';
          } catch (error) {
            console.error("[Chat] Error fetching restaurant details:", error);
            restName = 'Restaurant';
          }
        }
        
        // Create a welcome message
        const welcomeMessage = `Hello, I'd like to inquire about ${restName}.`;
        
        // Send the initial message to create the chat using documentId
        const userName = user?.username || user?.email || 'AllerPal User';
        
        console.log("[Chat] Creating new chat with message:", welcomeMessage);
        try {
          const chatData = await sendMessageToRestaurant(
            user.id,
            restaurantId, // This is already the documentId from the params
            welcomeMessage,
            userName
          );
          
          if (chatData && chatData.id) {
            // Navigate to the new chat
            console.log("[Chat] Chat created successfully, navigating to:", chatData.id);
            router.replace({
              pathname: "/pages/ChatScreen",
              params: { chatId: chatData.id }
            });
          } else {
            console.error("[Chat] Failed to create chat, no valid chat data returned");
            // If chat creation failed, just show the inbox
            fetchInbox();
          }
        } catch (error) {
          console.error("[Chat] Error creating new chat:", error);
          setError("Failed to create new chat. Please try again.");
          fetchInbox(); // Fallback to showing all chats
        }
      }
    } catch (error) {
      console.error("[Chat] Error handling restaurant chat:", error);
      setError("Failed to create or find chat. Please try again.");
      fetchInbox(); // Fallback to showing all chats
    } finally {
      setLoading(false);
    }
  };

  const fetchInbox = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("[Chat] Fetching chats for user:", user.id);
      const response = await getChatsByUserId(user.id);
      
      // Check if we have valid data
      if (response?.data?.data) {
        const chats = response.data.data;
        console.log("[Chat] Fetched chats:", chats.length);
        
        if (chats.length === 0) {
          // No chats found, set empty inbox
          console.log("[Chat] No chats found for user");
          setInbox([]);
          setLoading(false);
          return;
        }
        
        // Fetch restaurant details for each chat
        const chatsWithDetails = await Promise.all(
          chats.map(async (chat) => {
            // Use restaurant.documentId if available, otherwise fall back to restaurant.id
            const restaurantIdentifier = chat.restaurant?.documentId || chat.restaurant?.id;
            
            if (restaurantIdentifier) {
              try {
                console.log(`[Chat] Fetching restaurant details for chat ${chat.id} with identifier:`, restaurantIdentifier);
                const restaurantResponse = await fetchRestaurantDetails(restaurantIdentifier);
                const restaurant = restaurantResponse.data;
                
                return {
                  ...chat,
                  restaurantName: restaurant?.name || 'Unknown Restaurant',
                  restaurantImage: restaurant?.image?.[0]?.url || null,
                  unreadCount: chat.unreadCount || 0,
                  status: chat.status || 'active',
                  lastMessageTime: chat.lastMessageTime || new Date().toISOString()
                };
              } catch (error) {
                console.error(`[Chat] Error fetching restaurant details for chat ${chat.id}:`, error);
                
                // If we have the restaurant name directly in the chat data, use it
                if (chat.restaurant?.name) {
                  return {
                    ...chat,
                    restaurantName: chat.restaurant.name,
                    unreadCount: chat.unreadCount || 0,
                    status: chat.status || 'active',
                    lastMessageTime: chat.lastMessageTime || new Date().toISOString()
                  };
                }
                
                return {
                  ...chat,
                  restaurantName: 'Unknown Restaurant',
                  unreadCount: chat.unreadCount || 0,
                  status: chat.status || 'active',
                  lastMessageTime: chat.lastMessageTime || new Date().toISOString()
                };
              }
            } else if (chat.restaurant?.name) {
              // If we already have the restaurant name in the chat data, use it
              return {
                ...chat,
                restaurantName: chat.restaurant.name,
                unreadCount: chat.unreadCount || 0,
                status: chat.status || 'active',
                lastMessageTime: chat.lastMessageTime || new Date().toISOString()
              };
            }
            return {
              ...chat,
              restaurantName: 'Unknown Restaurant',
              unreadCount: chat.unreadCount || 0,
              status: chat.status || 'active',
              lastMessageTime: chat.lastMessageTime || new Date().toISOString()
            };
          })
        );
        
        // Sort chats by last message time (newest first)
        const sortedChats = chatsWithDetails.sort((a, b) => 
          new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );
        
        setInbox(sortedChats);
      } else {
        // No data or invalid response
        console.log("[Chat] No valid chat data in response");
        setInbox([]);
      }
    } catch (error) {
      console.error("[Chat] Error fetching inbox:", error);
      setError("Failed to load chats. Please try again.");
      setInbox([]); // Set empty inbox on error
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chat) => {
    router.push({
      pathname: "/pages/ChatScreen",
      params: { chatId: chat.id }
    });
  };

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'pending_restaurant':
        return { color: '#FFA500', text: 'Awaiting Response' }; // Orange
      case 'reminder_sent':
        return { color: '#FF6B6B', text: 'Reminder Sent' }; // Red
      case 'responded':
        return { color: '#4CAF50', text: 'Responded' }; // Green
      case 'failed':
        return { color: '#FF0000', text: 'Failed' }; // Red
      default:
        return { color: '#CCCCCC', text: 'Active' }; // Gray
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      // Within a week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/pages/Home')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>
  
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00aced" />
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchInbox}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : inbox.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>
            Start a conversation by visiting a restaurant page
          </Text>
        </View>
      ) : (
        <FlatList
          data={inbox}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const statusInfo = getStatusIndicator(item.status);
            
            return (
              <TouchableOpacity
                style={styles.chatItem}
                onPress={() => handleChatPress(item)}
              >
                <View style={styles.chatImageContainer}>
                  {item.restaurantImage ? (
                    <Image
                      source={{ uri: `${MEDIA_BASE_URL}${item.restaurantImage}` }}
                      style={styles.chatImage}
                    />
                  ) : (
                    <View style={[styles.chatImage, styles.placeholderImage]}>
                      <Text style={styles.placeholderText}>
                        {item.restaurantName?.charAt(0) || 'R'}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.chatContent}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName} numberOfLines={1}>
                      {item.restaurantName}
                    </Text>
                    <Text style={styles.chatTime}>
                      {formatDate(item.lastMessageTime)}
                    </Text>
                  </View>
                  
                  <View style={styles.chatPreview}>
                    <Text style={styles.chatMessage} numberOfLines={1}>
                      {item.lastMessage}
                    </Text>
                    
                    <View style={styles.chatStatus}>
                      {item.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{item.unreadCount}</Text>
                        </View>
                      )}
                      
                      <View style={[styles.statusIndicator, { backgroundColor: statusInfo.color }]}>
                        <Text style={styles.statusText}>{statusInfo.text}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          refreshControl={
            <RefreshControl 
              refreshing={loading || checkingMessages} 
              onRefresh={() => {
                fetchInbox();
                checkForNewMessages();
              }} 
            />
          }
        />
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
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
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
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
  chatImageContainer: {
    marginRight: 15,
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderImage: {
    backgroundColor: '#00aced',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  chatTime: {
    color: '#999',
    fontSize: 12,
  },
  chatPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatMessage: {
    color: '#666',
    flex: 1,
  },
  chatStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#00aced',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Chat;

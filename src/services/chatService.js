import { getRestaurantById } from '../api/repositories/restaurantRepositories';
import { 
  createChat, 
  updateChat, 
  getChatById, 
  addMessageToChat,
  getChatsByFilters
} from '../api/repositories/chatRepositories';
import { sendChatMessage, sendReminderEmail as sendReminderEmailApi } from '../api/repositories/emailRepositories';

/**
 * Send a message to a restaurant and handle the email communication
 * @param {string} userId - User ID
 * @param {string} restaurantDocumentId - Restaurant Document ID
 * @param {string} message - User's message
 * @param {string} userName - User's name
 * @returns {Promise<Object>} - Chat data with messages
 */
export const sendMessageToRestaurant = async (userId, restaurantDocumentId, message, userName) => {
  try {
    console.log(`[ChatService] Sending message to restaurant with documentId: ${restaurantDocumentId}`);
    
    // Get restaurant details including email using documentId
    const restaurantResponse = await getRestaurantById(restaurantDocumentId);
    const restaurant = restaurantResponse.data?.data;
    
    if (!restaurant || !restaurant.email) {
      throw new Error('Restaurant email not found');
    }
    
    // Check if chat already exists or create a new one
    let chatData;
    let chatId;
    
    // Try to find existing chat using documentId
    const existingChats = await getChatsByUserAndRestaurant(userId, restaurantDocumentId);
    
    if (existingChats && existingChats.data && existingChats.data.data && existingChats.data.data.length > 0) {
      chatData = existingChats.data.data[0];
      chatId = chatData.id;
      console.log(`[ChatService] Found existing chat with ID: ${chatId}`);
    } else {
      // Create a new chat using documentId
      console.log(`[ChatService] No existing chat found, creating new one`);
      
      const newChat = {
        user: { id: userId },
        restaurant: { documentId: restaurantDocumentId },
        lastMessage: message,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        status: 'active'
      };
      
      try {
        console.log(`[ChatService] Creating new chat with data:`, newChat);
        const chatResponse = await createChat({ data: newChat });
        
        if (chatResponse && chatResponse.data) {
          chatData = chatResponse.data;
          chatId = chatData.id;
          
          if (!chatId && chatResponse.data.data && chatResponse.data.data.id) {
            chatId = chatResponse.data.data.id;
            chatData = chatResponse.data.data;
          }
          
          console.log(`[ChatService] Created new chat with ID: ${chatId}`);
        }
        
        if (!chatId) {
          throw new Error('Failed to extract chat ID from response');
        }
      } catch (error) {
        console.error(`[ChatService] Error creating chat:`, error);
        throw error;
      }
    }
    
    if (!chatId) {
      console.error('[ChatService] No chat ID available after chat creation/retrieval');
      throw new Error('Failed to obtain a valid chat ID');
    }
    
    // Add user message to chat
    try {
      console.log(`[ChatService] Adding user message to chat: ${chatId}`);
      await addMessageToChat(chatId, {
        data: {
          text: message,
          sender: 'user',
          timestamp: new Date().toISOString(),
          read: true,
          chat: chatId
        }
      });
    } catch (error) {
      console.error(`[ChatService] Error adding user message to chat:`, error);
      throw error;
    }
    
    // Send email to restaurant
    let emailSent = false;
    try {
      const emailResponse = await sendChatMessage({
        restaurantEmail: restaurant.email,
        userName,
        message,
        chatId
      });
      
      emailSent = emailResponse.data.success;
      console.log(`[ChatService] Email sent successfully to restaurant: ${restaurant.email}`);
      
      // Schedule reminder email if needed
      if (emailSent) {
        scheduleReminderEmail(restaurant.email, userName, chatId, restaurantDocumentId, userId);
      }
      
    } catch (error) {
      console.error(`[ChatService] Error sending email to restaurant:`, error);
      // Add system message about email failure
      await addMessageToChat(chatId, {
        data: {
          text: "We couldn't send your message to the restaurant's email. We'll try again soon.",
          sender: 'system',
          timestamp: new Date().toISOString(),
          read: true,
          chat: chatId
        }
      });
      throw error;
    }
    
    // Update chat with latest info
    try {
      console.log(`[ChatService] Updating chat status: ${chatId}`);
      await updateChat(chatId, {
        data: {
          lastMessage: message,
          lastMessageTime: new Date().toISOString(),
          status: emailSent ? 'pending_restaurant' : 'failed',
          reminderScheduled: emailSent
        }
      });
    } catch (error) {
      console.error(`[ChatService] Error updating chat status:`, error);
      throw error;
    }
    
    // Get updated chat with messages
    try {
      console.log(`[ChatService] Getting updated chat: ${chatId}`);
      const updatedChat = await getChatById(chatId);
      
      if (updatedChat && updatedChat.data) {
        console.log(`[ChatService] Successfully retrieved updated chat`);
        
        // Make sure we have messages in the response
        const messages = updatedChat.data?.data?.messages || 
                         updatedChat.data?.messages || 
                         [];
                         
        // Return data with id, messages, and status
        return {
          id: chatId,
          messageId: messages.length > 0 ? messages[messages.length - 1].id : null,
          messages: messages,
          status: updatedChat.data?.data?.status || updatedChat.data?.status || 'pending_restaurant',
          lastMessageTime: updatedChat.data?.data?.lastMessageTime || updatedChat.data?.lastMessageTime || new Date().toISOString()
        };
      } else {
        throw new Error('Invalid response from getChatById');
      }
    } catch (error) {
      console.error(`[ChatService] Error getting updated chat:`, error);
      throw error;
    }
    
  } catch (error) {
    console.error('[ChatService] Error sending message to restaurant:', error);
    throw error;
  }
};

/**
 * Schedule a reminder email to be sent after 24 hours if no response
 * @param {string} restaurantEmail - Restaurant email
 * @param {string} userName - User name
 * @param {string} chatId - Chat ID
 * @param {string} restaurantDocumentId - Restaurant Document ID
 * @param {string} userId - User ID
 */
const scheduleReminderEmail = (restaurantEmail, userName, chatId, restaurantDocumentId, userId) => {
  // Set timeout for 24 hours (in milliseconds)
  const REMINDER_DELAY = 24 * 60 * 60 * 1000; // 24 hours
  
  setTimeout(async () => {
    try {
      // Check if chat has been responded to
      const chatResponse = await getChatById(chatId);
      const chat = chatResponse.data;
      
      // If status is still pending, send reminder
      if (chat.status === 'pending_restaurant') {
        console.log(`[ChatService] Sending reminder for chat: ${chatId}`);
        
        // Send reminder email through API
        const reminderResponse = await sendReminderEmailApi({
          restaurantEmail,
          userName,
          chatId
        });
        
        if (reminderResponse.data.success) {
          // Add system message about reminder
          await addMessageToChat(chatId, {
            data: {
              text: "We've sent a reminder to the restaurant about your message.",
              sender: 'system',
              timestamp: new Date().toISOString(),
              read: false
            }
          });
          
          // Update chat status
          await updateChat(chatId, {
            data: {
              status: 'reminder_sent',
              reminderSent: new Date().toISOString()
            }
          });
        }
      }
    } catch (error) {
      console.error('[ChatService] Error sending reminder:', error);
    }
  }, REMINDER_DELAY);
};

/**
 * Process an email reply from a restaurant
 * @param {string} chatId - Chat ID
 * @param {string} replyText - Reply text from email
 * @returns {Promise<Object>} - Updated chat data
 */
export const processRestaurantReply = async (chatId, replyText) => {
  try {
    console.log(`[ChatService] Processing restaurant reply for chat: ${chatId}`);
    
    // Add restaurant message to chat
    await addMessageToChat(chatId, {
      data: {
        text: replyText,
        sender: 'restaurant',
        timestamp: new Date().toISOString(),
        read: false
      }
    });
    
    // Update chat status
    await updateChat(chatId, {
      data: {
        lastMessage: replyText,
        lastMessageTime: new Date().toISOString(),
        status: 'responded',
        unreadCount: 1 // Increment unread count for user
      }
    });
    
    // Get updated chat
    const updatedChat = await getChatById(chatId);
    return updatedChat.data;
    
  } catch (error) {
    console.error('[ChatService] Error processing restaurant reply:', error);
    throw error;
  }
};

/**
 * Get chats by user ID and restaurant document ID
 * @param {string} userId - User ID
 * @param {string} restaurantDocumentId - Restaurant Document ID
 * @returns {Promise<Object>} - API response with chats data
 */
export const getChatsByUserAndRestaurant = async (userId, restaurantDocumentId) => {
  try {
    console.log(`[ChatService] Getting chats for user: ${userId} and restaurant documentId: ${restaurantDocumentId}`);
    
    // Use documentId to filter chats with Strapi v5 format
    const chats = await getChatsByFilters({
      user: userId,
      'restaurant.documentId': restaurantDocumentId // Use documentId in the filter
    });
    
    // Ensure we return a valid response even if no chats are found
    if (!chats.data || !chats.data.data) {
      console.log(`[ChatService] No chats found or invalid response, returning empty array`);
      return { data: { data: [] } };
    }
    
    return chats;
  } catch (error) {
    console.error('[ChatService] Error getting chats:', error);
    // Return empty array instead of throwing
    return { data: { data: [] } };
  }
};

export default {
  sendMessageToRestaurant,
  processRestaurantReply,
  getChatsByUserAndRestaurant
}; 
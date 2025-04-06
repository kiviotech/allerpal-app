import { 
    createMessage, 
    getMessages, 
    getMessageById, 
    updateMessage, 
    deleteMessage 
  } from '../api/repositories/messageRepositories';
import { addMessageToChat } from '../api/repositories/chatRepositories';

export const fetchAllMessages = async () => {
  try {
    const response = await getMessages();
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};  

export const fetchMessageById = async (id) => {
  try {
    const response = await getMessageById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching message with ID ${id}:`, error);
    throw error;
  }
};  

/**
 * Create a new message in a chat
 * @param {string} chatId - Chat ID
 * @param {Object} messageData - Message data
 * @param {string} messageData.content - Message content
 * @param {string} messageData.type - Message type (text, image, etc.)
 * @returns {Promise<Object>} - API response
 */
export const createNewMessage = async (chatId, messageData) => {
  console.log(`[MessageServices] Creating new message in chat ${chatId}:`, messageData);
  
  if (!chatId) {
    console.error('[MessageServices] Cannot create message: Chat ID is undefined');
    throw new Error('Chat ID is required to create a message');
  }
  
  try {
    // Prepare message payload
    const payload = {
      data: {
        text: messageData.content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        read: true,
        chat: chatId
      }
    };
    
    // Add message to chat
    const response = await addMessageToChat(chatId, payload);
    
    console.log(`[MessageServices] Created message successfully:`, response.data);
    
    // Ensure we have proper message data in the response
    if (!response.data?.data || 
        (!response.data.data.id && !response.data.data.text && !response.data.data.content)) {
      console.warn('[MessageServices] Message created but response is not in expected format:', response.data);
      
      // Return formatted message data
      return {
        data: {
          data: {
            id: `msg-${Date.now()}`,
            content: messageData.content,
            sender: 'user',
            timestamp: new Date().toISOString(),
            status: 'sent',
            chat: chatId
          }
        }
      };
    }
    
    // If the response has data but content is missing, transform it
    if (response.data?.data && !response.data.data.content && response.data.data.text) {
      return {
        data: {
          data: {
            ...response.data.data,
            content: response.data.data.text,
            status: 'sent'
          }
        }
      };
    }
    
    return response;
  } catch (error) {
    console.error('[MessageServices] Error creating message:', error);
    throw error;
  }
};  

export const updateMessageData = async (id, data) => {
  try {
    const response = await updateMessage(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating message with ID ${id}:`, error);
    throw error;
  }
};

export const deleteMessageData = async (id) => {
  try {
    const response = await deleteMessage(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting message with ID ${id}:`, error);
    throw error;
  }
};  
  
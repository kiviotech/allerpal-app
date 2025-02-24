import { 
    createMessage, 
    getMessages, 
    getMessageById, 
    updateMessage, 
    deleteMessage 
  } from '../api/repositories/messageRepositories';
  
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
  
  export const createNewMessage = async (data) => {
    try {
      const response = await createMessage(data);
      return response.data;
    } catch (error) {
      console.error("Error creating message:", error);
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
  
import messageEndpoints from '../endpoints/messageEndpoints';
import apiClient from '../apiClient';

export const getMessages = () => 
  apiClient.get(messageEndpoints.getMessages);

export const getMessageById = (id) => 
  apiClient.get(messageEndpoints.getMessageById(id));

export const createMessage = (data) => 
  apiClient.post(messageEndpoints.createMessage, data);

export const updateMessage = (id, data) => 
  apiClient.put(messageEndpoints.updateMessage(id), data);

export const deleteMessage = (id) => 
  apiClient.delete(messageEndpoints.deleteMessage(id));

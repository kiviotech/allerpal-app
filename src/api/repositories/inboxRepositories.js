import inboxEndpoints from "../endpoints/inboxEndpoints";
import apiClient from "../apiClient";

export const getAllInboxes = () => apiClient.get(inboxEndpoints.getAllInboxes);

export const getInboxesByUserId = (userId) => apiClient.get(inboxEndpoints.getInboxesByUserId(userId));

export const getInboxesByUserResto = (userId, restaurantId) => apiClient.get(inboxEndpoints.getInboxesByUserResto(userId, restaurantId));

export const getInboxById = (id) => apiClient.get(inboxEndpoints.getInboxById(id));

export const createInbox = (data) => 
  apiClient.post(inboxEndpoints.createInbox, data);

export const updateInbox = (id, data) => 
  apiClient.put(inboxEndpoints.updateInbox(id), data);

export const deleteInbox = (id) => 
  apiClient.delete(inboxEndpoints.deleteInbox(id));

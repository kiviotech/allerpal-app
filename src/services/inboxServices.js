import { createInbox, getAllInboxes, getInboxById, getInboxesByUserId, getInboxesByUserResto, updateInbox } from "../api/repositories/inboxRepositories";

// Fetch all inboxes
export const fetchAllInboxes = async () => {
    try {
        const response = await getAllInboxes();
        return response.data;
    } catch (error) {
        console.error("Error fetching inboxes:", error);
        throw error;
    }
};

// Fetch a specific inbox by user ID
export const fetchInboxByuserId = async (userId) => {
    try {
        const response = await getInboxesByUserId(userId);
        return response.data;
    } catch (error) {
        console.error(`Error fetching inbox with ID ${userId}:`, error);
        throw error;
    }
};

// Fetch a specific inbox by user ID
export const fetchInboxByuserResto = async (userId, restaurantId) => {
    try {
        const response = await getInboxesByUserResto(userId, restaurantId);
        return response.data;
    } catch (error) {
        console.error(`Error fetching inbox with ID ${userId}:`, error);
        throw error;
    }
};

// Fetch a specific inbox by ID
export const fetchInboxById = async (id) => {
    try {
        const response = await getInboxById(id);
        return response.data;
    } catch (error) {
        console.error(`Error fetching inbox with ID ${id}:`, error);
        throw error;
    }
};

// Create a new inbox
export const createNewInbox = async (data) => {
    try {
        const response = await createInbox(data);
        return response.data;
    } catch (error) {
        console.error("Error creating inbox:", error);
        throw error;
    }
};

// Update an existing inbox by ID
export const updateInboxById = async (id, data) => {
    try {
        const response = await updateInbox(id, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating inbox with ID ${id}:`, error);
        throw error;
    }
};

// Delete an inbox by ID
export const deleteInboxById = async (id) => {
    try {
        const response = await deleteInbox(id);
        return response.data;
    } catch (error) {
        console.error(`Error deleting inbox with ID ${id}:`, error);
        throw error;
    }
};

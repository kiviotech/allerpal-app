import apiClient from '../api/apiClient';
import userAllergyEndpoints from '../api/endpoints/userAllergyEndpoints';
import {
  getUserAllergies,
  getUserAllergyById,
  createUserAllergy,
  updateUserAllergy,
  deleteUserAllergy,
} from './../api/repositories/userAllergyRepositories';

// Fetch all user allergies
export const fetchAllUserAllergies = async () => {
  try {
    const response = await getUserAllergies();
    return response.data;
  } catch (error) {
    console.error("Error fetching user allergies:", error);
    throw error;
  }
};

// Fetch a specific user allergy by ID
export const fetchUserAllergyById = async (id) => {
  try {
    const response = await getUserAllergyById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user allergy with ID ${id}:`, error);
    throw error;
  }
};

// Create a new user allergy
export const createNewUserAllergy = async (data) => {
  try {
    const response = await apiClient.post(userAllergyEndpoints.createUserAllergy, {data: data});
    return response.data;  // Return the response from the backend
  } catch (error) {
    console.error("Error creating user allergy:", error);
    throw error;  // Rethrow the error to be handled by the calling function
  }
};

// Update an existing user allergy by ID
export const updateUserAllergyById = async (id, data) => {
  try {
    const response = await updateUserAllergy(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user allergy with ID ${id}:`, error);
    throw error;
  }
};

// Delete a user allergy by ID
export const deleteUserAllergyById = async (id) => {
  try {
    const response = await deleteUserAllergy(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user allergy with ID ${id}:`, error);
    throw error;
  }
};

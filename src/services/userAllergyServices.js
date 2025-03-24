import apiClient from '../api/apiClient';
import userAllergyEndpoints from '../api/endpoints/userAllergyEndpoints';
import {
  getUserAllergies,
  getUserAllergyById,
  createUserAllergy,
  updateUserAllergy,
  deleteUserAllergy,
  getUserAllergyByUserId,
  updateUserAllergyByUserId,
} from './../api/repositories/userAllergyRepositories';

// Import profile allergies services for the new implementation
import {
  fetchAllProfileAllergies,
  fetchProfileAllergyById,
  fetchProfileAllergyByProfileId,
  createNewProfileAllergy,
  updateProfileAllergyById,
  deleteProfileAllergyById
} from './profileAllergiesServices';

// Import profile services to find profiles by user ID
import { fetchProfileByUserId } from './profileServices';

/**
 * @deprecated Use profileAllergiesServices instead
 * This module is maintained for backward compatibility
 * New code should use profileAllergiesServices directly
 */

// Helper function to find a user's "myself" profile
const findMyselfProfile = async (userId) => {
  try {
    const response = await fetchProfileByUserId(userId);
    if (response && response.data && response.data.length > 0) {
      // Find the "myself" profile
      const myselfProfile = response.data.find(profile => profile.relation === 'myself');
      if (myselfProfile) {
        return myselfProfile;
      }
    }
    console.warn(`No "myself" profile found for user ${userId}`);
    return null;
  } catch (error) {
    console.error(`Error finding "myself" profile for user ${userId}:`, error);
    return null;
  }
};

// Fetch all user allergies
export const fetchAllUserAllergies = async () => {
  try {
    // For backward compatibility, we'll still try the old endpoint first
    try {
      const response = await getUserAllergies();
      return response.data;
    } catch (oldApiError) {
      // If the old API fails, use the new one
      console.warn('Falling back to profile allergies API');
      const response = await fetchAllProfileAllergies();
      return response;
    }
  } catch (error) {
    console.error("Error fetching user allergies:", error);
    throw error;
  }
};

// Fetch a specific user allergy by ID
export const fetchUserAllergyById = async (id) => {
  try {
    // For backward compatibility, we'll still try the old endpoint first
    try {
      const response = await getUserAllergyById(id);
      return response.data;
    } catch (oldApiError) {
      // If the old API fails, use the new one
      console.warn('Falling back to profile allergies API');
      const response = await fetchProfileAllergyById(id);
      return response;
    }
  } catch (error) {
    console.error(`Error fetching user allergy with ID ${id}:`, error);
    throw error;
  }
};

// Fetch a specific user allergy by user ID
export const fetchUserAllergyByUserId = async (userId) => {
  try {
    // For backward compatibility, we'll still try the old endpoint first
    try {
      const response = await getUserAllergyByUserId(userId);
      return response.data;
    } catch (oldApiError) {
      // If the old API fails, find the user's "myself" profile and get its allergies
      console.warn('Falling back to profile allergies API');
      const myselfProfile = await findMyselfProfile(userId);
      
      if (myselfProfile && myselfProfile.profile_allergies && myselfProfile.profile_allergies.length > 0) {
        // Return the profile allergies in a format compatible with the old API
        return {
          data: [{
            id: myselfProfile.profile_allergies[0].id,
            documentId: myselfProfile.profile_allergies[0].documentId,
            allergies: myselfProfile.profile_allergies[0].allergies || [],
            excludeMayContain: myselfProfile.profile_allergies[0].excludeMayContain || false,
            user: [{ id: userId }]
          }]
        };
      }
      
      // If no profile allergies found, return empty data
      return { data: [] };
    }
  } catch (error) {
    console.error(`Error fetching user allergy with user ID ${userId}:`, error);
    throw error;
  }
};

// Create a new user allergy
export const createNewUserAllergy = async (data) => {
  try {
    // For backward compatibility, we'll still try the old endpoint first
    try {
      const response = await apiClient.post(userAllergyEndpoints.createUserAllergy, {data: data});
      return response.data;
    } catch (oldApiError) {
      // If the old API fails, create a profile allergy instead
      console.warn('Falling back to profile allergies API');
      
      // Find or create the "myself" profile
      const userId = data.user[0];
      const myselfProfile = await findMyselfProfile(userId);
      
      if (!myselfProfile) {
        throw new Error(`Cannot create allergy: No "myself" profile found for user ${userId}`);
      }
      
      // Create profile allergy
      const profileAllergyData = {
        data: {
          profile: myselfProfile.id,
          allergies: data.allergies,
          severity: 'mild',
          excludeMayContain: false
        }
      };
      
      const response = await createNewProfileAllergy(profileAllergyData);
      return response;
    }
  } catch (error) {
    console.error("Error creating user allergy:", error);
    throw error;
  }
};

// Update an existing user allergy by ID
export const updateUserAllergyById = async (id, data) => {
  try {
    // For backward compatibility, we'll still try the old endpoint first
    try {
      const response = await updateUserAllergy(id, data);
      return response.data;
    } catch (oldApiError) {
      // If the old API fails, update the profile allergy instead
      console.warn('Falling back to profile allergies API');
      const response = await updateProfileAllergyById(id, data);
      return response;
    }
  } catch (error) {
    console.error(`Error updating user allergy with ID ${id}:`, error);
    throw error;
  }
};

// Update an existing user allergy by user ID
export const updateUserAllergyByUser = async (userId, data) => {
  try {
    // For backward compatibility, we'll still try the old endpoint first
    try {
      const response = await updateUserAllergyByUserId(userId, data);
      return response.data;
    } catch (oldApiError) {
      // If the old API fails, find the user's "myself" profile and update its allergies
      console.warn('Falling back to profile allergies API');
      const myselfProfile = await findMyselfProfile(userId);
      
      if (!myselfProfile || !myselfProfile.profile_allergies || myselfProfile.profile_allergies.length === 0) {
        throw new Error(`Cannot update allergy: No profile allergies found for user ${userId}`);
      }
      
      // Update the profile allergy
      const profileAllergyId = myselfProfile.profile_allergies[0].id;
      const response = await updateProfileAllergyById(profileAllergyId, data);
      return response;
    }
  } catch (error) {
    console.error(`Error updating user allergy with user ID ${userId}:`, error);
    throw error;
  }
};

// Delete a user allergy by ID
export const deleteUserAllergyById = async (id) => {
  try {
    // For backward compatibility, we'll still try the old endpoint first
    try {
      const response = await deleteUserAllergy(id);
      return response.data;
    } catch (oldApiError) {
      // If the old API fails, delete the profile allergy instead
      console.warn('Falling back to profile allergies API');
      const response = await deleteProfileAllergyById(id);
      return response;
    }
  } catch (error) {
    console.error(`Error deleting user allergy with ID ${id}:`, error);
    throw error;
  }
};

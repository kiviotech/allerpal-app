import apiClient from "../api/apiClient";
import profileEndpoints from "../api/endpoints/profileEndpoints";
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "./../api/repositories/profileRepositories";

// Fetch all profiles
export const fetchAllProfiles = async () => {
  try {
    const response = await getAllProfiles();
    return response.data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
};

// Fetch a specific profile by ID
export const fetchProfileById = async (id) => {
  try {
    const response = await getProfileById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile with ID ${id}:`, error);
    throw error;
  }
};

// Create a new profile
export const createNewProfile = async (data) => {
  try {
    const response = await apiClient.post(profileEndpoints.createProfile, {
      data: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};

// Update an existing profile by ID
export const updateProfileById = async (id, data) => {
  try {
    const response = await updateProfile(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating profile with ID ${id}:`, error);
    throw error;
  }
};

// Delete a profile by ID
export const deleteProfileById = async (id) => {
  try {
    const response = await deleteProfile(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting profile with ID ${id}:`, error);
    throw error;
  }
};

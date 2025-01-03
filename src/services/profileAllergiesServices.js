import apiClient from "../api/apiClient";
import profileAllergiesEndpoints from "../api/endpoints/profileAllergiesEndpoints";
import {
  getAllProfileAllergies,
  getProfileAllergyById,
  createProfileAllergy,
  updateProfileAllergy,
  deleteProfileAllergy,
  getProfileAllergyByProfileId,
} from "./../api/repositories/profileAllergiesRepositories";

// Fetch all profile allergies
export const fetchAllProfileAllergies = async () => {
  try {
    const response = await getAllProfileAllergies();
    return response.data;
  } catch (error) {
    console.error("Error fetching profile allergies:", error);
    throw error;
  }
};

// Fetch a specific profile allergy by ID
export const fetchProfileAllergyById = async (id) => {
  try {
    const response = await getProfileAllergyById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile allergy with ID ${id}:`, error);
    throw error;
  }
};

// Fetch a specific profile allergy by profile ID
export const fetchProfileAllergyByProfileId = async (id) => {
  try {
    const response = await getProfileAllergyByProfileId(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile allergy with ID ${id}:`, error);
    throw error;
  }
};

// Create a new profile allergy
export const createNewProfileAllergy = async (data) => {
  try {
    const response = await createProfileAllergy(data);
    return response.data;
  } catch (error) {
    console.error("Error creating profile allergy:", error);
    throw error;
  }
};

// Update an existing profile allergy by ID
export const updateProfileAllergyById = async (id, data) => {
  try {
    const response = await updateProfileAllergy(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating profile allergy with ID ${id}:`, error);
    throw error;
  }
};

// Delete a profile allergy by ID
export const deleteProfileAllergyById = async (id) => {
  try {
    const response = await deleteProfileAllergy(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting profile allergy with ID ${id}:`, error);
    throw error;
  }
};

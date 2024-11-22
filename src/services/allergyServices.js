import apiClient from '../api/apiClient';
import allergyEndpoints from '../api/endpoints/allergyEndpoints';
import {
    getAllergies,
    getAllergyById,
    
    updateAllergy,
    deleteAllergy,
  } from './../api/repositories/allergyRepositories';

 
  
  // Fetch all allergies
  export const fetchAllAllergies = async () => {
    try {
      const response = await getAllergies();
      return response.data;
    } catch (error) {
      console.error("Error fetching allergies:", error);
      throw error;
    }
  };
  
  // Fetch a specific allergy by ID
  export const fetchAllergyById = async (id) => {
    try {
      const response = await getAllergyById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching allergy with ID ${id}:`, error);
      throw error;
    }
  };
  
  // Create a new allergy
  // export const createNewAllergy = async (data) => {
  //   try {
  //     const response = await createAllergy(data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error creating allergy:", error);
  //     throw error;
  //   }
  // };

export const createNewAllergy = async (data) => {
 
    try {
      const response = await apiClient.post(allergyEndpoints.createAllergy, {data:data});
      return response.data;  // Return the response from the backend
    } catch (error) {
      console.error("Error creating allergy:", error);
      throw error;  // Rethrow the error to be handled by the calling function
    }
  };
  
  // Update an existing allergy by ID
  export const updateAllergyById = async (id, data) => {
    try {
      const response = await updateAllergy(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating allergy with ID ${id}:`, error);
      throw error;
    }
  };
  
  // Delete an allergy by ID
  export const deleteAllergyById = async (id) => {
    try {
      const response = await deleteAllergy(id);
      return response.data;
    } catch (error) {
      console.error(`Error deleting allergy with ID ${id}:`, error);
      throw error;
    }
  };
  
import { createCuisines, getCuisines, getCuisinesById, updateCuisines, deleteCuisines } from '../api/repositories/cuisineRepositories';

  export const fetchAllCuisines = async () => {
    try {
      const response = await getCuisines();
      return response.data;
    } catch (error) {
      console.error("Error fetching cuisines:", error);
      throw error;
    }
  };  
  
  export const fetchCuisinesById = async (id) => {
    try {
      const response = await getCuisinesById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cuisines with ID ${id}:`, error);
      throw error;
    }
  };  

  export const createNewCuisines = async (data) => {
    try {
      const response = await createCuisines(data);
      return response.data;
    } catch (error) {
      console.error("Error creating cuisines:", error);
      throw error;
    }
  };  
  
  export const updateCuisinesData = async (id, data) => {
    try {
      const response = await updateCuisines(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating cuisines with ID ${id}:`, error);
      throw error;
    }
  };

  export const deleteCuisinesData = async (id) => {
    try {
      const response = await deleteCuisines(id);
      return response.data;
    } catch (error) {
      console.error(`Error deleting cuisines with ID ${id}:`, error);
      throw error;
    }
  };  
  
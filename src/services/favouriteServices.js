import { 
    getFavourites, 
    getFavouritesById, 
    createFavourites, 
    updateFavourites, 
    deleteFavourites, 
    getFavouritesByUserId
  } from '../api/repositories/favouritesRepositories';
  
  export const fetchAllFavourites = async () => {
    try {
      const response = await getFavourites();
      return response.data;
    } catch (error) {
      console.error("Error fetching favourites:", error);
      throw error;
    }
  };
  
  export const fetchFavouritesById = async (id) => {
    try {
      const response = await getFavouritesById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching favourites with ID ${id}:`, error);
      throw error;
    }
  };

  export const fetchFavouritesByUserId = async (id) => {
    try {
      const response = await getFavouritesByUserId(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching favourites with ID ${id}:`, error);
      throw error;
    }
  };
  
  export const createNewFavourite = async (data) => {
    try {
      const response = await createFavourites(data);
      return response.data;
    } catch (error) {
      console.error("Error creating favourite:", error);
      throw error;
    }
  };
  
  export const updateFavouriteData = async (id, data) => {
    try {
      const response = await updateFavourites(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating favourite with ID ${id}:`, error);
      throw error;
    }
  };
  
  export const deleteFavouriteData = async (id) => {
    try {
      const response = await deleteFavourites(id);
      return response.data;
    } catch (error) {
      console.error(`Error deleting favourite with ID ${id}:`, error);
      throw error;
    }
  };
  
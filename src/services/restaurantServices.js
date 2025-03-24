import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getFavoriteRestaurants,
  getRestaurants,
} from "../api/repositories/restaurantRepositories";

// Fetch all restaurants with pagination
export const fetchAllRestaurants = async (page = 1, pageSize = 20) => {
  try {
    console.log("[restaurantServices] Fetching restaurants page:", page);
    const response = await getRestaurants(page, pageSize);
    
    // Extract pagination metadata
    const pagination = response.data?.meta?.pagination || {
      page: 1,
      pageSize: 20,
      pageCount: 1,
      total: response.data?.data?.length || 0
    };
    
    return {
      data: response.data?.data || [],
      pagination
    };
  } catch (error) {
    console.error("[restaurantServices] Error fetching restaurants:", error);
    console.error("[restaurantServices] Error details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch restaurants.");
  }
};

// Fetch a specific restaurant by ID
export const fetchRestaurantDetails = async (id) => {
  try {
    console.log("[restaurantServices] Fetching restaurant details for ID:", id);
    const response = await getRestaurantById(id);
    return {
      data: response.data?.data,
      meta: response.data?.meta
    };
  } catch (error) {
    console.error(`[restaurantServices] Error fetching restaurant with ID ${id}:`, error);
    console.error("[restaurantServices] Error details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch restaurant details.");
  }
};

// Create a new restaurant
export const submitNewRestaurant = async (restaurantData) => {
  try {
    console.log("[restaurantServices] Creating new restaurant");
    const response = await createRestaurant(restaurantData);
    return {
      data: response.data?.data,
      meta: response.data?.meta
    };
  } catch (error) {
    console.error("[restaurantServices] Error creating restaurant:", error);
    console.error("[restaurantServices] Error details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create restaurant.");
  }
};

// Update restaurant details
export const updateRestaurantDetails = async (id, updateData) => {
  try {
    console.log("[restaurantServices] Updating restaurant with ID:", id);
    const response = await updateRestaurant(id, updateData);
    return {
      data: response.data?.data,
      meta: response.data?.meta
    };
  } catch (error) {
    console.error(`[restaurantServices] Error updating restaurant with ID ${id}:`, error);
    console.error("[restaurantServices] Error details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update restaurant.");
  }
};

// Delete a restaurant by ID
export const deleteRestaurantEntry = async (id) => {
  try {
    console.log("[restaurantServices] Deleting restaurant with ID:", id);
    const response = await deleteRestaurant(id);
    return {
      data: response.data?.data,
      meta: response.data?.meta
    };
  } catch (error) {
    console.error(`[restaurantServices] Error deleting restaurant with ID ${id}:`, error);
    console.error("[restaurantServices] Error details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete restaurant.");
  }
};

// Get favorite restaurants for a user
export const getFavoriteRestaurantsForUser = async (userId) => {
  try {
    console.log("[restaurantServices] Fetching favorite restaurants for user:", userId);
    const response = await getFavoriteRestaurants(userId);
    return {
      data: response.data?.data || [],
      meta: response.data?.meta
    };
  } catch (error) {
    console.error(`[restaurantServices] Error fetching favorite restaurants for user ${userId}:`, error);
    console.error("[restaurantServices] Error details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch favorite restaurants.");
  }
};

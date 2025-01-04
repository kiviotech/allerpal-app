import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getFavoriteRestaurants,
  getRestaurants,
} from "../api/repositories/restaurantRepositories";

// Fetch all restaurants
export const fetchAllRestaurants = async () => {
  try {
    const response = await getRestaurants();
    return response.data; // Return fetched restaurants
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    throw new Error("Failed to fetch restaurants.");
  }
};

// Fetch a specific restaurant by ID
export const fetchRestaurantDetails = async (id) => {
  try {
    const response = await getRestaurantById(id);
    return response.data; // Return restaurant details
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${id}:`, error);
    throw new Error("Failed to fetch restaurant details.");
  }
};

// Create a new restaurant
export const submitNewRestaurant = async (restaurantData) => {
  try {
    const response = await createRestaurant(restaurantData);
    return response.data; // Return the newly created restaurant
  } catch (error) {
    console.error("Error creating restaurant:", error);
    throw new Error("Failed to create restaurant.");
  }
};

// Update an existing restaurant by ID
export const updateRestaurantDetails = async (id, restaurantData) => {
  try {
    const response = await updateRestaurant(id, restaurantData);
    return response.data;
  } catch (error) {
    console.error(`Error updating restaurant with ID ${id}:`, error);
    throw new Error("Failed to update restaurant.");
  }
};

// Delete a restaurant by ID
export const deleteRestaurantEntry = async (id) => {
  try {
    const response = await deleteRestaurant(id);
    return response.data; // Return response for deletion
  } catch (error) {
    console.error(`Error deleting restaurant with ID ${id}:`, error);
    throw new Error("Failed to delete restaurant.");
  }
};

// Get favorite restaurants for a user
export const getFavoriteRestaurantsForUser = async (userId) => {
  try {
    const response = await getFavoriteRestaurants(userId);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching favorite restaurants for user ${userId}:`,
      error
    );
    throw new Error("Failed to fetch favorite restaurants.");
  }
};

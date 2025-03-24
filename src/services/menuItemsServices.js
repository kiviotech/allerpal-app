import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemBySubcuisine,
  getFoodRecommendationsByProfile,
  getFoodRecommendationsByCuisine,
  getPopularFoodRecommendations
} from "./../api/repositories/menuItemsRepositories";

// Fetch all menu items
export const fetchAllMenuItems = async () => {
  try {
    console.log("[menuItemsServices] Fetching all menu items");
    const response = await getAllMenuItems();
    console.log("[menuItemsServices] Fetched menu items count:", response?.data?.length);
    return response.data;
  } catch (error) {
    console.error("[menuItemsServices] Error fetching menu items:", error);
    throw error;
  }
};

// Fetch a specific menu item by documentId
export const fetchMenuItemById = async (documentId) => {
  try {
    console.log("[menuItemsServices] Fetching menu item with documentId:", documentId);
    const response = await getMenuItemById(documentId);
    console.log("[menuItemsServices] Fetched menu item:", response?.data);
    return response.data;
  } catch (error) {
    console.error(`[menuItemsServices] Error fetching menu item with documentId ${documentId}:`, error);
    throw error;
  }
};

// Fetch menu items by subcuisine
export const fetchMenuItemBySubcuisine = async (id) => {
  try {
    console.log("[menuItemsServices] Fetching menu items by subcuisine:", id);
    const response = await getMenuItemBySubcuisine(id);
    console.log("[menuItemsServices] Fetched menu items by subcuisine count:", response?.data?.length);
    return response.data;
  } catch (error) {
    console.error(`[menuItemsServices] Error fetching menu items by subcuisine ${id}:`, error);
    throw error;
  }
};

// Create a new menu item
export const createNewMenuItem = async (data) => {
  try {
    console.log("[menuItemsServices] Creating new menu item with data:", data);
    const response = await createMenuItem(data);
    console.log("[menuItemsServices] Created menu item:", response?.data);
    return response.data;
  } catch (error) {
    console.error("[menuItemsServices] Error creating menu item:", error);
    throw error;
  }
};

// Update an existing menu item
export const updateExistingMenuItem = async (documentId, data) => {
  try {
    console.log("[menuItemsServices] Updating menu item with documentId:", documentId);
    console.log("[menuItemsServices] Update data:", data);
    const response = await updateMenuItem(documentId, data);
    console.log("[menuItemsServices] Updated menu item:", response?.data);
    return response.data;
  } catch (error) {
    console.error(`[menuItemsServices] Error updating menu item with documentId ${documentId}:`, error);
    throw error;
  }
};

// Delete a menu item
export const deleteExistingMenuItem = async (documentId) => {
  try {
    console.log("[menuItemsServices] Deleting menu item with documentId:", documentId);
    const response = await deleteMenuItem(documentId);
    console.log("[menuItemsServices] Deleted menu item:", response?.data);
    return response.data;
  } catch (error) {
    console.error(`[menuItemsServices] Error deleting menu item with documentId ${documentId}:`, error);
    throw error;
  }
};

// Fetch food recommendations based on user's profile allergies
export const fetchFoodRecommendationsByProfile = async (profileId, restaurantId = null, page = 1, pageSize = 20, sort = 'item_name:asc', cuisine) => {
  try {
    console.log("[menuItemsServices] Fetching food recommendations");
    console.log("[menuItemsServices] Parameters:", { profileId, restaurantId, page, pageSize, sort, cuisine });
    const response = await getFoodRecommendationsByProfile(profileId, restaurantId, page, pageSize, sort, cuisine);
    console.log("[menuItemsServices] API URL used:", response.config?.url);
    console.log("[menuItemsServices] Fetched recommendations count:", response?.data?.data?.length);
    return response.data;
  } catch (error) {
    console.error(`[menuItemsServices] Error fetching food recommendations for profile ${profileId}:`, error);
    console.error("[menuItemsServices] Error details:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch food recommendations filtered by cuisine
export const fetchFoodRecommendationsByCuisine = async (profileId, cuisineId, page = 1, pageSize = 10, sort = 'item_name:asc') => {
  try {
    console.log("[menuItemsServices] Fetching food recommendations by cuisine");
    console.log("[menuItemsServices] Parameters:", { profileId, cuisineId, page, pageSize, sort });
    const response = await getFoodRecommendationsByCuisine(profileId, cuisineId, page, pageSize, sort);
    console.log("[menuItemsServices] API URL used:", response.config?.url);
    console.log("[menuItemsServices] Fetched recommendations count:", response?.data?.data?.length);
    return response.data;
  } catch (error) {
    console.error(`[menuItemsServices] Error fetching food recommendations for profile ${profileId} and cuisine ${cuisineId}:`, error);
    console.error("[menuItemsServices] Error details:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch popular food recommendations
export const fetchPopularFoodRecommendations = async (profileId, page = 1, pageSize = 10) => {
  try {
    console.log("[menuItemsServices] Fetching popular food recommendations");
    console.log("[menuItemsServices] Parameters:", { profileId, page, pageSize });
    const response = await getPopularFoodRecommendations(profileId, page, pageSize);
    console.log("[menuItemsServices] API URL used:", response.config?.url);
    console.log("[menuItemsServices] Fetched popular recommendations count:", response?.data?.data?.length);
    return response.data;
  } catch (error) {
    console.error(`[menuItemsServices] Error fetching popular food recommendations for profile ${profileId}:`, error);
    console.error("[menuItemsServices] Error details:", error.response?.data || error.message);
    throw error;
  }
};

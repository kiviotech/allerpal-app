// Define the endpoints for menu items
const menuItemsEndpoints = {
  getAllMenuItems: '/menu-items?populate=*',
  getMenuItemById: (documentId) => `/menu-items/${documentId}?populate=*`,
  createMenuItem: '/menu-items',
  updateMenuItem: (documentId) => `/menu-items/${documentId}`,
  deleteMenuItem: (documentId) => `/menu-items/${documentId}`,
  getMenuItemBySubcuisine: (id) => `/menu-items?filters[sub_cuisine][id][$eq]=${id}&populate=*`,
};

// Food recommendation endpoints
export const getRecommendationsByProfile = (profileId, restaurantId) => {
  let url = restaurantId 
    ? `/food-recommendations?profileId=${profileId}&restaurantId=${restaurantId}`
    : `/food-recommendations?profileId=${profileId}`;
  
  return url;
};

export const getRecommendationsByCuisine = (profileId, cuisineId) => 
  `/food-recommendations/by-cuisine?profileId=${profileId}&cuisineId=${cuisineId}`;

export const getPopularRecommendations = (profileId) => 
  `/food-recommendations/popular?profileId=${profileId}`;

// Export individual functions for direct import
export const getAllMenuItems = menuItemsEndpoints.getAllMenuItems;
export const getMenuItemById = menuItemsEndpoints.getMenuItemById;
export const createMenuItem = menuItemsEndpoints.createMenuItem;
export const updateMenuItem = menuItemsEndpoints.updateMenuItem;
export const deleteMenuItem = menuItemsEndpoints.deleteMenuItem;
export const getMenuItemBySubcuisine = menuItemsEndpoints.getMenuItemBySubcuisine;

export default menuItemsEndpoints;

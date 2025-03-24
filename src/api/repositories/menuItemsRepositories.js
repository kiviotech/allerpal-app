import apiClient from "../apiClient";
import {
  getAllMenuItems as getAllMenuItemsEndpoint,
  getMenuItemById as getMenuItemByIdEndpoint,
  createMenuItem as createMenuItemEndpoint,
  updateMenuItem as updateMenuItemEndpoint,
  deleteMenuItem as deleteMenuItemEndpoint,
  getMenuItemBySubcuisine as getMenuItemBySubcuisineEndpoint,
  getRecommendationsByProfile,
  getRecommendationsByCuisine,
  getPopularRecommendations
} from "../endpoints/menuItemsEndpoints";

export const getAllMenuItems = () => apiClient.get(getAllMenuItemsEndpoint);

export const getMenuItemById = (id) =>
  apiClient.get(getMenuItemByIdEndpoint(id));

export const getMenuItemBySubcuisine = (id) =>
  apiClient.get(getMenuItemBySubcuisineEndpoint(id));

export const createMenuItem = (data) =>
  apiClient.post(createMenuItemEndpoint, data);

export const updateMenuItem = (id, data) =>
  apiClient.put(updateMenuItemEndpoint(id), data);

export const deleteMenuItem = (id) =>
  apiClient.delete(deleteMenuItemEndpoint(id));

// Get food recommendations based on user's profile allergies
export const getFoodRecommendationsByProfile = (profileId, restaurantId, page = 1, pageSize = 20, sort = 'item_name:asc', cuisine) => {
  let url = getRecommendationsByProfile(profileId, restaurantId);
  
  // Add pagination and sorting parameters
  url += `&page=${page}&pageSize=${pageSize}&sort=${sort}`;
  
  // Add cuisine filter if provided
  if (cuisine) {
    url += `&cuisine=${cuisine}`;
  }
  
  console.log(`[menuItemsRepositories] Fetching recommendations with URL: ${url}`);
  return apiClient.get(url);
};

// Get food recommendations filtered by cuisine
export const getFoodRecommendationsByCuisine = (profileId, cuisineId, page = 1, pageSize = 10, sort = 'item_name:asc') => {
  let url = getRecommendationsByCuisine(profileId, cuisineId);
  
  // Add pagination and sorting parameters
  url += `&page=${page}&pageSize=${pageSize}&sort=${sort}`;
  
  return apiClient.get(url);
};

// Get popular food recommendations
export const getPopularFoodRecommendations = (profileId, page = 1, pageSize = 10) => {
  let url = getPopularRecommendations(profileId);
  
  // Add pagination parameters
  url += `&page=${page}&pageSize=${pageSize}`;
  
  return apiClient.get(url);
};

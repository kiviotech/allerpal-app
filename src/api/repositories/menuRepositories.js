import apiClient from "../apiClient";
import menuEndPoints from "../endpoints/menuEndPoints";

// Fetch all menus
export const getAllMenus = () => apiClient.get(menuEndPoints.getAllMenus);

// Fetch menus by restaurant ID
export const getMenusByRestaurantId = (restaurantId) =>
  apiClient.get(menuEndPoints.getMenusByRestaurantId(restaurantId));

// Fetch menu by menu item ID
export const getMenuByMenuItemId = (menuItemId) =>
  apiClient.get(menuEndPoints.getMenuByMenuItemId(menuItemId));

// Fetch menu by menu ID
export const getMenuById = (id) => apiClient.get(menuEndPoints.getMenusById(id));

// Create a new menu
export const createMenu = (data) => apiClient.post(menuEndPoints.createMenu, data);

// Update a menu by ID
export const updateMenu = (id, data) => apiClient.put(menuEndPoints.updateMenu(id), data);

// Delete a menu by ID
export const deleteMenu = (id) => apiClient.delete(menuEndPoints.deleteMenu(id));
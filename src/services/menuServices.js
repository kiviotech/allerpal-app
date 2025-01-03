import {
  getAllMenus,
  getMenusByRestaurantId,
  getMenuByMenuItemId,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../api/repositories/menuRepositories";

// Fetch all menus
export const fetchAllMenus = async () => {
  try {
    const response = await getAllMenus();
    return response.data;
  } catch (error) {
    console.error("Error fetching all menus:", error);
    throw error;
  }
};

// Fetch menus by restaurant ID
export const fetchMenuByRestaurantId = async (restaurantId) => {
  try {
    const response = await getMenusByRestaurantId(restaurantId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menus for restaurant with ID ${restaurantId}:`, error);
    throw error;
  }
};

// Fetch menu by menu item ID
export const fetchMenuByMenuItemId = async (menuItemId) => {
  try {
    const response = await getMenuByMenuItemId(menuItemId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu for menu item ID ${menuItemId}:`, error);
    throw error;
  }
};

// Fetch menu by ID
export const fetchMenuById = async (id) => {
  try {
    const response = await getMenuById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu with ID ${id}:`, error);
    throw error;
  }
};

// Create a new menu
export const createNewMenu = async (data) => {
    try {
      const response = await createMenu(data);
      return response.data;
    } catch (error) {
      console.error("Error creating menu:", error);
      throw error;
    }
  };
  
  // Update an existing menu by ID
  export const updateMenuById = async (id, data) => {
    try {
      const response = await updateMenu(id, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating menu with ID ${id}:`, error);
      throw error;
    }
  };
  
  // Delete a menu by ID
  export const deleteMenuById = async (id) => {
    try {
      const response = await deleteMenu(id);
      return response.data;
    } catch (error) {
      console.error(`Error deleting menu with ID ${id}:`, error);
      throw error;
    }
  };
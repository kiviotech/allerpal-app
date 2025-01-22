import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemBySubcuisine,
} from "./../api/repositories/menuItemsRepositories";

// Fetch all menu items
export const fetchAllMenuItems = async () => {
  try {
    const response = await getAllMenuItems();
    return response.data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};

// Fetch a specific menu item by ID
export const fetchMenuItemById = async (id) => {
  try {
    const response = await getMenuItemById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu item with ID ${id}:`, error);
    throw error;
  }
};

// Fetch a menu item by subcuisine
export const fetchMenuItemBySubcuisine = async (id) => {
  try {
    const response = await getMenuItemBySubcuisine(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu item with ID ${id}:`, error);
    throw error;
  }
};

// Create a new menu item
export const createNewMenuItem = async (data) => {
  try {
    const response = await createMenuItem(data);
    return response.data;
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
};

// Update an existing menu item by ID
export const updateMenuItemById = async (id, data) => {
  try {
    const response = await updateMenuItem(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating menu item with ID ${id}:`, error);
    throw error;
  }
};

// Delete a menu item by ID
export const deleteMenuItemById = async (id) => {
  try {
    const response = await deleteMenuItem(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting menu item with ID ${id}:`, error);
    throw error;
  }
};

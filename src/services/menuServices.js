import { getAllMenus, getAllMenusById, getMenuByRestaurantId } from "../api/repositories/menuRepository";

export const fetchMenuByRestaurantId = async (id) => {
    try {
        const response = await getMenuByRestaurantId(id);
        return response.data;
    } catch (error) {
        console.error(`Error fetching menu with ID ${id}:`, error);       
        throw error;
    }
}

export const fetchAllMenu = async () => {
    try {
        const response = await getAllMenus();
        return response.data;
    } catch (error) {
        console.error(`Error fetching menu:`, error);       
        throw error;
    }
}

export const fetchMenuById = async (id) => {
    try {
        const response = await getAllMenusById(id);
        return response.data;
    } catch (error) {
        console.error(`Error fetching menu with ID ${id}:`, error);       
        throw error;
    }
}
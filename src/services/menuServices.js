import { getMenuByMenuitemId, getMenuByRestaurantId } from "../api/repositories/menuRepository";

export const fetchMenuByRestaurantId = async (id) => {
    try {
        const response = await getMenuByRestaurantId(id);
        return response.data;
    } catch (error) {
        console.error(`Error fetching menu with ID ${id}:`, error);       
        throw error;
    }
}

export const fetchMenuByMenuitemId = async (id) => {
    try {
        const response = await getMenuByMenuitemId(id);
        return response.data;
    } catch (error) {
        console.error(`Error fetching menu with ID ${id}:`, error);       
        throw error;
    }
}
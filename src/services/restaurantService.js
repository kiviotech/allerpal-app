import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../api/repositories/restaurantRepository";

export const fetchRestaurants = async () => {
  try {
    const response = await getRestaurants();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRestaurantById = async (id) => {
  try {
    const response = await getRestaurantById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewRestaurant = async (data) => {
  try {
    const response = await createRestaurant(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingRestaurant = async (id, data) => {
  try {
    const response = await updateRestaurant(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeRestaurant = async (id) => {
  try {
    const response = await deleteRestaurant(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

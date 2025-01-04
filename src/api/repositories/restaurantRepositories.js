import apiClient from "../apiClient";
import restaurantEndpoints from "../endpoints/restaurantEndpoints";

export const getRestaurants = async () => {
  return await apiClient.get(restaurantEndpoints.getRestaurants);
};

export const getRestaurantById = async (id) => {
  return await apiClient.get(restaurantEndpoints.getRestaurantById(id));
};

export const createRestaurant = async (data) => {
  return await apiClient.post(restaurantEndpoints.createRestaurant, { data });
};

export const updateRestaurant = async (id, data) => {
  return await apiClient.put(restaurantEndpoints.updateRestaurant(id), data);
};

export const deleteRestaurant = async (id) => {
  return await apiClient.delete(restaurantEndpoints.deleteRestaurant(id));
};

export const getFavoriteRestaurants = async (id) => {
  return await apiClient.get(restaurantEndpoints.getFavoriteRestaurants(id));
};

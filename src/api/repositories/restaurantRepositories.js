
import apiClient from "../apiClient";
import restaurantEndpoints from "../endpoints/restaurantEndpoints";

export const getAllRestaurants = () => apiClient.get(restaurantEndpoints.getAllRestaurants);

export const getRestaurantById = (id) => apiClient.get(restaurantEndpoints.getRestaurantById(id));

export const createRestaurant = (data) => apiClient.post(restaurantEndpoints.createRestaurant, data);

export const updateRestaurant = (id, data) => apiClient.put(restaurantEndpoints.updateRestaurant(id), data);

export const deleteRestaurant = (id) => apiClient.delete(restaurantEndpoints.deleteRestaurant(id));



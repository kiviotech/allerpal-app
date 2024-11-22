import apiClient from "../apiClient";
import restaurantEndpoints from "../endpoints/restaurantEndpoints";

export const getAllRestaurants = (id) =>
  apiClient.get(restaurantEndpoints.getAllRestaurants.replace("${id}", id));

export const getRestaurantById = (id) =>
  apiClient.get(restaurantEndpoints.getRestaurantById(id));

export const createRestaurant = (data) =>
  apiClient.post(restaurantEndpoints.createRestaurant, { data });

export const updateRestaurant = (id, data) =>
  apiClient.put(restaurantEndpoints.updateRestaurant(id), data);

export const deleteRestaurant = (id) =>
  apiClient.delete(restaurantEndpoints.deleteRestaurant(id));

export const getFavoriteRestaurants = (id) =>
  apiClient.get(restaurantEndpoints.getFavoriteRestaurants(id));

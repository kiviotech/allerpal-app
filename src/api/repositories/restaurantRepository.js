import apiClient from "../apiClient";
import restaurantEndpoints from "../endpoints/restaurantEndpoints";

export const getRestaurants = () =>
  apiClient.get(restaurantEndpoints.getRestaurants);

export const getRestaurantById = (id) =>
  apiClient.get(restaurantEndpoints.getRestaurantById(id));

export const createRestaurant = (data) =>
  apiClient.post(restaurantEndpoints.createRestaurant, data);

export const updateRestaurant = (id, data) =>
  apiClient.put(restaurantEndpoints.updateRestaurant(id), data);

export const deleteRestaurant = (id) =>
  apiClient.delete(restaurantEndpoints.deleteRestaurant(id));

export const getRestaurantsByUserAndProject = (id, projectId) =>
  apiClient.get(
    restaurantEndpoints.getRestaurantsByUserAndProject(id, projectId)
  );

export const getRestaurantsByUser = (id) =>
  apiClient.get(restaurantEndpoints.getRestaurantsByUser(id));

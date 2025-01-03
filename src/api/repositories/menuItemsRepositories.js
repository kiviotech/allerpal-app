import menuItemsEndpoints from "../endpoints/menuItemsEndpoints";
import apiClient from "./../apiClient";

export const getAllMenuItems = () =>
  apiClient.get(menuItemsEndpoints.getAllMenuItems);

export const getMenuItemById = (id) =>
  apiClient.get(menuItemsEndpoints.getMenuItemById(id));

export const getMenuItemBySubcuisine = (data) =>
  apiClient.get(menuItemsEndpoints.getMenuItemBySubcuisine(data));

export const createMenuItem = (data) =>
  apiClient.post(menuItemsEndpoints.createMenuItem, data);

export const updateMenuItem = (id, data) =>
  apiClient.put(menuItemsEndpoints.updateMenuItem(id), data);

export const deleteMenuItem = (id) =>
  apiClient.delete(menuItemsEndpoints.deleteMenuItem(id));

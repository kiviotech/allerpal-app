import menuEndPoints from "../endpoints/menuEndPoint";
import apiClient from "../apiClient";

export const getMenuByRestaurantId = (id) => apiClient.get(menuEndPoints.getMenusByRestaurantId(id));

export const getAllMenus = () => apiClient.get(menuEndPoints.getAllMenus());

export const getAllMenusById = (id) => apiClient.get(menuEndPoints.getMenusById(id));


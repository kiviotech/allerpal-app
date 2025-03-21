import menuEndPoints from "../endpoints/menuEndPoint";
import apiClient from "../apiClient";

export const getMenuByRestaurantId = (id) => apiClient.get(menuEndPoints.getMenusByRestaurantId(id));
import apiClient from "../apiClient";
import menuEndpoints from "../endpoints/menuEndpoints";

export const getMenus = () => apiClient.get(menuEndpoints.getMenus);
export const getMenuItems = () => apiClient.get(menuEndpoints.getmenuItems);


export const getMenuById = (id) =>
  apiClient.get(menuEndpoints.getMenuById(id));

export const createMenu = (data) =>
  apiClient.post(menuEndpoints.createMenu, data);

export const updateMenu = (id, data) =>
  apiClient.put(menuEndpoints.updateMenu(id), data);

export const deleteMenu = (id) =>
  apiClient.delete(menuEndpoints.deleteMenu(id));

// src/store/actions/menuActions.js
import apiClient from '../../api/apiClient';

export const GET_MENUS = 'GET_MENUS';

export const getMenus = () => async (dispatch) => {
  try {
    const response = await apiClient.get('/menus?populate=*');
    dispatch({ type: GET_MENUS, payload: response.data });
  } catch (error) {
    console.error('Error fetching menus:', error);
  }
};
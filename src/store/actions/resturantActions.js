// src/store/actions/restaurantActions.js
import apiClient from '../../api/apiClient';

export const GET_RESTAURANT = 'GET_RESTAURANT';

export const getRestaurantById = (restaurantId) => async (dispatch) => {
  try {
    const response = await apiClient.get(`/restaurants/${restaurantId}?populate=*`);
    dispatch({ type: GET_RESTAURANT, payload: response.data });
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
  }
};
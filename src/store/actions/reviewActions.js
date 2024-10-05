// src/store/actions/reviewActions.js
import apiClient from '../../api/apiClient';

export const GET_REVIEWS = 'GET_REVIEWS';

export const getReviews = (restaurantId) => async (dispatch) => {
  try {
    const response = await apiClient.get(`/reviews?filters[restaurant][id]=${restaurantId}&populate=*`);
    dispatch({ type: GET_REVIEWS, payload: response.data });
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};
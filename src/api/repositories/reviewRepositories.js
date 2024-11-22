import apiClient from "../apiClient";
import reviewEndpoints from "../endpoints/reviewEndpoints";

export const getAllReviews = () => apiClient.get(reviewEndpoints.getReviews);

export const getReviewById = (id) =>
  apiClient.get(reviewEndpoints.getReviewsById(id));

export const getReviewsByRestaurantId = (restaurantId) =>
  apiClient.get(reviewEndpoints.getReviewsByRestaurantId(restaurantId));

export const createReview = (data) =>
  apiClient.post(reviewEndpoints.createReview, data);

export const updateReview = (id, data) =>
  apiClient.put(reviewEndpoints.updateReview(id), data);

export const deleteReview = (id) =>
  apiClient.delete(reviewEndpoints.deleteReview(id));

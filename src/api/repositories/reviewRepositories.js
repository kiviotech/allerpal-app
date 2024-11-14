import apiClient from "../apiClient";
import restaurantEndpoints from "../endpoints/restaurantEndpoints";
import reviewEndpoints from '../endpoints/reviewEndpoints'


export const getAllReviews = () => apiClient.get(reviewEndpoints.getReviews);
export const getReviewById = (id) => apiClient.get(reviewEndpoints.getReviewsyById);
export const createReview = (data) =>apiClient.post(reviewEndpoints.createReviews)
export const updateReview =(id,data)=>apiClient.put(reviewEndpoints.updateReviews)
export const deleteReview = (id)=> apiClient.delete(reviewEndpoints.deleteReviews)
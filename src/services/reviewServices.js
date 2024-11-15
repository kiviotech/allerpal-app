import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByRestaurantId,
} from "../api/repositories/reviewRepositories";

export const fetchAllReviews = async () => {
  try {
    const response = await getAllReviews();
    return response.data;
  } catch (error) {
    console.error("Error fetching all reviews:", error.message);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch reviews."
    );
  }
};

export const fetchReviewDetails = async (id) => {
  try {
    const response = await getReviewById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching review with ID ${id}:`, error.message);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch review details."
    );
  }
};

export const fetchReviewsByRestaurantId = async (restaurantId) => {
  try {
    const response = await getReviewsByRestaurantId(restaurantId);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching reviews for restaurant with ID ${restaurantId}:`,
      error.message
    );
    throw new Error(
      error?.response?.data?.message ||
        "Failed to fetch reviews for the restaurant."
    );
  }
};

export const submitNewReview = async (reviewData) => {
  try {
    const response = await createReview(reviewData);
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error.message);
    throw new Error(
      error?.response?.data?.message || "Failed to submit the review."
    );
  }
};

export const updateReviewDetails = async (id, reviewData) => {
  try {
    const response = await updateReview(id, reviewData);
    return response.data;
  } catch (error) {
    console.error(`Error updating review with ID ${id}:`, error.message);
    throw new Error(
      error?.response?.data?.message || "Failed to update the review."
    );
  }
};

export const deleteReviewEntry = async (id) => {
  try {
    const response = await deleteReview(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error.message);
    throw new Error(
      error?.response?.data?.message || "Failed to delete the review."
    );
  }
};

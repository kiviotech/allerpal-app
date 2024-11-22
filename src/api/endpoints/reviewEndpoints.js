const reviewEndpoints = {
  getReviews: "/reviews?populate=*",
  getReviewsById: (id) => `/reviews/${id}?populate=*`,
  getReviewsByRestaurantId: (id) =>
    `/reviews?filters[restaurant][documentId][$eq]=${id}&populate=*`,
  createReview: "/reviews",
  updateReview: (id) => `/reviews/${id}`,
  deleteReview: (id) => `/reviews/${id}`,
};

export default reviewEndpoints;

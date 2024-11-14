const reviewEndpoints = {
    getReviews: "/reviews?populate=*", // GET all allergies
    getReviewsyById: (id) => `/reviews/${id}`, // GET an allergy by ID
    createReviews: "/reviews", // POST a new allergy
    updateReviews: (id) => `/reviews/${id}`, // PUT to update an allergy by ID
    deleteReviews: (id) => `/reviews/${id}`, // DELETE an allergy by ID
};

export default reviewEndpoints;
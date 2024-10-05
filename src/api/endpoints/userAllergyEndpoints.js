const userAllergyEndpoints = {
  getUserAllergies: "/user-allergies",
  getUserAllergyById: (id) => `/user-allergies/${id}?populate=*`,
  createUserAllergy: "/user-allergies",
  updateUserAllergy: (id) => `/user-allergies/${id}`,
  deleteUserAllergy: (id) => `/user-allergies/${id}`,

  // Endpoint to fetch user allergies by userId
  getUserAllergiesByUser: (userId) =>
    `/user-allergies?filters[user][id][$eq]=${userId}&populate=*`,
};

export default userAllergyEndpoints;

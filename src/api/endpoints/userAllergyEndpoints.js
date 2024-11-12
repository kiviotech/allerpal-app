const userAllergyEndpoints = {
    getUserAllergies: "/user-allergies?populate=*", // GET all user allergies
    getUserAllergyById: (id) => `/user-allergies/${id}`, // GET a user allergy by ID
    createUserAllergy: "/user-allergies", // POST a new user allergy
    updateUserAllergy: (id) => `/user-allergies/${id}`, // PUT to update a user allergy by ID
    deleteUserAllergy: (id) => `/user-allergies/${id}`, // DELETE a user allergy by ID
};

export default userAllergyEndpoints;

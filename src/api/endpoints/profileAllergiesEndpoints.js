const profileAllergiesEndpoints = {
  getAllProfileAllergies: "/profile-allergies?populate=*", // GET all profile allergies
  getProfileAllergyById: (id) => `/profile-allergies/${id}`, // GET a profile allergy by ID
  createProfileAllergy: "/profile-allergies", // POST a new profile allergy
  updateProfileAllergy: (id) => `/profile-allergies/${id}`, // PUT to update a profile allergy by ID
  deleteProfileAllergy: (id) => `/profile-allergies/${id}`, // DELETE a profile allergy by ID
};

export default profileAllergiesEndpoints;

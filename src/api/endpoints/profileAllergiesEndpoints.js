const profileAllergiesEndpoints = {
  getAllProfileAllergies: "/profile-allergies?populate=*", // GET all profile allergies
  getProfileAllergyById: (id) => `/profile-allergies/${id}?populate=*`, // GET a profile allergy by ID
  getProfileAllergiesbyProfileId: (id) => `/profile-allergies?filters[profile][id][$eq]=${id}&populate[allergies][populate]=*`,
  createProfileAllergy: "/profile-allergies", // POST a new profile allergy
  updateProfileAllergy: (id) => `/profile-allergies/${id}`, // PUT to update a profile allergy by ID
  deleteProfileAllergy: (id) => `/profile-allergies/${id}`, // DELETE a profile allergy by ID
};

export default profileAllergiesEndpoints;

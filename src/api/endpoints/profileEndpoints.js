const profileEndpoints = {
  getAllProfiles: "/profiles?populate=*", // GET all profiles
  getProfileById: (id) => `/profiles/${id}?populate=*`, // GET a profile by ID
  getProfileByUserId: (userId) => `/profiles?filters[user][id][$eq]=${userId}&populate[profile_allergies][populate][allergies][populate]=Allergen_icon`,
  createProfile: "/profiles", // POST a new profile
  updateProfile: (id) => `/profiles/${id}`, // PUT to update a profile by ID
  deleteProfile: (id) => `/profiles/${id}`, // DELETE a profile by ID
};

export default profileEndpoints;

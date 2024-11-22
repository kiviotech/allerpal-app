const profileEndpoints = {
  getAllProfiles: "/profiles?populate=*", // GET all profiles
  getProfileById: (id) => `/profiles/${id}`, // GET a profile by ID
  createProfile: "/profiles", // POST a new profile
  updateProfile: (id) => `/profiles/${id}`, // PUT to update a profile by ID
  deleteProfile: (id) => `/profiles/${id}`, // DELETE a profile by ID
};

export default profileEndpoints;

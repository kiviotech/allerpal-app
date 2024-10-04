const allergyEndpoints = {
  getAllergies: "/allergies",
  getAllergyById: (id) => `/allergies/${id}?populate=*`,
  createAllergy: "/allergies",
  updateAllergy: (id) => `/allergies/${id}`,
  deleteAllergy: (id) => `/allergies/${id}`,
};

export default allergyEndpoints;

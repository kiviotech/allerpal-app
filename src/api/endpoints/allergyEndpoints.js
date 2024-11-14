const allergyEndpoints = {
    getAllAllergies: "/allergies?populate=*", // GET all allergies
    getAllergyById: (id) => `/allergies/${id}`, // GET an allergy by ID
    createAllergy: "/allergies", // POST a new allergy
    updateAllergy: (id) => `/allergies/${id}`, // PUT to update an allergy by ID
    deleteAllergy: (id) => `/allergies/${id}`, // DELETE an allergy by ID
};

export default allergyEndpoints;
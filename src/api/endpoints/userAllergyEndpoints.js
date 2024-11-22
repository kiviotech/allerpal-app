// const userAllergyEndpoints = {
//   getUserAllergies: "/user-allergies?populate=*",
//   //   getUserAllergyById: (id) => `/user-allergies/${id}?populate=*`,
//   getUserAllergyById: (id) => `user-allergies?filters[user]=${id}&populate=*`,
//   createUserAllergy: "/user-allergies",
//   updateUserAllergy: (id) => `/user-allergies/${id}`,
//   deleteUserAllergy: (id) => `/user-allergies/${id}`, // DELETE a user allergy by ID
// };

// export default userAllergyEndpoints;

const userAllergyEndpoints = {
  getUserAllergies: "/user-allergies?populate=*",
  //   getUserAllergyById: (id) => /user-allergies/${id}?populate=*,
  // getUserAllergyById: (id) => user-allergies?filters[user]=${id}&populate=*,

  getUserAllergyById: (id) => `user-allergies?filters[user]=${id}&populate=allergies.Allergeimage`,


 


  createUserAllergy: "/user-allergies",
  updateUserAllergy: (id) =>` /user-allergies/${id}`,
  deleteUserAllergy: (id) => `/user-allergies/${id}`, // DELETE a user allergy by ID
};

export default userAllergyEndpoints;
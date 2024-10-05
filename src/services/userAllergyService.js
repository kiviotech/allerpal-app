import {
  getUserAllAllergies,
  getUserAllergyById,
  createUserAllergy,
  updateUserAllergy,
  deleteUserAllergy,
  getUserAllergiesByUser,
} from "../api/repositories/userAllergyRepository";

export const fetchUserAllAllergies = async () => {
  try {
    const response = await getUserAllAllergies();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserAllergyById = async (id) => {
  try {
    const response = await getUserAllergyById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewUserAllergy = async (data) => {
  try {
    const response = await createUserAllergy(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingUserAllergy = async (id, data) => {
  try {
    const response = await updateUserAllergy(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeUserAllergy = async (id) => {
  try {
    const response = await deleteUserAllergy(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// For fetching user allergies by userId
export const fetchUserAllergiesByUser = async (userId) => {
  try {
    const response = await getUserAllergiesByUser(userId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

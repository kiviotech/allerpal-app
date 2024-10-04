import {
  getAllergies,
  getAllergyById,
  createAllergy,
  updateAllergy,
  deleteAllergy,
} from "../api/repositories/allergyRepository";

export const fetchAllergies = async () => {
  try {
    const response = await getAllergies();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllergyById = async (id) => {
  try {
    const response = await getAllergyById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewAllergy = async (data) => {
  try {
    const response = await createAllergy(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExistingAllergy = async (id, data) => {
  try {
    const response = await updateAllergy(id, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeAllergy = async (id) => {
  try {
    const response = await deleteAllergy(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

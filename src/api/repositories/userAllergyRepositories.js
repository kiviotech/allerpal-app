
import apiClient from './../apiClient';
import userAllergyEndpoints from './../endpoints/userAllergyEndpoints';

export const getUserAllergies = () => apiClient.get(userAllergyEndpoints.getUserAllergies);

export const getUserAllergyById = (id) => apiClient.get(userAllergyEndpoints.getUserAllergyById(id));

export const createUserAllergy = (data) => 
  apiClient.post(userAllergyEndpoints.createUserAllergy, data);

export const updateUserAllergy = (id, data) => 
  apiClient.put(userAllergyEndpoints.updateUserAllergy(id), data);

export const deleteUserAllergy = (id) => 
  apiClient.delete(userAllergyEndpoints.deleteUserAllergy(id));

// import apiClient from "../apiClient";
import allergyEndpoints from "../endpoints/allergyEndpoints";
import apiClient from './../apiClient';

export const getAllergies = () => apiClient.get(allergyEndpoints.getAllAllergies);

export const getAllergyById = (id) => apiClient.get(allergyEndpoints.getAllergyById(id));

export const createAllergy = (data) => 
  apiClient.post(allergyEndpoints.createAllergy, data);

export const updateAllergy = (id, data) => 
  apiClient.put(allergyEndpoints.updateAllergy(id), data);

export const deleteAllergy = (id) => 
  apiClient.delete(allergyEndpoints.deleteAllergy(id));

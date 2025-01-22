import profileAllergiesEndpoints from "../endpoints/profileAllergiesEndpoints";
import apiClient from "./../apiClient";

export const getAllProfileAllergies = () =>
  apiClient.get(profileAllergiesEndpoints.getAllProfileAllergies);

export const getProfileAllergyById = (id) =>
  apiClient.get(profileAllergiesEndpoints.getProfileAllergyById(id));

export const getProfileAllergyByProfileId = (id) =>
  apiClient.get(profileAllergiesEndpoints.getProfileAllergiesbyProfileId(id));

export const createProfileAllergy = (data) =>
  apiClient.post(profileAllergiesEndpoints.createProfileAllergy, data);

export const updateProfileAllergy = (id, data) =>
  apiClient.put(profileAllergiesEndpoints.updateProfileAllergy(id), data);

export const deleteProfileAllergy = (id) =>
  apiClient.delete(profileAllergiesEndpoints.deleteProfileAllergy(id));

import profileEndpoints from "../endpoints/profileEndpoints";
import apiClient from "./../apiClient";

export const getAllProfiles = () =>
  apiClient.get(profileEndpoints.getAllProfiles);

export const getProfileById = (id) =>
  apiClient.get(profileEndpoints.getProfileById(id));

export const getProfileByUserId = (userId) =>
  apiClient.get(profileEndpoints.getProfileByUserId(userId));

export const createProfile = (data) =>
  apiClient.post(profileEndpoints.createProfile, data);

export const updateProfile = (id, data) =>
  apiClient.put(profileEndpoints.updateProfile(id), data);

export const deleteProfile = (id) =>
  apiClient.delete(profileEndpoints.deleteProfile(id));

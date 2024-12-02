import cuisineEndPoints from '../endpoints/cuisinesEndpoints';
import apiClient from './../apiClient';

export const getCuisines = () => apiClient.get(cuisineEndPoints.getCuisines);

export const getCuisinesById = (id) => 
  apiClient.get(cuisineEndPoints.getCuisinesById(id));

export const createCuisines = (data) => 
  apiClient.post(cuisineEndPoints.createCuisines, data);

export const updateCuisines = (id, data) => 
  apiClient.put(cuisineEndPoints.updateCuisines(id), data);

export const deleteCuisines = (id) => 
  apiClient.delete(cuisineEndPoints.deleteCuisines(id));


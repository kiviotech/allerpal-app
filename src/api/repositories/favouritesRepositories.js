import favouritesEndPoints from '../endpoints/favouritesEndpoints';
import apiClient from './../apiClient';

export const getFavourites = () => apiClient.get(favouritesEndPoints.getFavourites);

export const getFavouritesByUserId = (id) => 
    apiClient.get(favouritesEndPoints.getFavouritesByUserId(id));

export const getFavouritesById = (id) => 
  apiClient.get(favouritesEndPoints.getFavouritesById(id));

export const createFavourites = (data) => 
  apiClient.post(favouritesEndPoints.createFavourites, data);

export const updateFavourites = (id, data) => 
  apiClient.put(favouritesEndPoints.updateFavourites(id), data);

export const deleteFavourites = (id) => 
  apiClient.delete(favouritesEndPoints.deleteFavourites(id));

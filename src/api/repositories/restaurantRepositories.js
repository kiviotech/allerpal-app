import apiClient from "../apiClient";
import restaurantEndpoints from "../endpoints/restaurantEndpoints";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async (requestFn, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      console.log(`Retrying request, ${retries} attempts remaining`);
      await wait(delay);
      return retryRequest(requestFn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const getRestaurants = async (page, pageSize) => {
  const endpoint = page ? 
    restaurantEndpoints.getRestaurantsByPage(page, pageSize) : 
    restaurantEndpoints.getRestaurants;
  
  return retryRequest(() => apiClient.get(endpoint));
};

export const getRestaurantById = async (id) => {
  return retryRequest(() => apiClient.get(restaurantEndpoints.getRestaurantById(id)));
};

export const createRestaurant = async (data) => {
  return retryRequest(() => apiClient.post(restaurantEndpoints.createRestaurant, { data }));
};

export const updateRestaurant = async (id, data) => {
  return retryRequest(() => apiClient.put(restaurantEndpoints.updateRestaurant(id), { data }));
};

export const deleteRestaurant = async (id) => {
  return retryRequest(() => apiClient.delete(restaurantEndpoints.deleteRestaurant(id)));
};

export const getFavoriteRestaurants = async (id) => {
  return retryRequest(() => apiClient.get(restaurantEndpoints.getFavoriteRestaurants(id)));
};

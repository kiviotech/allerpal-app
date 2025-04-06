import { Platform } from 'react-native';
import * as ExpoLocation from 'expo-location';
import { getCurrentLocation as getLocationWithErrorHandling } from './geolocationService';

/**
 * Legacy function to get current location
 * @returns {Promise<Object>} - Location object with coordinates
 * @deprecated Use geolocationService.getCurrentLocation() instead
 */
export const getCurrentLocation = async () => {
  try {
    // Use the new robust implementation
    return await getLocationWithErrorHandling();
  } catch (error) {
    // Log and rethrow
    console.error('Error getting location in locationUtils:', error);
    throw error;
  }
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {Object} point1 - First point with latitude and longitude
 * @param {Object} point2 - Second point with latitude and longitude
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (point1, point2) => {
  if (!point1 || !point2 || !point1.latitude || !point2.latitude) {
    return null;
  }

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.latitude)) *
      Math.cos(toRad(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(1));
};

/**
 * Filter restaurants by distance from user location
 * @param {Array} restaurants - Array of restaurant objects
 * @param {Object} userLocation - User location object
 * @param {number} maxDistance - Maximum distance in kilometers
 * @returns {Array} - Filtered restaurants
 */
export const filterRestaurantsByDistance = (restaurants, userLocation, maxDistance) => {
  if (!userLocation || !Array.isArray(restaurants)) {
    return restaurants || [];
  }

  return restaurants.filter((restaurant) => {
    const restaurantLocation = {
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    };

    const distance = calculateDistance(userLocation, restaurantLocation);
    return distance !== null && distance <= maxDistance;
  });
};

/**
 * Sort restaurants by distance from user location
 * @param {Array} restaurants - Array of restaurant objects
 * @param {Object} userLocation - User location object
 * @returns {Array} - Sorted restaurants
 */
export const sortRestaurantsByDistance = (restaurants, userLocation) => {
  if (!userLocation || !Array.isArray(restaurants)) {
    return restaurants || [];
  }

  return [...restaurants].sort((a, b) => {
    const distanceA = calculateDistance(userLocation, {
      latitude: a.latitude,
      longitude: a.longitude,
    });
    
    const distanceB = calculateDistance(userLocation, {
      latitude: b.latitude,
      longitude: b.longitude,
    });

    if (distanceA === null) return 1;
    if (distanceB === null) return -1;
    return distanceA - distanceB;
  });
}; 
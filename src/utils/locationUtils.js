import { Platform } from 'react-native';
import * as ExpoLocation from 'expo-location';
import { getDistance } from 'geolib';

// Request location permissions and get current position
export const getCurrentLocation = async () => {
  try {
    if (Platform.OS === 'web') {
      // Use browser's Geolocation API for web
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser.'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          },
          { 
            enableHighAccuracy: true, 
            timeout: 15000, 
            maximumAge: 10000 
          }
        );
      });
    } else {
      // Use Expo Location for native platforms
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    }
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

// Calculate distance between two points in kilometers
export const calculateDistance = (userLocation, restaurantLocation) => {
  if (!userLocation || !restaurantLocation) return null;

  try {
    const distanceInMeters = getDistance(
      { latitude: userLocation.latitude, longitude: userLocation.longitude },
      { latitude: restaurantLocation.latitude, longitude: restaurantLocation.longitude }
    );

    // Convert to kilometers
    return (distanceInMeters / 1000).toFixed(1);
  } catch (error) {
    console.error('Error calculating distance:', error);
    return null;
  }
};

// Filter restaurants based on maximum distance (in kilometers)
export const filterRestaurantsByDistance = (restaurants, userLocation, maxDistance = 10) => {
  if (!userLocation || !restaurants) return [];

  return restaurants.filter(restaurant => {
    if (!restaurant.location?.latitude || !restaurant.location?.longitude) return false;

    const distance = calculateDistance(userLocation, {
      latitude: restaurant.location.latitude,
      longitude: restaurant.location.longitude,
    });

    return distance !== null && distance <= maxDistance;
  });
};

// Sort restaurants by distance from user
export const sortRestaurantsByDistance = (restaurants, userLocation) => {
  if (!userLocation || !restaurants) return [];

  return [...restaurants].sort((a, b) => {
    const distanceA = calculateDistance(userLocation, {
      latitude: a.location?.latitude,
      longitude: a.location?.longitude,
    });
    const distanceB = calculateDistance(userLocation, {
      latitude: b.location?.latitude,
      longitude: b.location?.longitude,
    });

    if (!distanceA) return 1;
    if (!distanceB) return -1;
    return distanceA - distanceB;
  });
}; 
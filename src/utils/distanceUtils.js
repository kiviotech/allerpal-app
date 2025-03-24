import axios from "axios";
import useAuthStore from "../../useAuthStore";
import { geocodeAddress } from './geocodingUtils';

const GOOGLE_MAPS_API_KEY = "AIzaSyAdVO77J0_bxxv0auNHF-AwsCXcd9mFal8"; // Updated API key

const hardcodedCoordinates = {
    latitude: 51.479342,
    longitude: -0.298706,
  };

// Function to get coordinates from an address using Google Geocoding API
// export const getCoordinatesFromAddress = async (address) => {
//   try {
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
//     );
//     const location = response.data.results[0]?.geometry?.location;
//     if (location) {
//       return {
//         latitude: location.lat,
//         longitude: location.lng,
//       };
//     }
//     return null; // Return null if geocoding fails
//   } catch (error) {
//     console.error("Error fetching coordinates:", error);
//     return null;
//   }
// };

// Parse location string into coordinates object
export const parseLocationString = async (locationString) => {
  if (!locationString) return null;
  
  try {
    // Check if it's already an object
    if (typeof locationString === 'object' && locationString.latitude && locationString.longitude) {
      return locationString;
    }
    
    // Try to parse as a string with format "lat,lng"
    const parts = locationString.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      
      if (!isNaN(lat) && !isNaN(lng)) {
        return {
          latitude: lat,
          longitude: lng
        };
      }
    }
    
    // If it's an address string, geocode it
    const geocodedLocation = await geocodeAddress(locationString);
    if (geocodedLocation) {
      return geocodedLocation;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing location string:', error);
    return null;
  }
};

// Function to calculate distance between two sets of coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Function to calculate distance from user to a specified location
export const calculateDistanceFromUser = async (destinationCoords) => {
  const { latitude, longitude } = useAuthStore.getState(); // Access user's location from Zustand
  
  if (!latitude || !longitude) {
    console.error("User location is not available");
    return null;
  }

  // Parse destination coordinates if they're in string format
  const parsedDestination = typeof destinationCoords === 'string' 
    ? parseLocationString(destinationCoords) 
    : destinationCoords;
    
  if (!parsedDestination || !parsedDestination.latitude || !parsedDestination.longitude) {
    console.error("Invalid destination coordinates");
    return null;
  }

  const distance = calculateDistance(
    latitude,
    longitude,
    parsedDestination.latitude,
    parsedDestination.longitude
  );

  return distance.toFixed(2); // Return distance as a string with 2 decimal places
};

// Function to calculate distance between a specified location and a restaurant
export const calculateDistanceFromLocation = (sourceCoords, destinationCoords) => {
  // Parse source coordinates if they're in string format
  const parsedSource = typeof sourceCoords === 'string'
    ? parseLocationString(sourceCoords)
    : sourceCoords;
    
  // Parse destination coordinates if they're in string format
  const parsedDestination = typeof destinationCoords === 'string'
    ? parseLocationString(destinationCoords)
    : destinationCoords;
  
  if (!parsedSource || !parsedSource.latitude || !parsedSource.longitude) {
    console.error("Invalid source coordinates");
    return null;
  }

  if (!parsedDestination || !parsedDestination.latitude || !parsedDestination.longitude) {
    console.error("Invalid destination coordinates");
    return null;
  }

  const distance = calculateDistance(
    parsedSource.latitude,
    parsedSource.longitude,
    parsedDestination.latitude,
    parsedDestination.longitude
  );

  return distance.toFixed(2); // Return distance as a string with 2 decimal places
};

// Function to filter restaurants by distance from a specified location
export const filterRestaurantsByDistance = (restaurants, sourceCoords, maxDistance) => {
  if (!restaurants || !sourceCoords || !maxDistance) {
    return [];
  }

  // Parse source coordinates if they're in string format
  const parsedSource = typeof sourceCoords === 'string'
    ? parseLocationString(sourceCoords)
    : sourceCoords;
    
  if (!parsedSource) return [];

  return restaurants.filter(restaurant => {
    const restaurantCoords = parseLocationString(restaurant.location);
    
    if (!restaurantCoords) return false;

    const distance = calculateDistance(
      parsedSource.latitude,
      parsedSource.longitude,
      restaurantCoords.latitude,
      restaurantCoords.longitude
    );

    return distance <= maxDistance;
  });
};

// Function to sort restaurants by distance from a specified location
export const sortRestaurantsByDistance = (restaurants, sourceCoords) => {
  if (!restaurants || !sourceCoords) {
    return [];
  }

  // Parse source coordinates if they're in string format
  const parsedSource = typeof sourceCoords === 'string'
    ? parseLocationString(sourceCoords)
    : sourceCoords;
    
  if (!parsedSource) return [...restaurants];

  return [...restaurants].sort((a, b) => {
    const coordsA = parseLocationString(a.location);
    const coordsB = parseLocationString(b.location);

    if (!coordsA) return 1;
    if (!coordsB) return -1;

    const distanceA = calculateDistance(
      parsedSource.latitude,
      parsedSource.longitude,
      coordsA.latitude,
      coordsA.longitude
    );

    const distanceB = calculateDistance(
      parsedSource.latitude,
      parsedSource.longitude,
      coordsB.latitude,
      coordsB.longitude
    );

    return distanceA - distanceB;
  });
};

import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Hard-coded API key
const API_KEY = 'AIzaSyAdVO77J0_bxxv0auNHF-AwsCXcd9mFal8';

// Get Google Maps API Key
const getGoogleMapsApiKey = () => {
  // Always use hardcoded key to avoid undefined issues
  return API_KEY;
};

// Track if the script is loading
let isScriptLoading = false;
let scriptLoadPromise = null;

// Function to ensure Google Maps API is loaded
const ensureGoogleMapsLoaded = () => {
  if (Platform.OS !== 'web') {
    return Promise.resolve(); // No need to load for native platforms
  }

  // If promise already exists, return it
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  // If API is already loaded
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve();
  }

  // Create a new promise for loading the script
  scriptLoadPromise = new Promise((resolve, reject) => {
    // Check if script is already in the process of loading
    if (isScriptLoading) {
      // Wait for it to load (poll every 100ms for up to 10 seconds)
      let attempts = 0;
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts > 100) { // 10 seconds max
          clearInterval(checkInterval);
          reject(new Error('Google Maps API failed to load'));
        }
        attempts++;
      }, 100);
      return;
    }

    // Script is not loading yet, so start loading it
    isScriptLoading = true;
    
    // Check if script tag already exists
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        isScriptLoading = false;
        resolve();
      };
      
      script.onerror = () => {
        isScriptLoading = false;
        reject(new Error('Failed to load Google Maps API'));
      };
      
      document.head.appendChild(script);
    }
  });

  return scriptLoadPromise;
};

// Helper function to create a promise-based wrapper for Google Maps API on web
const webGeocode = async (address) => {
  await ensureGoogleMapsLoaded();
  
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const location = results[0].geometry.location;
        resolve({
          latitude: location.lat(),
          longitude: location.lng(),
          formattedAddress: results[0].formatted_address,
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

// Helper for web platform to use Places API
const webGetPlacePredictions = async (query) => {
  await ensureGoogleMapsLoaded();
  
  return new Promise((resolve, reject) => {
    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: query, types: ['geocode'] }, 
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          resolve(predictions.map(prediction => ({
            description: prediction.description,
            place_id: prediction.place_id
          })));
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
        } else {
          console.warn('Place predictions error:', status);
          resolve([]);
        }
      }
    );
  });
};

// Helper for web platform to get place details
const webGetPlaceDetails = async (placeId) => {
  await ensureGoogleMapsLoaded();
  
  return new Promise((resolve, reject) => {
    // Need a DOM element for the PlacesService
    let placesDiv = document.getElementById('places-service');
    if (!placesDiv) {
      placesDiv = document.createElement('div');
      placesDiv.id = 'places-service';
      placesDiv.style.display = 'none';
      document.body.appendChild(placesDiv);
    }
    
    const service = new window.google.maps.places.PlacesService(placesDiv);
    service.getDetails(
      { placeId, fields: ['geometry', 'formatted_address'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          resolve({
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            formattedAddress: place.formatted_address
          });
        } else {
          reject(new Error(`Place details request failed: ${status}`));
        }
      }
    );
  });
};

/**
 * Convert an address string to coordinates using the Google Maps Geocoding API
 * @param {string} address - The address to geocode
 * @returns {Promise<{latitude: number, longitude: number} | null>} - The coordinates or null if geocoding fails
 */
export const geocodeAddress = async (address) => {
  try {
    // Use different approach based on platform
    if (Platform.OS === 'web') {
      return await webGeocode(address);
    } else {
      // For native platforms, use the REST API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${getGoogleMapsApiKey()}`
      );

      const { results, status } = response.data;
      
      if (status === 'OK' && results.length > 0) {
        const location = results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: results[0].formatted_address,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

/**
 * Get location suggestions as the user types
 * @param {string} query - The partial address or location
 * @returns {Promise<Array<{description: string, place_id: string}>>} - Array of location suggestions
 */
export const getLocationSuggestions = async (query) => {
  if (!query || query.length < 3) return [];
  
  try {
    // Use different approach based on platform
    if (Platform.OS === 'web') {
      return await webGetPlacePredictions(query);
    } else {
      // For native platforms, use the REST API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=geocode&key=${getGoogleMapsApiKey()}`
      );
      
      const { predictions, status } = response.data;
      
      if (status === 'OK') {
        return predictions.map(prediction => ({
          description: prediction.description,
          place_id: prediction.place_id
        }));
      }
    }
    return [];
  } catch (error) {
    console.error('Error getting location suggestions:', error);
    return [];
  }
};

/**
 * Get coordinates from a Google Place ID
 * @param {string} placeId - The Google Place ID
 * @returns {Promise<{latitude: number, longitude: number} | null>} - The coordinates or null if lookup fails
 */
export const getPlaceDetails = async (placeId) => {
  try {
    // Use different approach based on platform
    if (Platform.OS === 'web') {
      return await webGetPlaceDetails(placeId);
    } else {
      // For native platforms, use the REST API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${getGoogleMapsApiKey()}`
      );
      
      const { result, status } = response.data;
      
      if (status === 'OK' && result) {
        const location = result.geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: result.formatted_address
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
}; 
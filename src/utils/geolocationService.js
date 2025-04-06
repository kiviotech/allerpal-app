import * as Location from 'expo-location';

// Error codes for geolocation
export const GEO_ERROR_CODES = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
  UNKNOWN_ERROR: 4
};

// Error messages with helpful user-friendly descriptions
export const GEO_ERROR_MESSAGES = {
  [GEO_ERROR_CODES.PERMISSION_DENIED]: 'Location permission was denied. Please enable location access in your settings.',
  [GEO_ERROR_CODES.POSITION_UNAVAILABLE]: 'Unable to determine your current location. Please check if location services are enabled.',
  [GEO_ERROR_CODES.TIMEOUT]: 'Location request timed out. Please try again.',
  [GEO_ERROR_CODES.UNKNOWN_ERROR]: 'An unknown error occurred while trying to get your location.'
};

// Default location fallback (could be set to a central location in your service area)
const DEFAULT_LOCATION = {
  coords: {
    latitude: 34.0522, // Los Angeles by default, change as needed
    longitude: -118.2437,
    accuracy: 1000
  },
  timestamp: Date.now()
};

/**
 * Get the current location with proper error handling and fallbacks
 * @param {Object} options - Geolocation options
 * @param {number} options.timeout - Timeout in milliseconds
 * @param {boolean} options.enableHighAccuracy - Enable high accuracy
 * @param {boolean} options.useFallbackOnError - Whether to return fallback location on error
 * @returns {Promise<Object>} - Location object or error
 */
export const getCurrentLocation = async (options = {}) => {
  const {
    timeout = 15000,
    enableHighAccuracy = true,
    useFallbackOnError = false
  } = options;

  try {
    // First check if location permissions are granted
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.warn('Location permission not granted');
      throw {
        code: GEO_ERROR_CODES.PERMISSION_DENIED,
        message: GEO_ERROR_MESSAGES[GEO_ERROR_CODES.PERMISSION_DENIED]
      };
    }

    // Check if location services are enabled
    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      console.warn('Location services are not enabled');
      throw {
        code: GEO_ERROR_CODES.POSITION_UNAVAILABLE,
        message: 'Location services are disabled. Please enable them in your device settings.'
      };
    }

    // Get current location with timeout
    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: enableHighAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
    });

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject({
          code: GEO_ERROR_CODES.TIMEOUT,
          message: GEO_ERROR_MESSAGES[GEO_ERROR_CODES.TIMEOUT]
        });
      }, timeout);
    });

    // Race between location and timeout
    const location = await Promise.race([locationPromise, timeoutPromise]);
    return location;
  } catch (error) {
    console.error('Error getting location:', error);
    
    // Format the error consistently
    const formattedError = {
      code: error.code || GEO_ERROR_CODES.UNKNOWN_ERROR,
      message: error.message || GEO_ERROR_MESSAGES[GEO_ERROR_CODES.UNKNOWN_ERROR]
    };

    // Return fallback location or throw error based on option
    if (useFallbackOnError) {
      console.warn('Using fallback location due to error');
      return {
        ...DEFAULT_LOCATION,
        error: formattedError,
        isFallback: true
      };
    }
    
    throw formattedError;
  }
};

/**
 * Watch location with error handling
 * @param {Function} onLocationChange - Callback for location updates
 * @param {Function} onError - Callback for errors
 * @param {Object} options - Watch options
 * @returns {Function} - Function to call to stop watching
 */
export const watchLocation = (onLocationChange, onError, options = {}) => {
  const {
    distanceInterval = 100,
    timeInterval = 5000,
    enableHighAccuracy = true
  } = options;

  let watchId = null;

  const startWatching = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw {
          code: GEO_ERROR_CODES.PERMISSION_DENIED,
          message: GEO_ERROR_MESSAGES[GEO_ERROR_CODES.PERMISSION_DENIED]
        };
      }

      watchId = await Location.watchPositionAsync(
        {
          accuracy: enableHighAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
          distanceInterval,
          timeInterval
        },
        onLocationChange
      );
    } catch (error) {
      console.error('Error watching location:', error);
      
      if (onError) {
        onError({
          code: error.code || GEO_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || GEO_ERROR_MESSAGES[GEO_ERROR_CODES.UNKNOWN_ERROR]
        });
      }
    }
  };

  // Start watching immediately
  startWatching();

  // Return function to stop watching
  return () => {
    if (watchId) {
      watchId.remove();
    }
  };
};

/**
 * Get the address from coordinates (reverse geocoding)
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Array>} - Array of address objects
 */
export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    
    return addresses;
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    throw error;
  }
};

/**
 * Check if location services are available and enabled
 * @returns {Promise<boolean>} - Whether location services are available
 */
export const checkLocationServicesAvailable = async () => {
  try {
    // Check permissions
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }
    
    // Check if location services are enabled
    const enabled = await Location.hasServicesEnabledAsync();
    return enabled;
  } catch (error) {
    console.error('Error checking location services:', error);
    return false;
  }
};

export default {
  getCurrentLocation,
  watchLocation,
  getAddressFromCoordinates,
  checkLocationServicesAvailable,
  GEO_ERROR_CODES,
  GEO_ERROR_MESSAGES,
  DEFAULT_LOCATION
}; 
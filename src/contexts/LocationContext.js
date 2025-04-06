import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentLocation, GEO_ERROR_CODES } from '../utils/geolocationService';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [usingFallbackLocation, setUsingFallbackLocation] = useState(false);

  const updateUserLocation = async (options = {}) => {
    try {
      setIsLoadingLocation(true);
      setLocationError(null);
      setUsingFallbackLocation(false);
      
      // Use our improved geolocation service with fallback option
      const location = await getCurrentLocation({
        ...options,
        useFallbackOnError: true // Use fallback location on error
      });
      
      // Check if we're using a fallback location
      if (location.isFallback) {
        setUsingFallbackLocation(true);
        if (location.error) {
          setLocationError(location.error);
        }
      }
      
      // Extract coordinates to maintain backward compatibility
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      });
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError(error);
      setUserLocation(null);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Initial location fetch
  useEffect(() => {
    updateUserLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        locationError,
        isLoadingLocation,
        usingFallbackLocation,
        updateUserLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}; 
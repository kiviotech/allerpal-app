import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentLocation } from '../utils/locationUtils';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const updateUserLocation = async () => {
    try {
      setIsLoadingLocation(true);
      setLocationError(null);
      const location = await getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError(error.message);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    updateUserLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        locationError,
        isLoadingLocation,
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
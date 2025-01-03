import axios from "axios";
import useAuthStore from "../../useAuthStore";

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key

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

// Function to fetch and calculate distance from user to restaurant
export const calculateDistanceFromUser = async (destinationAddress) => {
    const { latitude, longitude } = useAuthStore.getState(); // Access user's location from Zustand
    if (!latitude || !longitude) {
        console.error("User location is not available");
        return null;
    }

    // const destinationCoordinates = await getCoordinatesFromAddress(destinationAddress);
    // if (!destinationCoordinates) {
    //     console.error("Unable to fetch destination coordinates");
    //     return null;
    // }

    const distance = calculateDistance(
        latitude,
        longitude,
        hardcodedCoordinates.latitude,
        hardcodedCoordinates.longitude,
        // destinationCoordinates.latitude,
        // destinationCoordinates.longitude
    );

    return distance.toFixed(2); // Return distance as a string with 2 decimal places
};

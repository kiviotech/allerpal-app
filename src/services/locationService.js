import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../api/apiClient";


export const fetchLocation = async () => {
  try {
    // Fetch geolocation info based on IP address
    const response = await apiClient.get(
      "https://ipinfo.io/json?token=dcfc32fbbc7b1c"
    );

    // Format the country information
    const formattedAddress = `${response.data.city}, ${response.data.region}, ${response.data.region}`;
    console.log("Formatted Address:", formattedAddress);
    // Display the address
    AsyncStorage.setItem("userAddres", formattedAddress);
    AsyncStorage.setItem("country", response.data.country);

    console.log(response.data.country);
  } catch (error) {
    console.error("Error fetching country info:", error);
  }
};

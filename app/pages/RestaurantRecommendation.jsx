import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Restro from "../../assets/Restro.png";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllRestaurants } from "../../src/api/repositories/restaurantRepositories";
import { BASE_URL, MEDIA_BASE_URL } from "../../src/api/apiClient";
import { updateRestaurantDetails } from "../../src/services/restaurantServices";
import useAuthStore from "../../useAuthStore";
import axios from 'axios';
import { createNewFavourite, fetchFavouritesByUserId, updateFavouriteData } from "../../src/services/favouriteServices";
import { calculateDistanceFromUser } from "../../src/utils/distanceUtils";
import Favourites from "./Favorites";

const { width } = Dimensions.get("window");

const RestaurantCard = ({ restaurant, onPress }) => {
  const router = useRouter();
  const { user, isAuthenticated, latitude, longitude } = useAuthStore();
  // const userLocation = useAuthStore((state) => state.location); // Getting the user's location from Zustand
  const [isFavorite, setIsFavorite] = useState(false);
  const [distance, setDistance] = useState(null); // State to hold the calculated distance

  // Hardcoded coordinates for the restaurant (replace with actual data in real scenarios)
  // const hardcodedCoordinates = {
  //   latitude: 51.479342,
  //   longitude: -0.298706,
  // };

  // Function to fetch coordinates using a geocoding service (like Google Geocoding API)
  // const getCoordinatesFromAddress = async (address) => {
  // const API_KEY = 'AIzaSyDFQTSshpxEzndpEMEIDi_8f7OUGyh-Hs8';
  // const response = await axios.get(
  //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  // );

  // const location = response.data.results[0]?.geometry?.location;
  // if (location) {
  //   return {
  //     latitude: location.lat,
  //     longitude: location.lng,
  //   };
  // } 
  //   else {
  //     return null; // Return null if geocoding fails
  //   }
  // };

  // const calculateDistance = (lat1, lon1, lat2, lon2) => {
  //   const toRad = (value) => (value * Math.PI) / 180;
  //   const R = 6371; // Earth's radius in km

  //   const dLat = toRad(lat2 - lat1);
  //   const dLon = toRad(lon2 - lon1);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
  //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return R * c; // Distance in km
  // };

  // useEffect(() => {
  //   // Ensure that the user and restaurant locations are available before calculating distance
  //   if (latitude && longitude) {
  //     const dist = calculateDistance(
  //       latitude,
  //       longitude,
  //       hardcodedCoordinates.latitude,
  //       hardcodedCoordinates.longitude
  //     );
  //     setDistance(dist.toFixed(2)); // Round the distance to 2 decimal places
  //   }
  // }, [latitude, longitude, restaurant.location]);

  useEffect(() => {
    const fetchDistanceToRestaurant = async () => {
      if (latitude && longitude && restaurant.location) {
        const dist = await calculateDistanceFromUser(
          { latitude, longitude },
          restaurant.location
        );
        if (dist) setDistance(dist); // Round distance to 2 decimal places
      }
    };

    fetchDistanceToRestaurant();
  }, [latitude, longitude, restaurant.location]);

  // Fetch user's favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) return;

      try {
        const response = await fetchFavouritesByUserId(user.id);
        if (response?.data?.length > 0) {
          const userFavorites = response.data[0]; // Assuming one favorite record per user
          const isRestaurantFavorite = userFavorites.restaurants.some(
            (favRestaurant) => favRestaurant.documentId === restaurant.documentId
          );
          setIsFavorite(isRestaurantFavorite);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [user?.id, restaurant.id]);

  const handleFavoritePress = async () => {
    if (!isAuthenticated) {
      router.push("/pages/Login");
      return;
    }
    try {
      const response = await fetchFavouritesByUserId(user.id);
      const favoriteData = response?.data?.[0]; // Get the existing favorite entry, if available

      if (!favoriteData) {
        // Create new favorite entry
        const newFavorite = {
          user: { id: user.id }, // Associate the user
          restaurants: [
            {
              id: restaurant.id,
            },
          ],
        };
        await createNewFavourite({ data: newFavorite });
        console.log('Favourites created successfully')
      } else {
        // Update existing favorite 
        // Extract IDs from the existing favorite restaurants
      const existingRestaurantIds = favoriteData.restaurants.map((fav) => fav.id);
        
        const updatedRestaurants = isFavorite
        ? existingRestaurantIds.filter((id) => id !== restaurant.id) // Remove the current restaurant if it's already a favorite
        : [...existingRestaurantIds, restaurant.id]; // Add the current restaurant ID if not already a favorite

        const updatePayload = {
          data: {
            restaurants: updatedRestaurants,
          },
        };

        await updateFavouriteData(favoriteData.documentId, updatePayload);
      }

      // Toggle the favorite state
      setIsFavorite((prev) => !prev);
      global.EventEmitter.emit("favoritesUpdated");
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const goToRestaurantScreen = () => {
    router.push({
      pathname: "pages/RestaurantScreen",
      params: {
        id: restaurant.documentId,
        documentId: restaurant.documentId,
        isFavoriteItem: isFavorite,
      },
    })
  };

  // Construct the full image URL or use a fallback image
  const imageUrl =
    (restaurant.image && restaurant.image[0]?.url)
      ? `${MEDIA_BASE_URL}${restaurant.image[0].url}`
      : Restro;

  return (
    <TouchableOpacity onPress={goToRestaurantScreen}>
      <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.iconContainer}>
          <View style={styles.heart}>
            <TouchableOpacity onPress={handleFavoritePress}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "white" : "white"}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.heart}>
            <TouchableOpacity onPress={() => router.push("pages/Chat")}>
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color="white"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{restaurant.rating} ⭐</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>
            {restaurant.name?.length > 20
              ? `${restaurant.name?.substring(0, 20)}...`
              : restaurant.name}
          </Text>
          <Text style={styles.location}>
            {restaurant.location?.length > 20
              ? `${restaurant.location?.substring(0, 20)}...`
              : restaurant.location}
          </Text>

          {distance && (
            <Text style={styles.distanceText}>
              {distance} km away
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RestaurantRecommendation = () => {
  const [restaurantData, setRestaurantData] = useState([]);

  useEffect(() => {
    const collectRestaurants = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/restaurants?populate=*`);
        setRestaurantData(response.data.data);
      }
      catch (error) {
        console.error("Error fetching restaurants:", error);
        setRestaurantData([])
      }
    }
    collectRestaurants()
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant recommendations</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {Array.isArray(restaurantData) &&
          restaurantData.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingLeft: 16,
  },
  card: {
    width: width * 0.7,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    maxHeight: 240,
    minHeight: 240,
  },
  image: {
    width: "100%",
    height: 140,
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "3%",
  },
  icon: {
    marginLeft: 0,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  reviewText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#777",
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    // overflow: 'hidden'
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  category: {
    fontSize: 12,
    color: "#555",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#eee",
    borderRadius: 15,
    marginRight: 4,
    marginBottom: 4,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "#00aced",
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: "center",
    width: "50%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  heart: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    flexDirection: "row",
    backgroundColor: "#00aced",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RestaurantRecommendation;

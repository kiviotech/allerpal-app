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
import {
  fetchRestaurantDetails,
  getFavoriteRestaurantsForUser,
  updateRestaurantDetails,
} from "../../src/services/restaurantServices";
import useAuthStore from "../../useAuthStore";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { useRouter, useFocusEffect } from "expo-router";
import { EventEmitter } from "events";
import { createNewFavourite, fetchFavouritesByUserId, updateFavouriteData } from "../../src/services/favouriteServices";

const { width } = Dimensions.get("window");

// Create a global event emitter if it doesn't exist
if (!global.EventEmitter) {
  global.EventEmitter = new EventEmitter();
}

const RestaurantCard = ({ restaurant, onRefresh }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(true);

  const handleFavoritePress = async () => {
    if (!isAuthenticated) {
      router.push("/pages/Login");
      return;
    }

    try {
      const response = await fetchFavouritesByUserId(user.id);
      const favoriteData = response?.data?.[0]; // Get the existing favorite entry, if available
      {
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

  const imageUrl =
    (restaurant.image && restaurant.image[0]?.url)
      ? `${MEDIA_BASE_URL}${restaurant.image[0].url}`
      : Restro;

  if (!restaurant) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Image
        source={{uri: imageUrl}
          // restaurant?.image?.[0]?.url
          //   ? { uri: `${MEDIA_BASE_URL}${restaurant.image[0].url}` }
          //   : Restro
        }
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.iconContainer}>
        <View style={styles.heart}>
          <TouchableOpacity onPress={handleFavoritePress}>
            <Ionicons
              name="heart"
              size={20}
              color='white'
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.heart}>
          <TouchableOpacity
            onPress={() => router.push("pages/Chat")}
          >
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
        <Text style={styles.ratingText}>{restaurant?.rating || 0} ⭐</Text>
        {/* <Text style={styles.reviewText}>
          ({restaurant?.reviews?.length || 0}+)
        </Text> */}
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>
          {restaurant.name?.length > 20
            ? `${restaurant.name?.substring(0, 20)}...`
            : restaurant.name}
        </Text>
      </View>
    </View>
  );
};

const Favourites = () => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  const fetchFavorites = React.useCallback(async () => {
    if (!user) {
      setFavoriteRestaurants([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetchFavouritesByUserId(user.id);
      const favoriteIds = response?.data?.[0]?.restaurants || [];
      const restaurantDetails = await Promise.all(
        favoriteIds.map(async (restaurant) => {
          const restaurantData = await fetchRestaurantDetails(restaurant.documentId);
          return restaurantData.data;
        })
      );
      setFavoriteRestaurants(restaurantDetails);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavoriteRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Listen for favorite updates
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      fetchFavorites();
    };

    global.EventEmitter.on("favoritesUpdated", handleFavoritesUpdate);

    return () => {
      global.EventEmitter.off("favoritesUpdated", handleFavoritesUpdate);
    };
  }, [fetchFavorites]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
      return () => {
        // Cleanup if needed
      };
    }, [fetchFavorites])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorites</Text>
      {!favoriteRestaurants || favoriteRestaurants.length === 0 ? (
        <Text style={styles.noFavorites}>No favorite restaurants yet</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          {favoriteRestaurants?.map((restaurant) => (
            <RestaurantCard
              key={restaurant?.id || Math.random().toString()}
              restaurant={restaurant}
              onRefresh={fetchFavorites}
            />
          ))}
        </ScrollView>
      )}
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
    height: 250,
  },
  image: {
    width: "100%",
    height: 150,
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
  },
  heart: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#00aced",
    justifyContent: "center",
    alignItems: "center",
  },
  noFavorites: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default Favourites;

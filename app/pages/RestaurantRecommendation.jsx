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
import { BASE_URL, MEDIA_BASE_URL } from "../../src/api/apiClient";
import { fetchAllRestaurants, updateRestaurantDetails } from "../../src/services/restaurantServices";
import useAuthStore from "../../useAuthStore";
import axios from 'axios';
import { createNewFavourite, fetchFavouritesByUserId, updateFavouriteData } from "../../src/services/favouriteServices";
import { calculateDistanceFromUser } from "../../src/utils/distanceUtils";
import Favourites from "./Favorites";
import { getRestaurants } from "../../src/api/repositories/restaurantRepositories";

const { width } = Dimensions.get("window");

const RestaurantCard = React.memo(({ restaurant, onPress, isFavorite: initialIsFavorite }) => {
  const router = useRouter();
  const { user, isAuthenticated, latitude, longitude } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [distance, setDistance] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  useEffect(() => {
    const fetchDistanceToRestaurant = async () => {
      if (latitude && longitude && restaurant.location) {
        try {
          const dist = await calculateDistanceFromUser(
            { latitude, longitude },
            restaurant.location
          );
          if (dist) setDistance(dist);
        } catch (error) {
          console.error("[RestaurantCard] Error calculating distance:", error);
        }
      }
    };

    fetchDistanceToRestaurant();
  }, [latitude, longitude, restaurant.location]);

  const handleFavoritePress = async () => {
    if (!isAuthenticated) {
      router.push("/pages/Login");
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);
      
      const response = await fetchFavouritesByUserId(user.id);
      const favoriteData = response?.data?.[0];

      if (!favoriteData) {
        // Create new favorite entry
        const newFavorite = {
          user: { id: user.id },
          restaurants: [restaurant.id],
        };
        await createNewFavourite({ data: newFavorite });
      } else {
        // Update existing favorites
        const existingRestaurantIds = favoriteData.restaurants.map((fav) => fav.id);
        const updatedRestaurants = isFavorite
          ? existingRestaurantIds.filter((id) => id !== restaurant.id)
          : [...existingRestaurantIds, restaurant.id];

        await updateFavouriteData(favoriteData.id, {
          data: { restaurants: updatedRestaurants }
        });
      }

      // Optimistically update UI
      setIsFavorite((prev) => !prev);
      global.EventEmitter.emit("favoritesUpdated");
      
    } catch (error) {
      console.error("[RestaurantCard] Error updating favorites:", error);
      setError("Failed to update favorite status");
      // Revert optimistic update if needed
      setIsFavorite(initialIsFavorite);
    } finally {
      setIsUpdating(false);
    }
  };

  const goToRestaurantScreen = () => {
    router.push({
      pathname: "pages/RestaurantScreen",
      params: {
        id: restaurant.id,
        documentId: restaurant.documentId,
        isFavoriteItem: isFavorite,
      },
    });
  };

  const imageUrl = (restaurant.image && restaurant.image[0]?.url)
    ? `${MEDIA_BASE_URL}${restaurant.image[0].url}`
    : Restro;

  return (
    <TouchableOpacity onPress={goToRestaurantScreen}>
      <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.iconContainer}>
          <View style={styles.heart}>
            <TouchableOpacity 
              onPress={handleFavoritePress}
              disabled={isUpdating}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color="white"
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

        {error && (
          <View style={[styles.errorBadge, { position: 'absolute', top: 10, left: 10 }]}>
            <Text style={[styles.errorText, { color: 'white', fontSize: 10 }]}>
              {error}
            </Text>
          </View>
        )}

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
});

RestaurantCard.displayName = 'RestaurantCard';

const RestaurantRecommendation = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  // Fetch favorites at parent level
  const fetchUserFavorites = async () => {
    if (!user?.id) return;
    try {
      console.log("[RestaurantRecommendation] Fetching favorites for user:", user.id);
      const response = await fetchFavouritesByUserId(user.id);
      if (response?.data?.length > 0) {
        const favoriteIds = response.data[0].restaurants.map(r => r.id);
        console.log("[RestaurantRecommendation] Fetched favorite IDs:", favoriteIds);
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error("[RestaurantRecommendation] Error fetching favorites:", error);
      setError('Failed to fetch favorites');
    }
  };

  // Fetch restaurants with pagination
  const collectRestaurants = async (pageNum = 1, shouldAppend = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      console.log("[RestaurantRecommendation] Fetching restaurants page:", pageNum);
      
      const response = await fetchAllRestaurants(pageNum);
      console.log("[RestaurantRecommendation] Restaurants response:", JSON.stringify(response?.data?.length, null, 2));
      
      if (response?.data) {
        if (shouldAppend) {
          setRestaurantData(prev => [...prev, ...response.data]);
        } else {
          setRestaurantData(response.data);
        }
        setHasMore(response.data.length > 0);
      }
    } catch (error) {
      console.error("[RestaurantRecommendation] Error fetching restaurants:", error);
      setError('Failed to fetch restaurants');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Handle infinite scroll
  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      collectRestaurants(nextPage, true);
    }
  };

  // Initial data fetch
  useEffect(() => {
    collectRestaurants(1, false);
    if (user?.id) {
      fetchUserFavorites();
    }
  }, [user?.id]);

  // Listen for favorites updates
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      fetchUserFavorites();
    };

    global.EventEmitter.addListener("favoritesUpdated", handleFavoritesUpdate);
    return () => {
      global.EventEmitter.removeListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant recommendations</Text>
      {error && <Text style={[styles.errorText, { color: 'red', padding: 10 }]}>{error}</Text>}
      {loading ? (
        <Text style={styles.loadingText}>Loading restaurants...</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
          onScroll={({ nativeEvent }) => {
            const isCloseToEnd = 
              nativeEvent.layoutMeasurement.width + nativeEvent.contentOffset.x 
              >= nativeEvent.contentSize.width - 20;
            if (isCloseToEnd) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {Array.isArray(restaurantData) &&
            restaurantData.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant}
                isFavorite={favorites.includes(restaurant.id)}
              />
            ))}
          {loadingMore && (
            <View style={[styles.card, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text>Loading more...</Text>
            </View>
          )}
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
    textTransform: 'capitalize',
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
  errorBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'red',
    padding: 4,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    fontSize: 10,
  },
});

export default RestaurantRecommendation;

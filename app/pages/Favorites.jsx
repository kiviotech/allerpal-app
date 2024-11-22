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
  getFavoriteRestaurantsForUser,
  updateRestaurantDetails,
} from "../../src/services/restaurantServices";
import useAuthStore from "../../useAuthStore";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { useRouter, useFocusEffect } from "expo-router";
import { EventEmitter } from "events";

const { width } = Dimensions.get("window");

// Create a global event emitter if it doesn't exist
if (!global.EventEmitter) {
  global.EventEmitter = new EventEmitter();
}

const RestaurantCard = ({ restaurant, onRefresh }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(
    restaurant?.favourites?.includes(user?.id) || false
  );

  const handleFavoritePress = async () => {
    if (!isAuthenticated) {
      router.push("/pages/Login");
      return;
    }

    try {
      const updatedFavorites = isFavorite
        ? restaurant?.favourites?.filter((id) => id !== user?.id) || []
        : [...(restaurant?.favourites || []), user?.id];

      const payload = {
        data: {
          favourites: updatedFavorites,
          name: restaurant?.name,
          description: restaurant?.description,
          address: restaurant?.address,
          rating: restaurant?.rating,
          categories: restaurant?.categories,
          reviews: restaurant?.reviews,
          image:
            restaurant?.image?.map((img) => ({
              id: img.id,
              name: img.name,
              alternativeText: img.alternativeText,
              url: img.url,
            })) || [],
        },
      };

      Object.keys(payload.data).forEach((key) => {
        if (payload.data[key] === undefined || payload.data[key] === null) {
          delete payload.data[key];
        }
      });

      await updateRestaurantDetails(restaurant.documentId, payload);
      setIsFavorite(!isFavorite);

      if (onRefresh) {
        onRefresh();
      }

      global.EventEmitter?.emit("favoritesUpdated");
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (!restaurant) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Image
        source={
          restaurant?.image?.[0]?.url
            ? { uri: `${MEDIA_BASE_URL}${restaurant.image[0].url}` }
            : Restro
        }
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.iconContainer}>
        <View style={styles.heart}>
          <TouchableOpacity onPress={handleFavoritePress}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.heart}>
          <TouchableOpacity>
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
        <Text style={styles.reviewText}>
          ({restaurant?.reviews?.length || 0}+)
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>
          {restaurant?.name || "Unnamed Restaurant"}
        </Text>
      </View>
    </View>
  );
};

const Favourites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  const fetchFavorites = React.useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getFavoriteRestaurantsForUser(user.id);
      setFavorites(response?.data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
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
      {!favorites || favorites.length === 0 ? (
        <Text style={styles.noFavorites}>No favorite restaurants yet</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          {favorites.map((restaurant) => (
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

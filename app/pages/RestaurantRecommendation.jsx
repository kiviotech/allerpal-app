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
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { updateRestaurantDetails } from "../../src/services/restaurantServices";
import useAuthStore from "../../useAuthStore";

const { width } = Dimensions.get("window");

const RestaurantCard = ({ restaurant, onPress }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(
    // restaurant.favourites?.includes(user?.id)
   restaurant.favourites.some(fav => fav.id === user?.id)
);


  const handleFavoritePress = async () => {
    if (!isAuthenticated) {
      router.push("/pages/Login");
      return;
    }

    try {
      const currentFavorites = restaurant.favourites || [];

      const updatedFavorites = isFavorite
        ? currentFavorites.filter((id) => id !== user.id)
        : [...currentFavorites, user.id];

      const cleanedImage = restaurant.image?.map((img) => ({
        id: img.id,
        name: img.name,
        alternativeText: img.alternativeText,
        url: img.url,
      }));

      const payload = {
        data: {
          name: restaurant.name,
          favourites: updatedFavorites,
          rating: restaurant.rating,
          image: cleanedImage,
        },
      };

      Object.keys(payload.data).forEach((key) => {
        if (payload.data[key] === undefined || payload.data[key] === null) {
          delete payload.data[key];
        }
      });

      await updateRestaurantDetails(restaurant.documentId, payload);
      setIsFavorite(!isFavorite);
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
        name: restaurant.name,
        rating: restaurant.rating,
        categories: restaurant.categories,
        location: restaurant.location,
        image: imageUrl,
        isFavorite,
        ...(Array.isArray(restaurant.favourites) && restaurant.favourites.length > 0
          ? { favourites: restaurant.favourites }
          : {}),
      },
    })
  };

  // Construct the full image URL or use a fallback image
  // console.log('img', restaurant.image)
  const imageUrl =
    restaurant.image && restaurant.image[0]?.url
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
                color={isFavorite ? "red" : "white"}
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
          <Text style={styles.ratingText}>{restaurant.rating} ⭐</Text>
          {/* <Text style={styles.reviewText}>({restaurant.reviews}+)</Text> */}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text >
          {restaurant.location.length > 20
            ? `${restaurant.location.substring(0, 20)}...`
            : restaurant.location}
            </Text>

          {/* Check if categories is an array before mapping */}
          <View style={styles.categories}>
            {Array.isArray(restaurant.categories) &&
              restaurant.categories.map((category, index) => (
                <Text key={index} style={styles.category}>
                  {category}
                </Text>
              ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={goToRestaurantScreen}>
              <Text style={styles.buttonText}>View details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RestaurantRecommendation = ({ restaurants }) => {
  const [restaurantData, setRestaurantData] = useState([]);
  // console.log(restaurants)

  useEffect(() => {
    // Update the list of restaurants whenever filteredRestaurants changes
    setRestaurantData(restaurants);
  }, [restaurants]); // dependency array ensures this runs on updates to filteredRestaurants


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
            // console.log(restaurant)
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
    height: 255,
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

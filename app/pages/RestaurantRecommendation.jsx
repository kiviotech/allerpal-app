// !====================================================================

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

const { width } = Dimensions.get("window");

const RestaurantCard = ({ restaurant, onPress }) => {
  const router = useRouter();

  // Construct the full image URL or use a fallback image
  const imageUrl =
    restaurant.image && restaurant.image[0]?.url
      ? `${MEDIA_BASE_URL}${restaurant.image[0].url}`
      : Restro;

  return (
    <TouchableOpacity onPress={() =>
      router.push({
        pathname: "pages/RestaurantScreen",
        params: {
          id: restaurant.documentId,
          documentId: restaurant.documentId,

          name: restaurant.name,
          rating: restaurant.rating,
          categories: restaurant.categories,
          image: imageUrl,
          // add other properties as needed
        },
      })
    }>

      <View style={styles.card}>
        {/* <Image source={{ uri: imageUrl ? ` MEDIA_BASE_URL${imageUrl}` : Restro }} style={styles.image} /> */}
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.iconContainer}>
          <View style={styles.heart}>
            <TouchableOpacity>
              <Ionicons
                name="heart-outline"
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
          <Text style={styles.ratingText}>{restaurant.rating} ⭐</Text>
          <Text style={styles.reviewText}>({restaurant.reviews}+)</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{restaurant.name}</Text>

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
            {/* <TouchableOpacity style={styles.button} onPress={() => router.push('./RestaurantScreen')}>
            <Text style={styles.buttonText}>View details</Text>
          </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.button}>
              <Text style={styles.buttonText}>View details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </TouchableOpacity>

  );
};

const RestaurantRecommendation = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getAllRestaurants();
        setRestaurants(response.data.data || []); // Access nested data directly
      } catch (error) {
        // console.error("Error fetching restaurants:", error);
        setRestaurants([]); // Fallback to an empty array on error
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant recommendations</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {Array.isArray(restaurants) &&
          restaurants.map((restaurant) => (
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
    height: 230,
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

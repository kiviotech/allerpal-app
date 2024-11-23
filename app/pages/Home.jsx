import {
  View,
  TextInput,
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import FoodItem from "./FoodItem";
import { Ionicons } from "@expo/vector-icons";
import FoodRecommendations from "./FoodRecommandation";
import RestaurantRecommendation from "./RestaurantRecommendation";
import Favourites from "./Favorites";
import { ScrollView } from "react-native-web";
import Footer from "./Footer";
import useAuthStore from "../../useAuthStore";
import { useRouter, useStore } from "expo-router";
import { fetchLocation } from "../../src/services/locationService";
import * as Location from 'expo-location';
import apiClient from "../../src/api/apiClient";
import axios from "axios";
import { getAllRestaurants } from "../../src/api/repositories/restaurantRepositories";
import { fetchAllMenuItems } from "../../src/services/menuItemsServices";

const Home = () => {
  const router = useRouter();
  const [allergens, setAllergens] = useState({});
  const { width, height } = Dimensions.get("window");
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [menuItems, setMenuItems] = useState([]);
  const [filteredFoodRecommendations, setFilteredFoodRecommendations] = useState([]);
  // useEffect(() => {
  //   const getLocation = async () => {
  //     try {
  //       // Request location permissions
  //       const { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         Alert.alert("Permission Denied", "Location access is required.");
  //         return;
  //       }

  //       // Get current location
  //       const currentLocation = await Location.getCurrentPositionAsync({
  //         accuracy: Location.Accuracy.High,
  //       });

  //       console.log("Current Location Coordinates:", currentLocation.coords);

  //       // Use Google Places API to get address from coordinates
  //       const { latitude, longitude } = currentLocation.coords;
  //       const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your Google Maps API key

  //       const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&key=${apiKey}`;

  //       const response = await axios.get(url);
  //       const results = response.data.results;

  //       if (results.length > 0) {
  //         const address = results[0].vicinity || "Address not found";
  //         console.log("Address from Google Places API:", address);
  //         Alert.alert("Address", address);
  //       } else {
  //         Alert.alert("Address", "Address not found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching location:", error);
  //       Alert.alert("Error", "Unable to fetch location or address.");
  //     }
  //   };

  //   // Call the function on component mount
  //   getLocation();
  // }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getAllRestaurants();
        setRestaurants(response.data.data || []); // Access nested data directly
        setFilteredRestaurants(response.data.data || []); // Set all restaurants initially
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setRestaurants([]); // Fallback to an empty array on error
        setFilteredRestaurants([]); // Also fallback for filtered list
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const getMenuItems = async () => {
      try {
        const response = await fetchAllMenuItems(); // API call function
        if (response && response.data) {
          console.log("Food recommended response:", response.data);
          const menuItems = response.data; // Validate API response
          setMenuItems(menuItems); // Set menu items
          setFilteredFoodRecommendations(menuItems); // Initialize filtered items
        } else {
          console.warn("API response format invalid or empty");
          setMenuItems([]);
          setFilteredFoodRecommendations([]);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]); // Fallback
        setFilteredFoodRecommendations([]); // Fallback
      }
    };

    getMenuItems();
  }, []);

  // Debugging filtered recommendations
  useEffect(() => {
    console.log("FilteredFoodRecommendations updated:", filteredFoodRecommendations);
  }, [filteredFoodRecommendations]);


  const handleSearch = (query) => {
    setSearchQuery(query);
    // Filter restaurants based on location or name matching the query
    const filtered = restaurants.filter((restaurant) =>
      restaurant.location.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredRestaurants(filtered);

    const filteredFood = menuItems.filter((food) =>
      food.item_name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredFoodRecommendations(filteredFood);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.TextContainer}>
        <Text>Location</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.push("./LocationAccessScreen")}
          >
            <Ionicons name="location-outline" size={24} color="blue" />
          </TouchableOpacity>
          <Text style={{ marginLeft: 5 }}>Kalyan Nagar,Bangalore</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Ionicons name="search" size={24} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Find for Food and Restaurant..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <ScrollView style={styles.outerContainer}>
        <View>
          <FoodItem />
        </View>
        <View style={styles.FoodRestro}>
          <FoodRecommendations filteredFoodRecommendations={filteredFoodRecommendations} />
        </View>
        <View style={styles.Restro}>
          <RestaurantRecommendation filteredRestaurants={filteredRestaurants} />
        </View>
        <View>
          <Favourites />
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    height: "66%",
    marginTop: 20,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#fff",
    marginTop: "10%",
    marginLeft: "10%",
    width: "70%",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    // width:100,
    // height:40
  },
  TextContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "5%",
  },
  FoodRestro: {
    width: "100%",
  },
  Restro: {
    width: "100%",
  },
});

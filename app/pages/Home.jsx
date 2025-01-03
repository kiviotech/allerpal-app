import {
  View,
  TextInput,
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Switch,
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
import { fetchUserById } from "../../src/services/userServices";

const Home = () => {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");
  const { setLocation } = useAuthStore(); // Access setLocation from Zustand  const [address, setAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = useAuthStore((state) => state.user?.id);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredFoodRecommendations, setFilteredFoodRecommendations] = useState([]);
  const [isAllergenOn, setIsAllergenOn] = useState(false);

  useEffect(() => {
    if (!userId) {
      router.replace("auth/Login");
      return;
    }
    const getProfileIdbyUserId = async () => {
      const response = await fetchUserById(userId);
      const profileId = response?.profiles[0]?.id
      useAuthStore.getState().setProfileId(profileId);
    }
    getProfileIdbyUserId();
  }, [userId])

  // Static location values
  // Static location values
  useEffect(() => {
    // Static location data
    const latitude = 51.5074; // Example: London latitude
    const longitude = -0.1278; // Example: London longitude
    const location = "Westminster, London SW1A 1AA, United Kingdom";

    // Store the static location in Zustand
    setLocation(latitude, longitude, location);
  }, [setLocation]);

  const handleSearch = () => {
    router.push('./Search')
  };

  const toggleAllergen = () => {
    setIsAllergenOn((prevState) => !prevState);
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
          <Text style={{ marginLeft: 5 }}>London, United Kingdom</Text>
        </View>
      </View>
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.container} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Restaurant, dishes, cuisines..."
            value={searchQuery}
          />
        </TouchableOpacity>
       <View style={styles.containContainer}>
         <Text style={styles.input}>May Contain Allergen</Text>
        <Switch
          value={isAllergenOn}
          onValueChange={toggleAllergen}
          thumbColor={isAllergenOn ? "#ff6347" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#ffdbc1" }}
        />
       </View>
      </View>
      <ScrollView style={styles.outerContainer}>
        <View>
          <FoodItem />
        </View>
        <View style={styles.FoodRestro}>
          <FoodRecommendations isAllergenOn={isAllergenOn} />
        </View>
        <View style={styles.Restro}>
          <RestaurantRecommendation />
        </View>
        <View style={{marginBottom: 20}}>
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
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "10%",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#fff",
    margin: "auto",
    width: "70%",
  },
  containContainer: {
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: "center",
    paddingVertical: 10,
    width: '30%',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
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

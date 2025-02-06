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
import { useRouter } from "expo-router";
import { fetchLocation } from "../../src/services/locationService";
import * as Location from 'expo-location';
import { fetchUserById } from "../../src/services/userServices";
import Sidebar from "./SideBar";

const Home = () => {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");
  const { setLocation } = useAuthStore(); // Access setLocation from Zustand  const [address, setAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = useAuthStore((state) => state.user?.id);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredFoodRecommendations, setFilteredFoodRecommendations] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  // const [isAllergenOn, setIsAllergenOn] = useState(!excludeMayContain);

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

  // const toggleAllergen = () => {
  //   setIsAllergenOn((prevState) => !prevState);
  // };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={
        // styles.TextContainer,
        styles.headerContainer
      }>
        <View>
          <Text style={styles.locationLabel}>Location</Text>
          <TouchableOpacity
            onPress={() => router.push("./LocationAccessScreen")}
          >
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color="blue" />
              <Text style={styles.locationText}>London, United Kingdom</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu-sharp" size={24} color="black" />
        </TouchableOpacity>

        {/* <Text>Location</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.push("./LocationAccessScreen")}
          >
            <Ionicons name="location-outline" size={24} color="blue" />
          </TouchableOpacity>
          <Text style={{ marginLeft: 5 }}>London, United Kingdom</Text>
        </View> */}
      </View>

      {/* <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.searchContainer} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Find for food or restaurant..."
            value={searchQuery}
          />
          <Ionicons name="options-outline" size={20} color="black" />
        </TouchableOpacity>
      </View> */}

      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.container} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Restaurant, dishes, cuisines and location"
            value={searchQuery}
          />
          {/* Filter Icon */}
          {/* <Ionicons name="options-outline" size={20} color="black" /> */}
        </TouchableOpacity>

        {/* <View style={styles.containContainer}>
         <Text style={styles.input}>May Contain Allergen</Text>
        <Switch
          value={isAllergenOn}
          onValueChange={toggleAllergen}
          thumbColor={isAllergenOn ? "#ff6347" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#ffdbc1" }}
        />
       </View> */}
       
      </View>
      {/* Sidebar Component */}
      {sidebarVisible && <Sidebar isVisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />}

      <ScrollView style={styles.outerContainer}>
        <View>
          <FoodItem />
        </View>
        <View style={styles.FoodRestro}>
          <FoodRecommendations />
        </View>
        <View style={styles.Restro}>
          <RestaurantRecommendation />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Favourites />
        </View>
      </ScrollView>
      {/* <Footer /> */}
    </SafeAreaView >
  );
};

export default Home;

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    height: "66%",
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  locationLabel: {
    fontSize: 18,
    color: "#888",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "3%",
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
    width: "90%",
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

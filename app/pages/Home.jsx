import {
  View,
  TextInput,
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
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

const Home = () => {
  const router = useRouter();
  const [allergens, setAllergens] = useState({});
  const { width, height } = Dimensions.get("window");

  const user = useAuthStore((state) => state.user);
  console.log("zustand", user);

  console.log("Allergy profile saved home", allergens);

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
        />
      </View>
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

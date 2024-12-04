import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import MenuCard from "./MenuCard";
import Footer from "./Footer";
import ReviewsSection from "./ReviewsSection";
import { useRouter } from "expo-router";
import ReviewCards from "./ReviewCards";
import { useLocalSearchParams } from "expo-router";
import { fetchMenuByRestaurantId } from "../../src/services/menuServices";
import * as Location from 'expo-location';
import useAuthStore from "../../useAuthStore";
import restaurantURL from '../../assets/restaurant.png' 


export default function () {
  const router = useRouter();
  const { user } = useAuthStore();
  const [menuData, setMenuData] = useState([]);
  const [isAllergenOn, setIsAllergenOn] = React.useState(false);
  const [type, setType] = useState("normal");
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollViewRef = useRef(null); // Added ref for ScrollView

  const toggleAllergen = (value) => {
    setIsAllergenOn(value);
    setType(value ? "allergen" : "normal"); // Set type based on switch
  };

  const { id, name, rating, categories, image, documentId, favourites } =
    useLocalSearchParams();

  useEffect(() => {
    const fetchMenus = async () => {
      const response = await fetchMenuByRestaurantId(id);
      setMenuData(response.data);
    };
    fetchMenus();
    if (favourites && user) {
      setIsFavorite(favourites.includes(user.id));
    }
  }, [favourites, id, user]);

  const handleFavoritePress = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      router.push("/pages/Login");
      return;
    }
    try {
      // Toggle favorite status
      const updatedFavorites = isFavorite
        ? favourites.filter((id) => id !== user.id) // Remove user from favorites
        : [...favourites, user.id]; // Add user to favorites

      // Update the restaurant's favorites in the backend
      const cleanedImage = image?.map((img) => ({
        id: img.id,
        name: img.name,
        alternativeText: img.alternativeText,
        url: img.url,
      }));
      const payload = {
        data: {
          name,
          favourites: updatedFavorites,
          rating,
          image: cleanedImage,
        },
      };

      // Update restaurant details with the new favorites list
      Object.keys(payload.data).forEach((key) => {
        if (payload.data[key] === undefined || payload.data[key] === null) {
          delete payload.data[key];
        }
      });

      await updateRestaurantDetails(documentId, payload);
      setIsFavorite(!isFavorite); // Toggle the favorite state on the UI
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };


  const filteredMenuItems = menuData.filter((item) => item.type === type);

  const callResto = () => {
    const phoneNumber = '+918277238505'; // Replace with the restaurant's phone number

    // Open the phone dialer
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      Alert.alert('Error', 'Unable to make a call. Please try again later.')
    );
  };

  const openLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log("Current Location Coordinates:", currentLocation.coords);

      // Get latitude and longitude from current location
      const { latitude, longitude } = currentLocation.coords;

      // Construct the URL for Google Maps
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

      // Open Google Maps with the location
      Linking.openURL(url).catch((err) => {
        console.error('Error opening location:', err);
      });

    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("Error", "Unable to fetch location or address.");
    }
  };

  // Scroll to reviews section
  const scrollToReviews = () => {
    scrollViewRef.current?.scrollTo({
      y: 500, // Adjust this value to control scroll position if needed
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView ref={scrollViewRef}> {/* Assigned ref to ScrollView */}
        <View style={styles.container}>
          {/* Header Icons */}
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          {/* <View style={styles.heart}> */}
            {/* <TouchableOpacity onPress={handleFavoritePress}>
            <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "red" : "white"}
                // style={styles.icon}
              />
            </TouchableOpacity> */}
            {/* </View> */}
          </View>

          {/* Image Section */}
          <Image source={{ uri: image ? image : restaurantURL }} style={styles.image} />

          {/* Restaurant Details */}
          <View style={styles.detailsContainer}>
            {/* Restaurant Name and Icons */}
            <View style={styles.titleRow}>
              <Text style={styles.restaurantName}>{name}</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity style={styles.iconButton} onPress={callResto}>
                  <FontAwesome name="phone" size={20} color="#ff6347" />
                </TouchableOpacity>              
                <TouchableOpacity style={[styles.iconButton, styles.mapIcon]} onPress={openLocation}>
                  <FontAwesome name="map-marker" size={20} color="#ff6347" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Rating and Reviews */}
            <View style={styles.ratingRow}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{rating} </Text>
              {/* <Text style={styles.reviewText}>(30+)</Text> */}
              <TouchableOpacity onPress={scrollToReviews}> {/* onPress now calls scrollToReviews */}
                <Text style={styles.reviewLink}>See Reviews</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categories}>
              {Array.isArray(categories) &&
                categories.map((category, index) => (
                  <Text key={index} style={styles.category}>
                    {category}
                  </Text>
                ))}
            </View>

            {/* Distance and Address */}
            <Text style={styles.addressText}>
              <FontAwesome name="walking" size={14} color="#ff6347" /> 30 mins
              (1 km) . 5 Tottenham Ln
            </Text>

            {/* Contact Button */}
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => router.push("pages/Chat")}
            >
              <Text style={styles.contactButtonText}>Contact Restaurant</Text>
            </TouchableOpacity>

            {/* Allergen Toggle */}
            <View style={styles.allergenContainer}>
              <Text style={styles.allergenText}>Your Allergens</Text>
              <Switch
                value={isAllergenOn}
                onValueChange={toggleAllergen}
                thumbColor={isAllergenOn ? "#ff6347" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#ffdbc1" }}
              />
            </View>
          </View>
        </View>

        {/* Menu Card or Message */}
        <View>
          {filteredMenuItems.length > 0 ? (
            <MenuCard menuItems={filteredMenuItems} />
          ) : (
            <Text style={styles.noItemsText}>
              There are no foods available for this option.
            </Text>
          )}
        </View>

        {/* Review Section */}
        <View style={styles.Review}>
          <ReviewsSection restaurantId={documentId} />
        </View>
        <View>
          <ReviewCards restaurantId={documentId} />
        </View>
      </ScrollView>
      <View>
        <Footer />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
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

  AreaContainer: {
    flex: 1,
    padding: 10,
    // marginTop: 20,
    //  backgroundColor: '#fff',
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  image: {
    width: "85%",
    height: 180,
    borderRadius: 10,
    margin: 'auto',
  },
  detailsContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  restaurantName: {
    fontSize: 25,
    fontWeight: "bold",
  },
  iconRow: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 8,
  },
  mapIcon: {
    marginLeft: 16, // Extra space between phone and map marker icons
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 4,
    fontWeight: "bold",
  },
  reviewText: {
    fontSize: 16,
    color: "#888",
    marginLeft: 4,
  },
  reviewLink: {
    color: "#00D0DD",
    marginLeft: 8,
    textDecorationLine: "underline",
  },
  addressText: {
    fontSize: 16,
    color: "#000000",
    marginVertical: 8,
  },
  contactButton: {
    backgroundColor: "#00D0DD",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 8,
    height: 50,
    width: 120,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    alignItems: "center",
    top: 5,
  },
  allergenContainer: {
    flexDirection: "row",
    // justifyContent: 'space-around',
    alignItems: "center",
    marginTop: 16,
  },
  allergenText: {
    fontSize: 16,
    color: "#000000",
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

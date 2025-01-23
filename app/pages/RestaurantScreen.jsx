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
import { fetchRestaurantDetails } from "../../src/services/restaurantServices";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { calculateDistanceFromUser } from "../../src/utils/distanceUtils";
import { createNewFavourite, fetchFavouritesByUserId, updateFavouriteData } from "../../src/services/favouriteServices";


export default function () {
  const router = useRouter();
  const { user, latitude, longitude } = useAuthStore();
  const { id, documentId, isFavoriteItem } = useLocalSearchParams();
  const [menuData, setMenuData] = useState([]);
  const [isAllergenOn, setIsAllergenOn] = React.useState(false);
  const [type, setType] = useState("normal");
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollViewRef = useRef(null); // Added ref for ScrollView
  const [restaurantData, setRestaurantData] = useState([]);
  const [distance, setDistance] = useState(null);

  const toggleAllergen = (value) => {
    setIsAllergenOn(value);
    setType(value ? "allergen" : "normal"); // Set type based on switch
  };

  useEffect(() => {
    // Set initial favorite state based on isFavoriteItem
    setIsFavorite(isFavoriteItem === 'true'); // Ensure proper boolean handling
  }, [isFavoriteItem]);

  useEffect(() => {
    const collectRestaurants = async () => {
      try {
        const response = await fetchRestaurantDetails(documentId);
          setRestaurantData(response.data);
      }
      catch (error) {
        console.error("Error fetching restaurants:", error);
        setRestaurantData([])
      }
    }
    const fetchMenus = async () => {
      try {
        const response = await fetchMenuByRestaurantId(documentId);
        if (response?.data) {
          setMenuData(response.data);
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };
    collectRestaurants();
    fetchMenus();
  }, []);

  const handleFavoritePress = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      router.push("/pages/Login");
      return;
    }
    try {
          const response = await fetchFavouritesByUserId(user.id);
          const favoriteData = response?.data?.[0]; // Get the existing favorite entry, if available
    
          if (!favoriteData) {
            // Create new favorite entry
            const newFavorite = {
              user: { id: user.id }, // Associate the user
              restaurants: [
                {
                  id: restaurantData.id,
                  // documentId: restaurant.documentId,
                },
              ],
              // menu_items: [],
            };
            await createNewFavourite({ data: newFavorite });
          } else {
            // Update existing favorite 
            // Extract IDs from the existing favorite restaurants
          const existingRestaurantIds = favoriteData.restaurants.map((fav) => fav.id);
            
            const updatedRestaurants = isFavorite
            ? existingRestaurantIds.filter((id) => id !== restaurantData.id) // Remove the current restaurant if it's already a favorite
            : [...existingRestaurantIds, restaurantData.id]; // Add the current restaurant ID if not already a favorite
            
            const updatePayload = {
              data: {
                restaurants: updatedRestaurants,
              },
            };
    
            await updateFavouriteData(favoriteData.documentId, updatePayload);
          }
          // Toggle the favorite state
          setIsFavorite((prev) => !prev);
        } catch (error) {
          console.error("Error updating favorites:", error);
        }
  };

    useEffect(() => {
      const fetchDistanceToRestaurant = async () => {
        if (latitude && longitude && restaurantData.location) {
          const dist = await calculateDistanceFromUser(
            { latitude, longitude },
            restaurantData.location
          );
          if (dist) setDistance(dist); // Round distance to 2 decimal places
        }
      };
  
      fetchDistanceToRestaurant();
    }, [latitude, longitude, restaurantData.location]);

  const filteredMenuItems = menuData.filter((item) => item.type === type);

  const callResto = (contact_number) => {
    const phoneNumber = contact_number; // Replace with the restaurant's phone number
    if (!phoneNumber) {
      Alert.alert('No phone number available');
      return;
    }
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
      y: 500,
      animated: true,
    });
  };

  const getImageSource = () => {
    if (Array.isArray(restaurantData.image) && restaurantData.image.length > 0) {
      return { uri: `${MEDIA_BASE_URL}${restaurantData.image[0]?.url}` || restaurantURL };
    }
    return restaurantURL;
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView ref={scrollViewRef} style={styles.container}>
        <View >
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.heart}>
              <TouchableOpacity onPress={handleFavoritePress}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={20}
                  color={isFavorite ? "white" : "white"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Image Section */}
          <Image
            source={getImageSource()}
            style={styles.image}
          />

          {/* Restaurant Details */}
          <View style={styles.detailsContainer}>
            {/* Restaurant Name and Icons */}
            <View style={styles.titleRow}>
              <Text style={styles.restaurantName}>{restaurantData?.name}</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => 
                  callResto(restaurantData?.contact_number? restaurantData?.contact_number : "+918277238505" )}>
                  <FontAwesome name="phone" size={28} color="#ff6347" />
                </TouchableOpacity>
                <TouchableOpacity onPress={openLocation}>
                  <FontAwesome name="map-marker" size={26} color="#ff6347" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.categories}>
              {Array.isArray(restaurantData?.cuisines) &&
                restaurantData?.cuisines.map((cuisine, index) => (
                  <Text key={index} style={styles.category}>
                    {cuisine.cuisine_type}
                  </Text>
                ))}
            </View>

            {/* Distance and Address */}
            <View >
              <View style={styles.addressRow}>
                <FontAwesome name="map-marker" size={14} color="#ff6347" />
                <Text style={styles.addressText}>{restaurantData?.location}</Text>
              </View>
              <Text style={styles.addressText}>{distance} Km away</Text>
            </View>

            {/* Rating and Reviews */}
            <View style={styles.ratingRow}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{restaurantData?.rating} </Text>
              {/* <Text style={styles.reviewText}>(30+)</Text> */}
              <TouchableOpacity onPress={scrollToReviews}> {/* onPress now calls scrollToReviews */}
                <Text style={styles.reviewLink}>See Reviews</Text>
              </TouchableOpacity>
            </View>

            {/* Contact Button */}
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => router.push("pages/Chat")}
            >
              <Text style={styles.contactButtonText}>Contact Restaurant</Text>
            </TouchableOpacity>

            {/* Allergen Toggle */}
            <View style={styles.allergenContainer}>
              <Text style={styles.allergenText}>{isAllergenOn ? 'Your Allergen Menu' : 'Normal Menu'}</Text>
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
        {/* <View> */}
        {filteredMenuItems.length > 0 ? (
          <MenuCard menuItems={filteredMenuItems} />
        ) : (
          <Text style={styles.noItemsText}>
            There are no foods available for this option.
          </Text>
        )}
        {/* </View> */}

        {/* Review Section */}
        <View style={styles.Review}>
          <ReviewsSection restaurantId={documentId} id={id} />
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
    gap: 10,
    marginVertical: 10,
  },
  category: {
    fontSize: 16,
    color: "#555",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 15,
  },
  AreaContainer: {
    flex: 1,
    paddingHorizontal: 10,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    marginBottom: 50
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
    alignItems: 'center',
    maxWidth: '15%',
    minWidth: '15%',
    justifyContent: 'space-between',
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
  addressRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addressText: {
    fontSize: 16,
    color: "#000000",
    marginVertical: 5,
  },
  contactButton: {
    backgroundColor: "#00D0DD",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 8,
    width: '50%',
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
  },
  allergenContainer: {
    width: '50%',
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginTop: 10,
  },
  allergenText: {
    fontSize: 16,
    color: "#000000",
  },
  noItemsText: {
    fontSize: 16,
    padding: 15,
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

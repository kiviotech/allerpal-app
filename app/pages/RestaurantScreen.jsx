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
import CustomSwitch from "./CustomSwitch";
import { useFocusEffect } from '@react-navigation/native';


const RestaurantScreen = () => {
  const router = useRouter();
  const { user, latitude, longitude } = useAuthStore();
  const { id, documentId, isFavoriteItem } = useLocalSearchParams();
  const [menuData, setMenuData] = useState([]);
  const [isAllergenOn, setIsAllergenOn] = React.useState(false);
  const [type, setType] = useState("normal");
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollViewRef = useRef(null); // Ref for the ScrollView
  const reviewsRef = useRef(null); // Ref for the Reviews Section
  const [restaurantData, setRestaurantData] = useState([]);
  const [distance, setDistance] = useState(null);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false); // State to show/hide button

  const toggleAllergen = (value) => {
    setIsAllergenOn(value);
    setType(value ? "allergen" : "normal"); // Set type based on switch
  };

  useEffect(() => {
    setIsFavorite(isFavoriteItem === 'true'); // Ensure proper boolean handling
  }, [isFavoriteItem]);

  useFocusEffect(
    React.useCallback(() => {
      if (!documentId) {
        console.error("documentId is missing. Skipping fetch.");
        return;
      }

      const collectRestaurants = async () => {
        try {
          const response = await fetchRestaurantDetails(documentId);
          setRestaurantData(response.data);
        } catch (error) {
          console.error("Error fetching restaurants:", error);
          setRestaurantData([]);
        }
      };

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
    }, [documentId])
  );



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
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getImageSource = () => {
    if (Array.isArray(restaurantData.image) && restaurantData.image.length > 0) {
      return { uri: `${MEDIA_BASE_URL}${restaurantData.image[0]?.url}` || restaurantURL };
    }
    return restaurantURL;
  };

  // Track scroll position to show/hide the button
  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;

    // Show button when scrolled past 10% of the page
    if (contentOffsetY > contentHeight / 10 - screenHeight) {
      setShowScrollToTopButton(true);
    } else {
      setShowScrollToTopButton(false);
    }
  };

  // Scroll to top when button is pressed
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };


  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView ref={scrollViewRef}
        style={styles.container}
        onScroll={handleScroll} // Handle scrolling
        scrollEventThrottle={16} // Throttle scroll events
      >
        <View>
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
          <View style={styles.imageRating}>
            <Image source={getImageSource()} style={styles.image} />
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{restaurantData?.rating} </Text>
            </View>
          </View>

          {/* Restaurant Details */}
          <View style={styles.detailsContainer}>
            {/* Restaurant Name and Icons */}
            <View style={styles.titleRow}>
              <Text style={styles.restaurantName}>{restaurantData?.name}</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={() =>
                  callResto(restaurantData?.contact_number ? restaurantData?.contact_number : "")}
                  style={styles.icons}>
                  <FontAwesome name="phone" size={26} color="#ff6347" />
                </TouchableOpacity>
                <TouchableOpacity onPress={openLocation} style={styles.icons}>
                  <FontAwesome name="map-marker" size={26} color="#00D0DD" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cuisines Section */}
            <View style={styles.categories}>
              {/* <Text style={styles.subTitle}>Cuisines: </Text> */}
              {Array.isArray(restaurantData?.cuisines) && restaurantData.cuisines.length > 0 ? (
                <View>
                  {restaurantData.cuisines.map((cuisine, index) => (
                    <Text key={index} style={styles.category}>
                      {
                        // ${cuisine?.cuisine_type} Cuisine 
                        cuisine?.cuisine_type
                        // } 
                        || "Unknown cuisine type"
                      }
                    </Text>
                  ))}
                </View>
              ) : (
                <Text>No cuisine available</Text>
              )}
            </View>

            <View style={styles.distanceContact}>
              {/* Distance and Address */}
              <View style={styles.addressRow}>
                <View style={styles.address}>
                  <Ionicons name="walk" size={26} color="#ff6347" />
                  <Text style={styles.addressText}>{distance} Km away</Text>
                </View>
                <Text style={styles.addressTextDistance}>{restaurantData?.location}</Text>
              </View>

              {/* Contact Button */}
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => router.push({
                  pathname: "pages/Chat",
                  params: { 
                    restaurantId: restaurantData?.id, 
                  }
                })}
              >
                <Text style={styles.contactButtonText}>Contact Restaurant</Text>
            </TouchableOpacity>
            </View>

            {/* Rating and Reviews */}
            <View style={styles.ratingRow}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{restaurantData?.rating} </Text>
              {/* <Text style={styles.reviewText}>(30+)</Text> */}
              <TouchableOpacity onPress={scrollToReviews}>
                <Text style={styles.reviewLink}>Reviews</Text>
              </TouchableOpacity>
            </View>


            {/* Allergen Toggle */}
            <View style={styles.allergenContainer}>
              <Text style={styles.allergenText}>Your Allergens Filter</Text>
              {/* <Switch
                value={isAllergenOn}
                onValueChange={toggleAllergen}
                thumbColor={isAllergenOn ? "#ff6347" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#ffdbc1" }}
              /> */}

              {/* Replace the existing Switch with the CustomSwitch */}
              <CustomSwitch
                value={isAllergenOn}
                initialState={isAllergenOn}      // Pass the current state of the switch
                onToggle={toggleAllergen}        // Pass the function to handle toggle
              />
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
          <View style={styles.Review} ref={reviewsRef} >
            <ReviewsSection restaurantId={documentId} id={id} />
          </View>

          <View>
            <ReviewCards restaurantId={documentId} />
          </View>
        </View>
      </ScrollView>
      {/* <View>
        <Footer />
      </View> */}

      {showScrollToTopButton && (
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
        >
          <Ionicons name="arrow-up" size={24} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default RestaurantScreen;

const styles = StyleSheet.create({
  scrollToTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#333",
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
    // backgroundColor: "#F9F9F9",
    marginBottom: 50
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  imageRating: {
    display: 'flex',
    flexDirection: 'row',
  },
  image: {
    width: "90%",
    height: 180,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  ratingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    position: "relative",
    right: 98,
    top: 10,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    maxWidth: '25%',
    minWidth: '25%',
    justifyContent: 'space-between',
  },
  icons: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
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
  distanceContact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  addressRow: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 5,
    maxWidth: '58%',
  },
  address: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  addressText: {
    flex: 1,
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
    // paddingHorizontal: 8,
    width: '40%',
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    alignItems: "center",
  },
  allergenContainer: {
    backgroundColor: '#fff',
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginTop: 10,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  allergenText: {
    fontSize: 20,
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

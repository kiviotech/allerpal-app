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
  Alert,
  ActivityIndicator,
  FlatList,
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
import { getChatsByUserAndRestaurant } from "../../src/services/chatService";
import { sendMessageToRestaurant } from "../../src/services/chatService";
import { useLocation } from '../../src/contexts/LocationContext';
import { filterRestaurantsByDistance, sortRestaurantsByDistance, calculateDistance } from '../../src/utils/locationUtils';
import { getCurrentLocation, GEO_ERROR_CODES } from '../../src/utils/geolocationService';
import LocationErrorHandler from '../../src/components/LocationErrorHandler';
import { fetchProfileByUserId } from "../../src/services/profileServices";

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
  const [loading, setLoading] = useState(false); // Add loading state
  const { userLocation, locationError, isLoadingLocation } = useLocation();
  const [maxDistance, setMaxDistance] = useState(10); // Default 10km radius
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [userAllergies, setUserAllergies] = useState([]);
  const [isLoadingAllergies, setIsLoadingAllergies] = useState(true);

  const toggleAllergen = (value) => {
    console.log(`[AllergenFilter] Toggling allergen filter ${value ? 'ON' : 'OFF'}`);
    setIsAllergenOn(value);
    setType(value ? "allergen" : "normal");

    // Log user allergens and menu data
    console.log(`[AllergenFilter] User has ${userAllergies.length} allergens:`, 
      userAllergies.map(a => a.name).join(", "));
    console.log(`[AllergenFilter] Menu data contains ${menuData.length} menus`);
    
    // Preview filtered results
    const filteredItems = getFilteredMenuItems(value);
    console.log(`[AllergenFilter] Filtered to ${filteredItems.length} menus`);
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

  useEffect(() => {
    if (restaurants && userLocation) {
      // Filter restaurants by distance and sort them
      const nearbyRestaurants = filterRestaurantsByDistance(restaurants, userLocation, maxDistance);
      const sortedRestaurants = sortRestaurantsByDistance(nearbyRestaurants, userLocation);
      setFilteredRestaurants(sortedRestaurants);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [restaurants, userLocation, maxDistance]);

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

  // Update the getFilteredMenuItems function to skip filtering when toggle is off
  const getFilteredMenuItems = (allergenFilterOverride = null) => {
    // Use override value if provided, otherwise use state
    const useAllergenFilter = allergenFilterOverride !== null ? allergenFilterOverride : isAllergenOn;
    
    // First filter by menu type (normal/allergen)
    let filtered = menuData.filter((menu) => menu.type === type);
    
    console.log(`[AllergenFilter] Starting with ${filtered.length} ${type} menus`);
    console.log(`[AllergenFilter] Allergen filter is ${useAllergenFilter ? 'enabled' : 'disabled'}`);
    
    // Skip allergen filtering if toggle is off - just return all menus of the selected type
    if (!useAllergenFilter) {
      console.log(`[AllergenFilter] Toggle is OFF - showing all menu items without allergen filtering`);
      return filtered;
    }
    
    // If allergen filter is on and user has allergies
    if (userAllergies.length > 0) {
      console.log(`[AllergenFilter] Filtering for ${userAllergies.length} allergens`);
      
      // Process each menu (keeping the menu structure intact)
      filtered = filtered.map(menu => {
        // Make a copy of the menu to modify
        const processedMenu = {...menu};
        
        // Get all menu items in this menu
        const items = menu.menu_items || [];
        console.log(`[AllergenFilter] Processing ${items.length} items in ${menu.type} menu`);
        
        // Filter menu items that don't contain user's allergens
        const safeItems = items.filter(item => {
          // Skip items without description (unlikely but safer)
          if (!item || !item.description) {
            console.log(`[AllergenFilter] Skipping item without description`);
            return true; // Include items without descriptions
          }
          
          const itemName = item.item_name || 'Unknown item';
          
          // Case 1: Check structured allergen objects (if they exist)
          const hasStructuredAllergen = item.allergens && Array.isArray(item.allergens) && 
            item.allergens.some(menuAllergen => 
              userAllergies.some(userAllergen => {
                const match = userAllergen.id === menuAllergen.id;
                if (match) {
                  console.log(`[AllergenFilter] Item "${itemName}" contains structured allergen: ${userAllergen.name}`);
                }
                return match;
              })
            );
          
          // Case 2: Check description text for allergen names
          const descriptionAllergens = userAllergies.filter(allergen => {
            const allergenName = allergen.name.toLowerCase();
            const descriptionLower = item.description.toLowerCase();
            const match = descriptionLower.includes(allergenName);
            if (match) {
              console.log(`[AllergenFilter] Item "${itemName}" contains "${allergenName}" in description: "${item.description}"`);
            }
            return match;
          });
          
          const hasDescriptionAllergen = descriptionAllergens.length > 0;
          
          // For debugging
          if (!hasStructuredAllergen && !hasDescriptionAllergen) {
            console.log(`[AllergenFilter] Item "${itemName}" is safe`);
          }
          
          // Include only if it doesn't have any allergens matching user's allergies
          return !(hasStructuredAllergen || hasDescriptionAllergen);
        });
        
        console.log(`[AllergenFilter] ${safeItems.length} of ${items.length} items are safe in this menu`);
        
        // Update the menu with only safe items
        processedMenu.menu_items = safeItems;
        return processedMenu;
      });
      
      // Remove any menus that now have no items
      const filteredCount = filtered.length;
      filtered = filtered.filter(menu => menu.menu_items && menu.menu_items.length > 0);
      console.log(`[AllergenFilter] Removed ${filteredCount - filtered.length} empty menus`);
    }
    
    console.log(`[AllergenFilter] Final result: ${filtered.length} menus`);
    
    // Flatten all menu items for display if needed
    const allMenuItems = filtered.flatMap(menu => menu.menu_items || []);
    console.log(`[AllergenFilter] Total safe menu items: ${allMenuItems.length}`);
    
    return filtered;
  };

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
      // Clear any previous location errors
      setLocationError(null);
      
      // Try to get current location using our improved service
      const currentLocation = await getCurrentLocation({
        timeout: 10000, // 10 seconds timeout
        enableHighAccuracy: true
      });

      // Get latitude and longitude from current location
      const { latitude, longitude } = currentLocation.coords;

      // Construct the URL for Google Maps with restaurant location as destination
      // and current location as starting point
      const restaurantLat = restaurantData?.latitude || 0;
      const restaurantLng = restaurantData?.longitude || 0;
      const url = restaurantLat && restaurantLng 
        ? `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${restaurantLat},${restaurantLng}&travelmode=driving`
        : `https://www.google.com/maps?q=${latitude},${longitude}`;

      // Open Google Maps with the location
      Linking.openURL(url).catch((err) => {
        console.error('Error opening location:', err);
        Alert.alert("Error", "Could not open maps application.");
      });

    } catch (error) {
      console.error("Error fetching location:", error);
      
      // Set the location error so we can display it to the user
      setLocationError(error);
      
      // Only show alert if the LocationErrorHandler component isn't being used
      if (!LocationErrorHandler) {
        Alert.alert("Location Error", error.message || "Unable to fetch your location.");
      }
    }
  };
  
  // Add a retry handler for location errors
  const handleLocationRetry = () => {
    setLocationError(null);
    openLocation();
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

    // Show button when scrolled past 40% of the page
    const scrollThreshold = contentHeight * 0.3;
    
    if (contentOffsetY > scrollThreshold) {
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

  // Update the handleContactRestaurant function with better error handling
  const handleContactRestaurant = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      router.push("/pages/Login");
      return;
    }

    try {
      setLoading(true); // Add loading state
      console.log("[RestaurantScreen] Initiating contact with restaurant:", restaurantData?.name);
      
      if (!restaurantData?.documentId) {
        throw new Error("Restaurant document ID is missing");
      }
      
      // Navigate directly to chat screen
      console.log("[RestaurantScreen] Navigating to chat screen with restaurant:", restaurantData?.documentId);
      router.push({
        pathname: "/pages/ChatScreen",
        params: { 
          restaurantDocumentId: restaurantData.documentId
        }
      });
      
    } catch (error) {
      console.error("[RestaurantScreen] Error in contact restaurant flow:", error);
      Alert.alert("Error", "Could not open chat with this restaurant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add distance information to restaurant card
  const renderRestaurantCard = (restaurant) => {
    const distance = userLocation ? calculateDistance(userLocation, {
      latitude: restaurant.location?.latitude,
      longitude: restaurant.location?.longitude,
    }) : null;

    return (
      <View style={styles.restaurantCard}>
        {/* Existing restaurant card content */}
        {distance && (
          <Text style={styles.distanceText}>{distance} km away</Text>
        )}
      </View>
    );
  };

  // Update the handleBackPress function to always go to home
  const handleBackPress = () => {
    // Always navigate to home instead of trying to go back
    router.push('/pages/Home');
  };

  // Fetch user's allergies when component mounts
  useEffect(() => {
    const fetchUserAllergies = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoadingAllergies(true);
        const response = await fetchProfileByUserId(user.id);
        // Get the profile allergies data from the first profile (myself profile)
        const profileAllergies = response?.data[0]?.profile_allergies[0] || {};
        const allergies = profileAllergies?.allergies || [];
        setUserAllergies(allergies);
      } catch (error) {
        console.error("Error fetching user allergies:", error);
      } finally {
        setIsLoadingAllergies(false);
      }
    };

    fetchUserAllergies();
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView ref={scrollViewRef}
        style={styles.container}
        onScroll={handleScroll} // Handle scrolling
        scrollEventThrottle={16} // Throttle scroll events
      >
        <View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={handleBackPress}>
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
                onPress={handleContactRestaurant}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.contactButtonText}>Contact Restaurant</Text>
                )}
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
              <View style={styles.allergenInfo}>
                <Text style={styles.allergenText}>Your Allergens Filter</Text>
                {userAllergies.length > 0 && (
                  <Text style={styles.allergenCount}>
                    ({userAllergies.length} allergen{userAllergies.length !== 1 ? 's' : ''})
                  </Text>
                )}
              </View>
              {!user ? (
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={() => router.push("/pages/Login")}
                >
                  <Text style={styles.loginButtonText}>Login to use filter</Text>
                </TouchableOpacity>
              ) : (
                <CustomSwitch
                  value={isAllergenOn}
                  initialState={isAllergenOn}
                  onToggle={toggleAllergen}
                  disabled={userAllergies.length === 0}
                />
              )}
            </View>
          </View>

          {/* Menu Card or Message */}
          <View>
            {isLoadingAllergies ? (
              <ActivityIndicator size="large" color="#00D0DD" />
            ) : (
              <>
                {getFilteredMenuItems().length > 0 ? (
                  <MenuCard 
                    menuItems={getFilteredMenuItems()} 
                    userAllergies={userAllergies}
                    isAllergenFilterOn={isAllergenOn}
                  />
                ) : (
                  <View style={styles.noItemsContainer}>
                    <Text style={styles.noItemsText}>
                      {isAllergenOn 
                        ? "No allergen-safe foods available based on your allergen profile."
                        : "There are no foods available for this option."}
                    </Text>
                    {isAllergenOn && userAllergies.length > 0 && (
                      <Text style={styles.allergenListText}>
                        Your allergens: {userAllergies.map(a => a.name).join(", ")}
                      </Text>
                    )}
                  </View>
                )}
              </>
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
      {/* <View>
        <Footer />
      </View> */}


      {/* Show location status */}
      {locationError && (
        <LocationErrorHandler 
          error={locationError} 
          onRetry={handleLocationRetry} 
          compact={true} 
        />
      )}
      
      {/* Restaurant list */}
      <FlatList
        data={filteredRestaurants}
        renderItem={({ item }) => renderRestaurantCard(item)}
        keyExtractor={(item) => item.id}
      />
     </ScrollView>

     {showScrollToTopButton && (
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
          activeOpacity={0.7}
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
    backgroundColor: "red",
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 0,
    opacity: 0.8,
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
    paddingHorizontal: 0,
    width: "100%",
  },
  container: {
    flex: 1,
    // backgroundColor: "#F9F9F9",
    marginBottom: 0
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
    alignItems: "center",
    maxWidth: "25%",
    minWidth: "25%",
    justifyContent: "space-between",
},
icons: {
    backgroundColor: "#fff",
    width: 45, // Fixed width
    height: 45, // Fixed height
    borderRadius: 25, // To maintain a circular shape
    alignItems: "center", // Center the icon
    justifyContent: "center", // Center the icon
    marginRight:10
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
  allergenInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  allergenText: {
    fontSize: 19,
    color: "#000000",
    marginBottom: 4,
  },
  allergenCount: {
    fontSize: 14,
    color: "#666",
  },
  loginButton: {
    backgroundColor: '#00D0DD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    padding: 16,
    textAlign: 'center',
  },
  restaurantCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noItemsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  allergenListText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
});

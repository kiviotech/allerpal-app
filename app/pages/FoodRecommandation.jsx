import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import foodrestro from "../../assets/foodrestro.png";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllMenuItems, fetchMenuItemBySubcuisine } from "../../src/services/menuItemsServices";
import useAllergyStore from "../../src/stores/allergyStore";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { useRouter } from "expo-router";
import restaurantImg from '../../assets/restaurant.png'
import { fetchMenuByMenuItemId } from "../../src/services/menuServices";
import useAuthStore from "../../useAuthStore";
import { fetchProfileById, fetchProfileByUserId } from "../../src/services/profileServices";
import { fetchProfileAllergyByProfileId } from "../../src/services/profileAllergiesServices";
import { createNewFavourite, fetchFavouritesByUserId, updateFavouriteData } from "../../src/services/favouriteServices";
// import { fetchAllMenuItems } from "../../src/services/menuItemsServices"

const { width } = Dimensions.get("window");

const FoodCard = ({ item, onPress }) => {
  const { user } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);

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
          menu_items: [
            {
              id: item.id
            },
          ],
        };
        await createNewFavourite({ data: newFavorite });
      } else {
        // Update existing favorite 
        // Extract IDs from the existing favorite restaurants
      const existingMenuItemsIds = favoriteData.menu_items.map((fav) => fav.id);        
        const updatedRestaurants = isFavorite
        ? existingMenuItemsIds.filter((id) => id !== item.id) // Remove the current restaurant if it's already a favorite
        : [...existingMenuItemsIds, item.id]; // Add the current restaurant ID if not already a favorite

        const updatePayload = {
          data: {
            menu_items: updatedRestaurants,
          },
        };

        await updateFavouriteData(favoriteData.documentId, updatePayload);
      }

      // Toggle the favorite state
      setIsFavorite((prev) => !prev);
      global.EventEmitter.emit("favoritesUpdated");
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(item.id)} style={styles.card}>
      <Image
        source={
          item.image?.[0]?.url
            ? { uri: `${MEDIA_BASE_URL}${item.image?.[0]?.url}` }
            : foodrestro
        }
        style={styles.image}
      />
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>£{item.price}</Text>
        <TouchableOpacity
          onPress={handleFavoritePress}
          style={[styles.heartContainer, isFavorite && styles.heartContainerLiked]}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color="white"
            // style={styles.heartIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>
          {item.is_vegetarian ? "🥬" : "🍖"}
        </Text>
        <Text style={styles.reviewText}>
          {item.is_available ? "Available" : "Unavailable"}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>
          {item.item_name.length > 18
            ? `${item.item_name.substring(0, 18)}...`
            : item.item_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const FoodRecommendations = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredFoodRecommendations, setFilteredFoodRecommendations] = useState([]);
  const [profileAllergies, setProfileAllergies] = useState([]);
  const profileId = useAuthStore((state) => state.profileId);
  const userId = useAuthStore((state) => state?.user?.id);
  const [isAllergenOn, setIsAllergenOn] = useState(false);
  const router = useRouter();

  const onFoodCardPress = async (menuItemId) => {
    try {
      // Fetch restaurants for the selected menu item
      const response = await fetchMenuByMenuItemId(menuItemId)
      const restaurant = response.data?.[0]?.restaurant; // Adjust according to your API response structure
      
      if (restaurant) {
        // Navigate to the RestaurantScreen and pass the restaurantId
        router.push({
          pathname: "/pages/RestaurantScreen",
          params: {
            id: restaurant.id,
            documentId: restaurant.documentId,
          },
        });
      } else {
        console.log("No restaurant found for this menu item.");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    let selectedAllergies = [];
    const getAllergiesOfUser = async () => {
      try {
        const response = await fetchProfileByUserId(userId)
        const profileAllergy = response?.data[0]?.profile_allergies[0]?.allergies || []
        selectedAllergies = profileAllergy.map((allergy) => allergy.name.toLowerCase());
        setIsAllergenOn(response?.data[0]?.profile_allergies[0]?.excludeMayContain)
      } catch (error) {
        console.warn("Error fetching profile allergies");
      }
    };

    const getMenuItems = async () => {
      try {
        const response = await fetchMenuItemBySubcuisine('Mains');
        if (response && response.data) {
          const menuItems = response.data;
          setMenuItems(menuItems);

          // Filter based on allergies after fetching the data
          const filteredItems = menuItems.filter((item) => {
            const description = item.description?.toLowerCase() || ""; // Get description as lowercase
            return !selectedAllergies.some((allergy) =>
              description.includes(allergy.toLowerCase()) // Check if allergy is in the description
            );
          });
          setFilteredFoodRecommendations(filteredItems); // Update filtered items after applying allergy filters
          setLoading(false); // Once the filtering is done, stop loading
        } else {
          console.warn("API response format invalid or empty");
          setMenuItems([]);
          setFilteredFoodRecommendations([]);
          setLoading(false); // Stop loading if API response is invalid
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]); // Fallback
        setFilteredFoodRecommendations([]); // Fallback
        setLoading(false); // Stop loading in case of error
      }
    };
    getAllergiesOfUser();
    getMenuItems();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00aced" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dish recommendations for you</Text>
      <FlatList
        data={
          !isAllergenOn
            ? menuItems.length > 0
              ? menuItems
              : []
            : filteredFoodRecommendations.length > 0
            ? filteredFoodRecommendations
            : []
        }
        renderItem={({ item }) => (
          <FoodCard item={item} onPress={onFoodCardPress} />
        )}
        keyExtractor={(item) => item.documentId}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        ListEmptyComponent={
          isAllergenOn ? (
            <Text style={styles.noItemsText}>No items available</Text>
          ) : (
            <Text style={styles.noItemsText}>
              No suitable items found based on your allergies
            </Text>
          )
        }
      />
    </View>
  );
  
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  noItemsText: {
    textAlign: "center",
    padding: 20,
    color: "#666",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 9,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: width * 0.4,
    marginHorizontal: 8,
    maxHeight: 180,
    minHeight: 180,
  },
  image: {
    width: "100%",
    height: 120,
  },
  priceContainer: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'fixed',
    width: "40%",
    padding: 5,
  },
  priceText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 95,
    left: 6,
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderColor: "gray",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  reviewText: {
    fontSize: 10,
    marginLeft: 2,
    color: "#777",
  },
  detailsContainer: {
    padding: 8,
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 10,
    textTransform: 'capitalize',
  },
  heartContainer: {
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  heartContainerLiked: {
    backgroundColor: "#00aced",
  },
});

export default FoodRecommendations;

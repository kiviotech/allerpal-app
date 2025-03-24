import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import foodrestro from "../../assets/foodrestro.png";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchFoodRecommendationsByProfile } from "../../src/services/menuItemsServices";
import { fetchUserAllergyByUserId } from '../../src/services/userAllergyServices';
import useAuthStore from "../../useAuthStore";
import useFavoritesStore from "../../src/stores/favoritesStore";

const { width } = Dimensions.get("window");

const FoodCard = ({ item, onPress, isFavorite, onFavoritePress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={
            item.image
              ? { uri: item.image }
              : foodrestro
          }
          style={styles.image}
          resizeMode="cover"
        />
        {/* <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive
          ]}
          onPress={() => onFavoritePress(item.id || item.documentId)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity> */}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.item_name}
        </Text>
        {/* <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description || "No description available"}
        </Text> */}
        {/* <Text style={styles.cardPrice}>£{item.price?.toFixed(2) || "N/A"}</Text> */}
        {item.restaurant && (
          <Text style={styles.restaurantName} numberOfLines={1}>
            {item.restaurant.name}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const FoodRecommendations = () => {
  const router = useRouter();
  const { restaurantId } = useLocalSearchParams();
  const profileId = useAuthStore((state) => state.profileId);
  const userId = useAuthStore((state) => state?.user?.id);
  const { favorites, toggleFavorite } = useFavoritesStore();
  
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAllergies, setUserAllergies] = useState([]);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  
  const scrollViewRef = useRef(null);
  const isLoadingMoreRef = useRef(false);

  const onFoodCardPress = async (item) => {
    // Check if item and item.restaurant exist before accessing documentId
    if (!item || !item.restaurant || !item.restaurant.documentId) {
      console.error('Restaurant information is missing from food item:', item);
      return; // Exit early if restaurant data is missing
    }
    
    // Get the documentId from the item
    const documentId = item.restaurant.documentId;
    
    // Navigate to restaurant detail page with the required parameters
    router.push(`/pages/RestaurantScreen?id=${documentId}&documentId=${documentId}&isFavoriteItem=true`);
  };

  const handleFavoritePress = (id) => {
    if (!userId) {
      router.push("/pages/Login");
      return;
    }
    console.log("[FoodRecommendations] Toggling favorite for item ID:", id);
    console.log("[FoodRecommendations] Current favorites:", favorites);
    
    // Make sure we're passing a numeric ID if available, otherwise use the documentId
    const itemId = typeof id === 'number' ? id : parseInt(id);
    toggleFavorite(userId, isNaN(itemId) ? id : itemId);
  };

  const getAllergiesOfUser = async () => {
    try {
      console.log("[FoodRecommendations] Fetching user allergies for profileId:", profileId);
      
      if (!profileId) {
        console.log("[FoodRecommendations] No profileId available");
        return [];
      }
      
      const allergiesResponse = await fetchUserAllergyByUserId(profileId);
      console.log("[FoodRecommendations] Allergies response:", allergiesResponse);
      
      if (allergiesResponse?.data) {
        const allergies = allergiesResponse.data;
        console.log("[FoodRecommendations] User allergies:", allergies);
        
        // Set the state
        setUserAllergies(allergies);
        
        return allergies;
      }
      
      return [];
    } catch (error) {
      console.error("[FoodRecommendations] Error fetching user allergies:", error);
      return [];
    }
  };

  const getMenuItems = async (pageNum = 1, shouldAppend = false) => {
    try {
      console.log("[FoodRecommendations] Fetching menu items using new API with profileId:", profileId);
      
      // Get user allergies first
      const userAllergies = await getAllergiesOfUser();
      console.log("[FoodRecommendations] Retrieved user allergies:", userAllergies);
      
      // Try the new API first
      if (profileId) {
        try {
          if (pageNum > 1) {
            setLoadingMore(true);
            isLoadingMoreRef.current = true;
          }
          
          console.log("[FoodRecommendations] Calling fetchFoodRecommendationsByProfile for page:", pageNum);
          // We're not passing restaurantId to get recommendations across all restaurants
          // Set pageSize to 20 as requested
          const recommendationsResponse = await fetchFoodRecommendationsByProfile(profileId, null, pageNum, 20);
          console.log("[FoodRecommendations] API response:", JSON.stringify(recommendationsResponse, null, 2));
          
          if (recommendationsResponse && recommendationsResponse.data) {
            console.log("[FoodRecommendations] Successfully fetched recommendations");
            
            // Update pagination info
            const paginationMeta = recommendationsResponse.meta?.pagination;
            if (paginationMeta) {
              setTotalPages(paginationMeta.pageCount);
              setHasMore(pageNum < paginationMeta.pageCount);
              console.log("[FoodRecommendations] Pagination info:", {
                currentPage: pageNum,
                totalPages: paginationMeta.pageCount,
                hasMore: pageNum < paginationMeta.pageCount
              });
            } else {
              setHasMore(false);
            }
            
            // Update menu items
            if (shouldAppend) {
              setMenuItems(prev => [...prev, ...recommendationsResponse.data]);
            } else {
              setMenuItems(recommendationsResponse.data);
            }
            
            setLoading(false);
            setLoadingMore(false);
            isLoadingMoreRef.current = false;
          }
        } catch (error) {
          console.error("[FoodRecommendations] Error fetching recommendations:", error);
          setError("Failed to fetch recommendations. Please try again.");
          setLoading(false);
          setLoadingMore(false);
          isLoadingMoreRef.current = false;
        }
      } else {
        console.log("[FoodRecommendations] No profileId available");
        setError("User profile not found. Please complete your profile setup.");
        setLoading(false);
      }
    } catch (error) {
      console.error("[FoodRecommendations] Error in getMenuItems:", error);
      setError("An error occurred. Please try again.");
      setLoading(false);
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      setLoadingMore(true);
      getMenuItems(nextPage, true);
    }
  };

  const handleScroll = (event) => {
    // Simple check if we're near the end of the scroll
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isNearEnd = layoutMeasurement.width + contentOffset.x >= contentSize.width - 100;
    
    if (isNearEnd && !loadingMore && hasMore) {
      handleLoadMore();
    }
  };

  useEffect(() => {
    if (profileId) {
      // Reset pagination when component mounts or profileId changes
      setPage(1);
      setHasMore(true);
      setMenuItems([]);
      setLoading(true);
      getMenuItems(1, false);
    }
    
    // Fetch favorites when component mounts
    if (userId) {
      console.log("[FoodRecommendations] Fetching favorites for user:", userId);
      useFavoritesStore.getState().fetchFavorites(userId);
    }
  }, [profileId, userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={'blue'} />
        <Text style={styles.loadingText}>Loading food recommendations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Recommendations</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={400} // Increase throttle to reduce event frequency
      >
        {menuItems.map((item) => (
          <FoodCard
            key={item.documentId}
            item={item}
            onPress={onFoodCardPress}
            isFavorite={favorites.includes(item.id) || favorites.includes(item.documentId)}
            onFavoritePress={handleFavoritePress}
          />
        ))}
        
        {loadingMore && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color={'blue'} />
            <Text style={styles.loadingMoreText}>Loading more...</Text>
          </View>
        )}
        
        {!hasMore && menuItems.length > 0 && (
          <View style={styles.endMessageContainer}>
            <Text style={styles.endMessageText}>No more items</Text>
          </View>
        )}
      </ScrollView>
      
      {menuItems.length === 0 && !loading && (
        <View style={styles.noItemsContainer}>
          <Text style={styles.noItemsText}>No food recommendations found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    marginBottom: 10,
    color: 'grey',
  },
  card: {
    width: width * 0.38,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
    height: 90,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 8,
  },
  favoriteButtonActive: {
    backgroundColor: "#00aced",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00aced",
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 12,
    color: "#999",
  },
  safetyBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  safeBadge: {
    backgroundColor: "#4CAF50",
  },
  warningBadge: {
    backgroundColor: "#FFC107",
  },
  unsafeBadge: {
    backgroundColor: "#F44336",
  },
  safetyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noItemsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'grey',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  loadingMoreContainer: {
    width: 100,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  loadingMoreText: {
    color: 'grey',
    marginLeft: 10,
    fontSize: 14,
  },
  endMessageContainer: {
    width: 100,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  endMessageText: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 14,
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default FoodRecommendations;

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import foodrestro from "../../assets/foodrestro.png";
// import { Ionicons } from "@expo/vector-icons";
// import { fetchAllMenuItems } from "../../src/services/menuItemsServices";
// const { width } = Dimensions.get("window");

// const FoodCard = ({ item }) => {
//   const [liked, setLiked] = useState(false);

//   const handleHeartPress = () => {
//     setLiked(!liked);
//   };

//   return (
//     <View style={styles.card}>
//       <Image
//         source={item.image?.[0]?.url ? { uri: item.image[0].url } : foodrestro}
//         style={styles.image}
//       />
//       <View style={styles.priceContainer}>
//         <Text style={styles.priceText}>${item.price}</Text>
//         <TouchableOpacity
//           onPress={handleHeartPress}
//           style={[styles.heartContainer, liked && styles.heartContainerLiked]}
//         >
//           <Ionicons
//             name={liked ? "heart" : "heart-outline"}
//             size={18}
//             color="white"
//             style={styles.heartIcon}
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.ratingContainer}>
//         <Text style={styles.ratingText}>
//           {item.is_vegetarian ? "🥬" : "🍖"}
//         </Text>
//         <Text style={styles.reviewText}>
//           {item.is_available ? "Available" : "Unavailable"}
//         </Text>
//       </View>
//       <View style={styles.detailsContainer}>
//         <Text style={styles.name}>{item.item_name}</Text>
//       </View>
//     </View>
//   );
// };

// const FoodRecommendations = () => {
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     const getMenuItems = async () => {
//       try {
//         const response = await fetchAllMenuItems();
//         setMenuItems(response.data);
//         console.log("menuItems", response.data);
//       } catch (error) {
//         console.error("Error fetching menu items:", error);
//       }
//     };

//     getMenuItems();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Food recommendations for you</Text>
//       <FlatList
//         data={menuItems}
//         renderItem={({ item }) => <FoodCard item={item} />}
//         keyExtractor={(item) => item.documentId}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: 8 }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 20,
//     backgroundColor: "#f5f5f5",
//     width: "100%",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     paddingHorizontal: 16,
//     marginBottom: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 9,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//     width: width * 0.4,
//     marginHorizontal: 8,
//     height: 170,
//   },
//   image: {
//     width: "100%",
//     height: 120, // Reduced height for a shorter card
//   },
//   priceContainer: {
//     position: "absolute",
//     top: 6,
//     left: 6,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingHorizontal: 8,
//   },
//   priceText: {
//     fontSize: 15,
//     fontWeight: "bold",
//     color: "#000",
//     backgroundColor: "white",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     position: "absolute",

//     top: 108,
//     left: 6,
//     backgroundColor: "white",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 12,
//     borderColor: "gray",
//   },
//   ratingText: {
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   reviewText: {
//     fontSize: 10,
//     marginLeft: 2,
//     color: "#777",
//   },
//   detailsContainer: {
//     padding: 8,
//     alignItems: "center",
//   },
//   name: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 4,
//     marginTop: 10,
//   },
//   heartContainer: {
//     width: 25,
//     height: 25,
//     borderRadius: 12,
//     backgroundColor: "rgba(255, 255, 255, 0.5)", // Transparent background
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 8,
//   },
//   heartIcon: {
//     marginLeft: 3,
//   },
//   heartContainerLiked: {
//     backgroundColor: "#00aced", // Change to blue when liked
//   },
// });

// export default FoodRecommendations;
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
import { fetchAllMenuItems } from "../../src/services/menuItemsServices";
import useAllergyStore from "../../src/stores/allergyStore";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const FoodCard = ({ item, onPress }) => {
  const [liked, setLiked] = useState(false);

  const handleHeartPress = () => {
    setLiked(!liked);
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
        <Text style={styles.priceText}>${item.price}</Text>
        <TouchableOpacity
          onPress={handleHeartPress}
          style={[styles.heartContainer, liked && styles.heartContainerLiked]}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={18}
            color="white"
            style={styles.heartIcon}
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
        <Text style={styles.name}>{item.item_name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const FoodRecommendations = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedAllergies = useAllergyStore((state) => state.selectedAllergies);
  const router = useRouter();

  const onFoodCardPress = async (menuItemId) => {
    console.log("Selected Menu Item ID:", menuItemId);

    try {
      // Fetch restaurants for the selected menu item
      const response = await fetch(
        `${MEDIA_BASE_URL}/api/menus?filters[menu_items][id][$eq]=${menuItemId}&populate=*`
      );
      const data = await response.json();
      console.log("Associated Restaurants:", data);
      const restaurant = data?.data?.[0]?.restaurant; // Adjust according to your API response structure
      console.log(restaurant);
      // Navigate to another screen or update the state to display the restaurants
      const imageUrl =
        restaurant.image && restaurant.image[0]?.url
          ? `${MEDIA_BASE_URL}${restaurant.image[0].url}`
          : "";
      if (restaurant) {
        // Navigate to the RestaurantScreen and pass the restaurantId
        router.push({
          pathname: "/pages/RestaurantScreen",
          params: {
            id: restaurant.documentId,
            documentId: restaurant.documentId,
            name: restaurant.name,
            rating: restaurant.rating,
            categories: restaurant.categories,
            image: imageUrl,
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
    const getMenuItems = async () => {
      try {
        const response = await fetchAllMenuItems();
        // Filter out items containing allergens
        const filteredItems = response.data.filter((item) => {
          const description = item.description?.toLowerCase() || "";
          return !selectedAllergies.some((allergy) =>
            description.includes(allergy.toLowerCase())
          );
        });

        setMenuItems(filteredItems);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    getMenuItems();
  }, [selectedAllergies]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00aced" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food recommendations for you</Text>
      {menuItems.length === 0 ? (
        <Text style={styles.noItemsText}>
          No suitable items found based on your allergies
        </Text>
      ) : (
        <FlatList
          data={menuItems}
          renderItem={({ item }) => (
            <FoodCard item={item} onPress={onFoodCardPress} />
          )}
          keyExtractor={(item) => item.documentId}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      )}
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
    height: 170,
  },
  image: {
    width: "100%",
    height: 120,
  },
  priceContainer: {
    position: "absolute",
    top: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
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
    top: 108,
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
  },
  heartContainer: {
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  heartIcon: {
    marginLeft: 3,
  },
  heartContainerLiked: {
    backgroundColor: "#00aced",
  },
});

export default FoodRecommendations;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import useAuthStore from "../../useAuthStore";
import { fetchAllCuisines } from "../../src/services/cuisineServices";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const FoodItem = () => {
  const router = useRouter();
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  let userId;

  try {
    userId = useAuthStore((state) => state.user?.id);
    if (!userId) {
      throw new Error("User ID is not available.");
    }
  } catch (error) {
    console.error("Error accessing user ID:", error.message);
    userId = null;
  }

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const data = await fetchAllCuisines();
        // console.log('cuisines', data.data)
        setCuisines(data.data)
      } catch (error) {
        console.error("Error fetching cuisines:", error);
      } finally {
        setLoading(false); // Ensure loading stops regardless of success or failure
      }
    };
    fetchCuisines();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cuisines}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const imageUrl =
            item?.cuisine_image && item.cuisine_image.length > 0
              ? `${MEDIA_BASE_URL}${item.cuisine_image[0].url}`
              : null;

          // Truncate the name to a maximum length (e.g., 10 characters)
          const truncateName = (name, maxLength = 10) => {
            return name.length > maxLength
              ? `${name.slice(0, maxLength)}...`
              : name;
          };

          return (
            <TouchableOpacity
            onPress={() => {
              const truncatedName = truncateName(item.cuisine_type);
              router.push({
                pathname: "./Search",
                params: { searchTerm: truncatedName }, // Pass searchTerm as a parameter
              });
            }}
          >
              <View style={styles.itemContainer}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                  <Text style={styles.noImageText}>No Image</Text>
                )}
                <Text style={styles.text}>{truncateName(item.cuisine_type)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 5,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemContainer: {
    width: 69,
    alignItems: "center",
    marginHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    height: "auto",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 10,
  },
  noImageText: {
    fontSize: 12,
    color: "gray",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FoodItem;

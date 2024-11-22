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
import { fetchUserAllergyById } from "../../src/services/userAllergyServices";
import useAllergyStore from "../../src/stores/allergyStore";

const FoodItem = () => {
  const [allergens, setAllergens] = useState([]);
  const [loading, setLoading] = useState(true);
  const setSelectedAllergies = useAllergyStore(
    (state) => state.setSelectedAllergies
  );

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
    const fetchAllergies = async () => {
      try {
        const data = await fetchUserAllergyById(userId);
        const allergies =
          data?.data?.map((item) => item.allergies).flat() || [];

        setAllergens(allergies);
        // Now only storing the names
        setSelectedAllergies(allergies);

        console.log("Allergy data with images:", data.data);
      } catch (error) {
        console.log("Error fetching allergies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllergies();
  }, [userId, setSelectedAllergies]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      {allergens.length === 0 ? (
        <Text style={styles.noDataText}>No allergies found</Text>
      ) : (
        <FlatList
          data={allergens}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            // Construct the full image URL for each allergy
            const imageUrl = item?.Allergeimage?.[0]?.url
              ? `${MEDIA_BASE_URL}${item.Allergeimage[0].url}`
              : null;

            // Truncate the name to a maximum length (e.g., 10 characters)
            const truncateName = (name, maxLength = 5) => {
              return name.length > maxLength
                ? `${name.slice(0, maxLength)}...`
                : name;
            };

            return (
              <View style={styles.itemContainer}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                  <Text style={styles.noImageText}>No Image</Text>
                )}
                <Text style={styles.text}>{truncateName(item.name)}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: "#f2f2f2",
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    width: 69,
    alignItems: "center",
    marginHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 50,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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

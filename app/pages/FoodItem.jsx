



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

const FoodItem = () => {
  const [allergens, setAllergens] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = useAuthStore((state) => state.user.id);

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const data = await fetchUserAllergyById(userId);
       
      

        const allergies = data?.data?.map((item) => item.allergies).flat() || [];
        
        setAllergens(allergies);
        console.log("Allergy data with images:",data.data);
      }
       catch (error) {
        console.log("Error fetching allergies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllergies();
  }, [userId]);

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

            return (
              <View style={styles.itemContainer}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                  <Text style={styles.noImageText}>No Image</Text>
                )}
                <Text style={styles.text}>{item.name}</Text>
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
    height:'auto'
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
  },
});

export default FoodItem;
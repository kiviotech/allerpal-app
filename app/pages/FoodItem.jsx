import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { getAllergies } from '../../src/api/repositories/allergyRepositories';
import { MEDIA_BASE_URL } from '../../src/api/apiClient';

const FoodItem = () => {
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch allergies on component mount
    const fetchAllergies = async () => {
      try {
        const response = await getAllergies();
        setAllergies(response.data.data); // Assuming response.data contains the allergy list
      } catch (error) {
        console.error("Failed to fetch allergies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllergies();
  }, []);

  // Loading indicator while fetching data
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allergies}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          // Construct the full image URL for each item
          const imageUrl = item.Allergeimage && item.Allergeimage[0]?.url
            ? `${MEDIA_BASE_URL}${item.Allergeimage[0].url}`
            : null;
          console.log("Image URL:", imageUrl);

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#f2f2f2',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    width: 69,
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  noImageText: {
    fontSize: 12,
    color: 'gray',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default FoodItem;

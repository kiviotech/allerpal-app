

import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Restro from "../../assets/Restro.png";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const restaurantData = [
  {
    id: 1,
    name: "McDonald's",
    image: Restro,
    rating: 4.5,
    reviews: 25,
    categories: ['BURGER', 'CHICKEN', 'FAST FOOD'],
  },
  {
    id: 2,
    name: "Burger King",
    image: Restro,
    rating: 4.3,
    reviews: 18,
    categories: ['BURGER', 'FAST FOOD'],
  },
  {
    id: 3,
    name: "Burger King",
    image: Restro,
    rating: 4.3,
    reviews: 18,
    categories: ['BURGER', 'FAST FOOD'],
  },
];

const RestaurantCard = ({ restaurant }) => {
  return (
    <View style={styles.card}>
      <Image source={restaurant.image} style={styles.image} />
      {/* Icons positioned at the top-right corner */}
      <View style={styles.iconContainer}>
        <View style={styles.heart}>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={20} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.heart}>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={20} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{restaurant.rating} ⭐</Text>
        <Text style={styles.reviewText}>({restaurant.reviews}+)</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <View style={styles.categories}>
          {restaurant.categories.map((category, index) => (
            <Text key={index} style={styles.category}>
              {category}
            </Text>
          ))}
        </View>

      </View>
    </View>
  );
};

const Favourites = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorites</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {restaurantData.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingLeft: 16,
  },
  card: {
    width: width * 0.7,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    height: 250,
  },
  image: {
    width: '100%',
    height: 150,
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '3%'
  },
  icon: {
    marginLeft: 0,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#777',
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  category: {
    fontSize: 12,
    color: '#555',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#eee',
    borderRadius: 15,
    marginRight: 4,
    marginBottom: 4,
  },

  heart: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: '#00aced',
    justifyContent: 'center',
    alignItems: 'center',

  }
});

export default Favourites;
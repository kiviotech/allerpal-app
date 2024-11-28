import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');
import foodrestro from '../../assets/foodrestro.png'
import Restro from "../../assets/Restro.png";
// import Filter from "../../assets/filtericon.png"
import Footer from './Footer';

const foodData = [
  { id: '1', name: 'Idli', rating: 4.8, price: "$5.50", image: foodrestro, reviews: 25, },
  { id: '2', name: 'Tacos', rating: 4.6, price: "$8.50", image: foodrestro, reviews: 35, },
  { id: '3', name: 'Birayani', rating: 4.8, price: "$5.50", image: foodrestro, reviews: 25, },
  { id: '4', name: 'Kabab', rating: 4.6, price: "$8.50", image: foodrestro, reviews: 35, },
];

const restaurantData = [
  { id: '1', name: "McDonald's", rating: 4.5, reviews: 25, tags: ['BURGER', 'FAST FOOD'], image: Restro, location: 'Birmingham', },
  { id: '2', name: 'Burger King', rating: 4.3, reviews: 40, tags: ['BURGER', 'FAST FOOD'], image: Restro, location: 'Bangalore', },
];

const popularSearches = [
  { id: '1', name: 'Top Rated', image: require('../../assets/star.png') },
  { id: '2', name: 'Best Cuisines', image: require('../../assets/cusines.png') },
  // { id: '3', name: 'Vegan Options', image: require('../../assets/vegan.png') }, // Add more images as needed
];

const recentSearches = ['Mexican Food', 'Italian', 'Birmingham'];
const recentViews = restaurantData;

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFood, setFilteredFood] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [showInitial, setShowInitial] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false); // State for the filter modal
  const [selectedSortOption, setSelectedSortOption] = useState(null); // State for selected sort option

  useEffect(() => {
    // Reset to initial view when search is cleared
    if (!searchTerm) {
      setShowInitial(true);
      setFilteredFood([]);
      setFilteredRestaurants([]);
    }
  }, [searchTerm]);

  const applyFilters = () => {
    // Handle filter application logic here...
    setFilterVisible(false); // Close the modal after applying filters
  };

  const handleSortOptionPress = (option) => {
    setSelectedSortOption(option); // Update the selected option
  };

  const getSortOptionStyle = (option) => {
    return option === selectedSortOption
      ? { backgroundColor: '#00D0DD', color: 'white' } // Selected option style
      : {}; // Default style
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    setShowInitial(false);

    if (text.toLowerCase() === 'food') {
      // Show all food data
      setFilteredFood(foodData);
      setFilteredRestaurants(restaurantData);
    } else if (text.toLowerCase() === 'restaurant') {
      // Show all restaurant data
      setFilteredFood([]);
      setFilteredRestaurants(restaurantData);
    } else if (text) {
      const foodMatches = foodData.filter((food) =>
        food.name.toLowerCase().includes(text.toLowerCase())
      );
      const restaurantMatches = restaurantData.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(text.toLowerCase())
      );

      if (foodMatches.length > 0) {
        setFilteredFood(foodMatches);
        setFilteredRestaurants(restaurantData);
      } else {
        setFilteredFood([]);
        setFilteredRestaurants(restaurantMatches);
      }
    }
  };


  // food card format data

  const [liked, setLiked] = useState(false);

  const handleHeartPress = () => {
    setLiked(!liked);
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>{item.price}</Text>
        <TouchableOpacity onPress={handleHeartPress} style={[styles.heartContainer, liked && styles.heartContainerLiked]}>

          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={18}
            color='white'
            style={styles.heartIcon}
          />

        </TouchableOpacity>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{item.rating} ⭐</Text>
        <Text style={styles.reviewText}>({item.reviews}+)</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{item.name}</Text>

      </View>
    </View>


  );

  const renderRestaurantItem = ({ item }) => (

    <View style={styles.cardContainer}>
      <View style={styles.card1}>
        <Image source={item.image} style={styles.image1} />
        {/* Icons positioned at the top-right corner */}
        <View style={styles.iconContainer1}>
          <View style={styles.heart1}>
            <Ionicons name="heart-outline" size={20} color="white" style={styles.icon1} />
          </View>
          <View style={styles.heart1}>
            <Ionicons name="chatbubble-outline" size={20} color="white" style={styles.icon1} />
          </View>
        </View>
        <View style={styles.ratingContainer1}>
          <Text style={styles.ratingText1}>{item.rating} ⭐</Text>
          <Text style={styles.reviewText1}>({item.reviews}+)</Text>
        </View>
        <View style={styles.detailsContainer1}>
          <Text style={styles.name1}>{item.name}</Text>
          <View style={styles.categories1}>
            {item.tags.map((category, index) => (
              <Text key={index} style={styles.category1}>
                {category}
              </Text>
            ))}
          <Text style={{flex: 1, justifyContent: 'flex-end',marginLeft:100}}>{item.location}</Text>
          </View>

        </View>
      </View>

    </View>
  );

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Find food or restaurant..."
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={handleSearch}
            />
            <TouchableOpacity onPress={() => setFilterVisible(true)}>
              <Image source={require('../../assets/filter.png')} style={styles.filterImage} />
            </TouchableOpacity>
          </View>

          {/* Filter Modal */}
          <Modal
            visible={filterVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setFilterVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filters</Text>

                {/* Sort Options */}
                <Text style={styles.sectionTitle}>Sort by</Text>
                <View style={styles.sortOptions}>
                  {['Relevance', 'Price: low to high', 'Price: high to low', 'Location: nearest to farthest', 'Location: farthest to nearest'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.optionButton, getSortOptionStyle(option)]} // Apply conditional style
                      onPress={() => handleSortOptionPress(option)} // Handle press
                    >
                      <Text style={{ color: option === selectedSortOption ? 'white' : 'black' }}>{option}</Text> {/* Conditional text color */}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Cuisine Options */}
                <Text style={styles.sectionTitle}>By Cuisine</Text>
                <View style={styles.cusinesOptions}>
                  {['Italian', 'Mexican', 'Chinese', 'Indian', 'British', 'Korean'].map((cuisine, index) => (
                    <TouchableOpacity key={index} 
                    style={[styles.optionButton, getSortOptionStyle(index)]} // Apply conditional style
                    onPress={() => handleSortOptionPress(index)} // Handle press
                    >
                      <Text style={{ color: index === selectedSortOption ? 'white' : 'black' }}>{cuisine}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => setFilterVisible(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
                    <Text style={styles.applyText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {showInitial ? (
            <>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <View style={styles.recentSearchContainer}>
                {recentSearches.map((item, index) => (
                  <Text key={index} style={styles.searchTag}>{item}</Text>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Popular Searches</Text>
              <View style={styles.popularSearchContainer}>
                {popularSearches.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.popularSearchItem}>
                    <Image source={item.image} style={styles.popularSearchImage} />
                    <Text style={styles.searchTag}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Recent Views</Text>
              <FlatList
                data={recentViews}
                renderItem={renderRestaurantItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <>
              {filteredFood.length > 0 && (
                <>
                  {/* <Text style={styles.sectionTitle}>Food Results</Text> */}
                  <FlatList
                    data={filteredFood}
                    renderItem={renderFoodItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </>
              )}

              {filteredRestaurants.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Restaurant Reccomandation</Text>
                  <FlatList
                    data={filteredRestaurants}
                    renderItem={renderRestaurantItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                  />
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
      <View style={{ display: 'flex' }}>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: { flex: 1, padding: 10, width: '100%' },
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 20 },
  searchIcon: { marginRight: 8, },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, padding: 10 },
  filterImage: {
    width: 20,
    height: 20,
    // marginLeft: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  recentSearchContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  searchTag: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 20, fontSize: 14, backgroundColor: '#f1f1f1' },

  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 9,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: width * 0.4,
    marginHorizontal: 8,
    height: 155
  },
  image: {
    width: '100%',
    height: 120,  // Reduced height for a shorter card
  },
  popularSearchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },

  popularSearchItem: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 5,
    width: width * 0.25, // Adjust size based on the layout
    borderColor: '#00D0DD',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff'
  },

  popularSearchImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // For rounded images
    marginBottom: 5,
  },

  searchTag: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  priceContainer: {

    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  priceText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',

    top: 108,
    left: 6,
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderColor: 'gray'
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 10,
    marginLeft: 2,
    color: '#777',
  },
  detailsContainer: {
    padding: 8,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 5
  },
  heartContainer: {

    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,


  },
  heartContainerLiked: {
    backgroundColor: '#00aced',
  },
  card1: {
    width: '90%',
    // width: width * 0.7,
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
  image1: {
    width: '100%',
    height: 150,
  },
  iconContainer1: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '3%'
  },
  icon1: {
    marginLeft: 0,
  },
  ratingContainer1: {
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
  ratingText1: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewText1: {
    fontSize: 12,
    marginLeft: 4,
    color: '#777',
  },
  detailsContainer1: {
    padding: 16,
  },
  name1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categories1: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  category1: {
    fontSize: 12,
    color: '#555',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#eee',
    borderRadius: 15,
    marginRight: 4,
    marginBottom: 4,
  },

  heart1: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: '#00aced',
    justifyContent: 'center',
    alignItems: 'center',

  },
  // Modal styles
  modalContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  modalContent: { width: '100%', backgroundColor: 'white', borderRadius: 8, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  sortOptions: { flexDirection: 'column', flexWrap: 'wrap', marginVertical: 8 },
  cusinesOptions: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10,  },
  optionButton: { padding: 8, borderWidth: 1, borderColor: '#00D0DD', borderRadius: 20, margin: 4, },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 16 },
  cancelButton: { padding: 12, paddingHorizontal: 40, backgroundColor: '#fff', borderRadius: 8 },
  applyButton: { paddingVertical: 12,paddingHorizontal: 40, backgroundColor: '#00D0DD', borderRadius: 8 },
  cancelText: { color: '#00D0DD' },
  applyText: { color: '#fff' },
});

export default Search;

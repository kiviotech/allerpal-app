import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import foodrestro from '../../assets/foodrestro.png';
import Restro from "../../assets/Restro.png";
import Footer from './Footer';
import { getAllRestaurants } from '../../src/api/repositories/restaurantRepositories';
import { fetchAllMenuItems } from '../../src/services/menuItemsServices';

const { width } = Dimensions.get('window');


const popularSearches = [
  { id: '1', name: 'Top Rated', image: require('../../assets/star.png') },
  { id: '2', name: 'Best Cuisines', image: require('../../assets/cusines.png') },
];

// const recentSearches = ['Mexican Food', 'Italian', 'Birmingham'];

const Search = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFood, setFilteredFood] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [showInitial, setShowInitial] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);

  const [restaurantPage, setRestaurantPage] = useState(1);
  const [foodPage, setFoodPage] = useState(1);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [loadingFood, setLoadingFood] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (!searchTerm) {
      setShowInitial(true);
      setFilteredFood([]);
      setFilteredRestaurants([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async (page = 1, limit = 3) => {
    try {
      const response = await getAllRestaurants({ page, limit });
      setRestaurants(response.data.data || []);
      setFilteredRestaurants(response.data.data || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants([]);
      setFilteredRestaurants([]);
    }
  };

  const loadMoreRestaurants = () => {
    if (!loadingRestaurants) {
      setRestaurantPage((prevPage) => prevPage + 1);
      fetchRestaurants(restaurantPage + 1);
    }
  };

  useEffect(() => {
    const getMenuItems = async () => {
      try {
        const response = await fetchAllMenuItems();
        if (response && response.data) {
          const menuItems = response.data;
          setMenuItems(menuItems);
          setFilteredFood(menuItems);
        } else {
          setMenuItems([]);
          setFilteredFood([]);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
        setFilteredFood([]);
      }
    };
    getMenuItems();
  }, []);

  const applyFilters = () => {
    setFilterVisible(false);
  };

  const handleSortOptionPress = (option) => {
    setSelectedSortOption(option);
  };

  const getSortOptionStyle = (option) => {
    return option === selectedSortOption
      ? { backgroundColor: '#00D0DD', color: 'white' }
      : {};
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    setShowInitial(false);
    if (text.length < 3) {
      setFilteredRestaurants([]);
      setFilteredFood([]);
      return;
    }


    else {
      const searchWords = text.toLowerCase().split(' ');

      const filtered = restaurants.filter((restaurant) => {
        const locationWords = restaurant.location.toLowerCase().split(',');
        const nameWords = restaurant.name.toLowerCase().split(' ');
        
        const filteredFood = menuItems.filter((food) => {
          const foodNameWords = food.item_name.toLowerCase().split(' '); // Split item name into words
          const categoryWords = food.category?.toLowerCase().split(' ') || []; // Split category if it exists

        const locationMatch = searchWords.some((searchWord) =>
          locationWords.includes(searchWord)
        );

        const nameMatch = searchWords.some((searchWord) =>
          nameWords.includes(searchWord))

        const foodNameMatch = searchWords.some((searchWord) =>
          foodNameWords.includes(searchWord)
        );
  
        const categoryMatch = searchWords.some((searchWord) =>
          categoryWords.includes(searchWord)
        );

        return locationMatch || nameMatch || foodNameMatch || categoryMatch;
        });
    
        setFilteredFood(filteredFood);
      });

      setFilteredRestaurants(filtered);

      const matchedSearches = filtered
      .map((restaurant) => restaurant.name || restaurant.location)
      .filter((value, index, self) => self.indexOf(value) === index); // Ensure uniqueness

    setRecentSearches((prevSearches) => [
      ...matchedSearches,
      ...prevSearches,
    ].slice(0, 3));
  }
  };

  const [liked, setLiked] = useState(false);

  const handleHeartPress = () => {
    setLiked(!liked);
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]); // Clear recent searches
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
            <Text style={{ flex: 1, justifyContent: 'flex-end', marginLeft: 100 }}>{item.location}</Text>
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
              <Ionicons name="options" size={26} color="#00D0DD" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          </View>

          <Modal
            visible={filterVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setFilterVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filters</Text>

                <Text style={styles.sectionTitle}>Sort by</Text>
                <View style={styles.sortOptions}>
                  {['Relevance', 'Price: low to high', 'Price: high to low', 'Location: nearest to farthest', 'Location: farthest to nearest'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.optionButton, getSortOptionStyle(option)]}
                      onPress={() => handleSortOptionPress(option)}
                    >
                      <Text style={{ color: option === selectedSortOption ? 'white' : 'black' }}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionTitle}>By Cuisine</Text>
                <View style={styles.cusinesOptions}>
                  {['Italian', 'Mexican', 'Chinese', 'Indian', 'British', 'Korean'].map((cuisine, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.optionButton, getSortOptionStyle(index)]}
                      onPress={() => handleSortOptionPress(index)}
                    >
                      <Text style={{ color: index === selectedSortOption ? 'white' : 'black' }}>{cuisine}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

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
              {recentSearches.length > 0 ?
                (
                  <>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <View style={styles.recentSearchContainer}>
                      {recentSearches.map((search, index) => (
                        <Text key={index} style={styles.recentSearchText}>
                          {search}
                        </Text>
                      ))}
                    </View>
                    <TouchableOpacity
                      onPress={handleClearRecentSearches}
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                  </>
                ) :
                (
                  <Text style={styles.sectionTitle}>Start typing to search for restaurants or food items...</Text>
                )
              }
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Search Results</Text>

              <Text style={styles.subTitle}>Menu Items</Text>
              <FlatList
                data={filteredFood}
                renderItem={renderFoodItem}
                keyExtractor={(item) => item.id}
                numColumns={1}
              />

              <Text style={styles.subTitle}>Restaurants</Text>
              <FlatList
                data={filteredRestaurants}
                renderItem={renderRestaurantItem}
                keyExtractor={(item) => item.id}
                onEndReached={loadMoreRestaurants}
                onEndReachedThreshold={0.5}
              />
            </>
          )}
        </View>
      </ScrollView>
      <Footer />
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
  cusinesOptions: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10, },
  optionButton: { padding: 8, borderWidth: 1, borderColor: '#00D0DD', borderRadius: 20, margin: 4, },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 16 },
  cancelButton: { padding: 12, paddingHorizontal: 40, backgroundColor: '#fff', borderRadius: 8 },
  applyButton: { paddingVertical: 12, paddingHorizontal: 40, backgroundColor: '#00D0DD', borderRadius: 8 },
  cancelText: { color: '#00D0DD' },
  applyText: { color: '#fff' },
});

export default Search;

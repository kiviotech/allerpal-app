import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import foodrestro from '../../assets/foodrestro.png';
import Restro from "../../assets/Restro.png";
import Footer from './Footer';
import { getAllRestaurants } from '../../src/api/repositories/restaurantRepositories';
import { fetchAllMenuItems } from '../../src/services/menuItemsServices';
import { MEDIA_BASE_URL } from '../../src/api/apiClient';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router';
import { saveToStorage } from '../../src/utils/storage';
import { fetchAllCuisines } from '../../src/services/cuisineServices';

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
  const [recentViews, setRecentViews] = useState([]);
  const [hasMoreRestaurants, setHasMoreRestaurants] = useState(true);
  const [restaurantPage, setRestaurantPage] = useState(1);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [filteredCuisines, setFilteredCuisines] = useState([]);
  const router = useRouter()

  // useEffect(() => {
  //   if (cuisine_type) {
  //     handleSearch(cuisine_type); // Automatically search using cuisine_type
  //   }
  // }, [cuisine_type]);

  let uniqueCuisines = [];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [menuResponse, restaurantResponse] = await Promise.all([
          fetchAllMenuItems(),
          getAllRestaurants({ page: 1, limit: 3 }),
        ]);

        // Handle Menu Items
        if (menuResponse?.data) {
          setMenuItems(menuResponse.data);
          setFilteredFood(menuResponse.data);
          setCuisines(menuResponse.data.map(item => item.cuisine))

          uniqueCuisines = [...new Set(cuisines.map((type) => type.cuisine_type))];
          // console.log('cuiiii', uniqueCuisines)
          // const initialMenus = menuResponse?.data || [];
        } else {
          setMenuItems([]);
          setFilteredFood([]);
          setFilteredCuisines([]);
        }

        // Handle Restaurants
        const initialRestaurants = restaurantResponse?.data?.data || [];
        setRestaurants(initialRestaurants);
        setFilteredRestaurants(initialRestaurants);
        setHasMoreRestaurants(initialRestaurants.length > 0);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setMenuItems([]);
        setFilteredFood([]);
        setRestaurants([]);
        setFilteredRestaurants([]);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch more restaurants when user scrolls
  const fetchRestaurants = useCallback(
    async (page) => {
      if (loadingRestaurants || !hasMoreRestaurants) return;

      setLoadingRestaurants(true);
      try {
        const response = await getAllRestaurants({ page, limit: 2 });
        const newRestaurants = response?.data?.data || [];
        setRestaurants((prev) => (page === 1 ? newRestaurants : [...prev, ...newRestaurants]));
        setFilteredRestaurants((prev) =>
          page === 1 ? newRestaurants : [...prev, ...newRestaurants]
        );
        setHasMoreRestaurants(newRestaurants.length > 0); // Stop fetching if no data is returned
        setRestaurantPage(page);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoadingRestaurants(false);
      }
    },
    [loadingRestaurants, hasMoreRestaurants]
  );

  // useEffect(() => {
  //   const fetchCuisine = async () => {
  //     const CuisineResponse = await fetchAllCuisines();
  //     console.log('resp', CuisineResponse.data)
  //   }
  //   fetchCuisine();
  // }, [])
  // Infinite scroll handler with debounce
  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        fetchRestaurants(restaurantPage + 1); // Fetch next page on scroll
      }
    };

    const debounceScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debounceScroll);
    return () => window.removeEventListener("scroll", debounceScroll);
  }, [restaurantPage, fetchRestaurants]);

  // Debounce function to prevent rapid API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

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
    console.log('text', text)
    setSearchTerm(text);
    setShowInitial(false);
    if (text.length < 3) {
      setFilteredRestaurants([]);
      setFilteredFood([]);
      setFilteredCuisines([]);
      return;
    }
    const filteredRestaurantsList = restaurants.filter(
      (restaurant) =>
        restaurant.location.toLowerCase().includes(text.toLowerCase()) ||
        restaurant.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRestaurants(filteredRestaurantsList);

    const filteredFoodList = menuItems.filter((food) =>
      food.item_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFood(filteredFoodList);

    const filteredCuisinesTypes = menuItems.filter((menuItem) =>
      menuItem.cuisine.cuisine_type.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFood(filteredCuisinesTypes);

    const matchedSearches = [
      ...new Set(
        filteredRestaurantsList
          .map((restaurant) => restaurant.name || restaurant.location)
          .concat(filteredFoodList.map((food) => food.item_name))
      ), // Merge restaurant and food names for recent searches
    ];

    setRecentSearches((prevSearches) => {
      const updatedSearches = [...matchedSearches, ...prevSearches.filter((s) => s !== text)];
      return updatedSearches.slice(0, 3); // Limit to 5
    });
  };

  useEffect(() => {
    saveToStorage('recentViews', recentViews);
  }, [recentViews]);

  useEffect(() => {
    saveToStorage('recentSearches', recentSearches);
  }, [recentSearches]);

  const [liked, setLiked] = useState(false);

  const handleHeartPress = () => {
    setLiked(!liked);
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]); // Clear recent searches
  };

  const handleClearRecentViews = () => {
    setRecentViews([]); // Clear recent views
  };

  const handlePopularSearch = (search) => {
    setSearchTerm(search);
    handleSearch(search); // Trigger the search with the selected popular search
  };

  const handleViewRestaurant = (restaurant) => {
    console.log('rest', restaurant)
    const imageUrl =
      restaurant.image && restaurant.image[0]?.url
        ? `${MEDIA_BASE_URL}${restaurant.image[0].url}`
        : Restro;

    router.push({
      pathname: "pages/RestaurantScreen",
      params: {
        id: restaurant.documentId,
        documentId: restaurant.documentId,
        name: restaurant.name,
        rating: restaurant.rating,
        categories: restaurant.categories,
        image: imageUrl,
      },
    })
    setRecentViews((prevViews) => {
      const updatedViews = prevViews.filter((item) => item.id !== restaurant.id);
      const newViews = [{ ...restaurant, image: imageUrl }, ...updatedViews];
      return newViews.slice(0, 5); // Limit to 5
    });
  };


  const renderFoodItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={foodrestro} style={styles.image} />
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
        <Text style={styles.name}>{item.item_name}</Text>
      </View>
    </View>
  );

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleViewRestaurant(item)}>
      <View style={styles.cardContainer}>
        <View style={styles.card1}>
          <Image source={Restro} style={styles.image1} />
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
              <Text style={styles.loc}>{item.location}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
              <View>
                <View>
                  <Text style={styles.sectionTitle}>Popular Searches</Text>
                  <FlatList
                    data={popularSearches}
                    horizontal={true}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    // style={{ paddingHorizontal: 10 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.popularSearchCard}
                        onPress={() => handlePopularSearch(item.name)}
                      >
                        <Image source={item.image} style={styles.popularSearchImage} />
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
                <View>
                  <View style={styles.recentHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity
                      onPress={handleClearRecentSearches}
                      style={styles.clearButton}
                    >
                      <Text>X</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.recentSearchContainer}>
                    {recentSearches.map((search, index) => (
                      <Text key={index} style={styles.recentSearchText}>
                        {search}
                      </Text>
                    ))}
                  </View>
                </View>
                <View>
                  <>
                    <Text style={styles.subTitle}>Menu Items</Text>
                    <FlatList
                      data={filteredFood}
                      renderItem={renderFoodItem}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => item.id}
                      numColumns={1}
                    />
                  </>
                </View>
              </View>
              <View>
                <>
                  <Text style={styles.subTitle}>Restaurants</Text>
                  <FlatList
                    data={filteredRestaurants}
                    renderItem={renderRestaurantItem}
                    keyExtractor={(item) => item.id}
                    // onEndReached={loadMoreRestaurants}
                    onEndReachedThreshold={0.5}

                  />
                </>
              </View>

            </>
          ) : (
            <>
              {recentSearches.length > 0 ?
                (
                  <>
                    <View style={styles.recentHeader}>
                      <Text style={styles.sectionTitle}>Recent Searches</Text>
                      <TouchableOpacity
                        onPress={handleClearRecentSearches}
                        style={styles.clearButton}
                      >
                        <Text>X</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.recentSearchContainer}>
                      {recentSearches.map((search, index) => (
                        <Text key={index} style={styles.recentSearchText}>
                          {search}
                        </Text>
                      ))}
                    </View>

                    {recentViews.length > 0 && (
                      <>
                        <View style={styles.recentHeader}>
                          <Text style={styles.sectionTitle}>Recently Viewed</Text>
                          <TouchableOpacity
                            onPress={handleClearRecentViews}
                            style={styles.clearButton}
                          >
                            <Text style={styles.clearButtonText}>X</Text>
                          </TouchableOpacity>
                        </View>
                        <FlatList
                          data={recentViews}
                          keyExtractor={(item) => item.id.toString()}
                          renderItem={renderRestaurantItem}
                        />
                      </>
                    )}

                  </>
                ) : (
                  <Text style={styles.sectionTitle}>Start typing to search for restaurants or food items...</Text>
                )
              }
              <Text style={styles.results}>Search Results</Text>
              {filteredFood.length > 0 ?
                <>
                  <Text style={styles.subTitle}>Menu Items</Text>
                  <FlatList
                    data={filteredFood}
                    renderItem={renderFoodItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    numColumns={1}
                  />
                </>
                :
                <></>}

              {filteredRestaurants.length > 0 ?
                <>
                  <Text style={styles.subTitle}>Restaurants</Text>
                  <FlatList
                    data={filteredRestaurants}
                    renderItem={renderRestaurantItem}
                    keyExtractor={(item) => item.id}
                    // onEndReached={loadMoreRestaurants}
                    onEndReachedThreshold={0.5}

                  />
                </>
                : <></>}

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
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9', marginBottom: 70 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 20 },
  searchIcon: { marginRight: 8, },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, padding: 10 },
  filterImage: {
    width: 20,
    height: 20,
    // marginLeft: 10,
  },
  results: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10
  },
  recentSearchContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  searchTag: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 20, fontSize: 14, backgroundColor: '#f1f1f1' },

  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginVertical: 10
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
    height: 155,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 120,  // Reduced height for a shorter card
  },
  popularSearchCard: {
    borderColor: "#00D0DD",
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    margin: 10,
    alignItems: 'center'
  },
  recentHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  recentSearchText: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10
  },
  clearButton: {
    // backgroundColor: 'red',
    padding: 5,

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
    marginTop: 20,
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
    justifyContent: 'flex-end'
  },
  loc: {
    fontSize: 16,

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

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import foodrestro from '../../assets/foodrestro.png';
import Restro from "../../assets/Restro.png";
import Footer from './Footer';
import apiClient, { MEDIA_BASE_URL } from '../../src/api/apiClient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useAuthStore from '../../useAuthStore';
import { calculateDistanceFromUser } from '../../src/utils/distanceUtils';


const { width } = Dimensions.get('window');


const popularSearches = [
  { id: '1', name: 'Top Rated', image: require('../../assets/star.png') },
  { id: '2', name: 'Best Cuisines', image: require('../../assets/cusines.png') },
];

// const recentSearches = ['Mexican Food', 'Italian', 'Birmingham'];

const Search = () => {
  const router = useRouter()
  const { searchTerm: initialSearchTerm } = useLocalSearchParams();
  const [recentViews, setRecentViews] = useState([]);
  const [foodPage, setFoodPage] = useState(1);
  const [loadingFood, setLoadingFood] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const [restaurants, setRestaurants] = useState([]); // Stores the list of restaurants
  const [restaurantPage, setRestaurantPage] = useState(1); // Tracks current page
  const [hasMoreRestaurants, setHasMoreRestaurants] = useState(true); // Tracks if more data is available
  const [loadingRestaurants, setLoadingRestaurants] = useState(true); // Prevents duplicate API calls
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [hasMoreMenuItems, setHasMoreMenuItems] = useState(true); // Tracks if more data is available
  const [restaurantPageMenuItem, setRestaurantPageMenuItem] = useState(1);
  const { user, isAuthenticated, latitude, longitude } = useAuthStore();
  const [error, setError] = useState(null);
  const [ErrorMenuItem, setErrorMenuItem] = useState(null);
  const [distance, setDistance] = useState(null); // State to hold the calculated distance

  // const hardcodedCoordinates = {
  //   latitude: 51.479342,
  //   longitude: -0.298706,
  // };
  //   // Function to fetch coordinates using a geocoding service (like Google Geocoding API)
  //   // const getCoordinatesFromAddress = async (address) => {
  //   // const API_KEY = 'AIzaSyDFQTSshpxEzndpEMEIDi_8f7OUGyh-Hs8';
  //   // const response = await axios.get(
  //   //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  //   // );

  //   // const location = response.data.results[0]?.geometry?.location;
  //   // if (location) {
  //   //   return {
  //   //     latitude: location.lat,
  //   //     longitude: location.lng,
  //   //   };
  //   // } 
  //   //   else {
  //   //     return null; // Return null if geocoding fails
  //   //   }
  //   // };

  //   const calculateDistance = (lat1, lon1, lat2, lon2) => {
  //     const toRad = (value) => (value * Math.PI) / 180;
  //     const R = 6371; // Earth's radius in km

  //     const dLat = toRad(lat2 - lat1);
  //     const dLon = toRad(lon2 - lon1);
  //     const a =
  //       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
  //       Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //     return R * c; // Distance in km
  //   };

  //   useEffect(() => {
  //   // Ensure that the user and restaurant locations are available before calculating distance
  //   if (latitude && longitude) {
  //     const dist = calculateDistance(
  //       latitude,
  //       longitude,
  //       hardcodedCoordinates.latitude,
  //       hardcodedCoordinates.longitude
  //     );
  //     setDistance(dist.toFixed(2)); // Round the distance to 2 decimal places
  //   }
  // }, [latitude, longitude]);


  // Handle load more for restaurants (pagination)
  const handleLoadMore = () => {
    if (hasMoreRestaurants && !loadingRestaurants && searchTerm == "") {
      fetchRestaurants(restaurantPage + 1); // Fetch the next page for restaurants
    }
  };

  // Fetch menu items API
  const fetchMenuItem = async (newPage = 1, cuisine) => {
    try {
      let url = `/menu-items?pagination[page]=${newPage}&pagination[pageSize]=50&populate=*`;
      if (cuisine) {
        // If cuisine is neither "Price: high to low" nor "Price: low to high", filter by cuisine type
        if (cuisine !== "Price: high to low" && cuisine !== "Price: low to high") {
          url += `&filters[cuisine][cuisine_type][$contains]=${encodeURIComponent(cuisine)}`;
        }
        // If cuisine is "Price: high to low", sort by price: high to low
        else if (cuisine === "Price: high to low") {
          url += `&sort=price:desc`;
        }
        // If cuisine is "Price: low to high", sort by price: low to high
        else if (cuisine === "Price: low to high") {
          url += `&sort=price:asc`;
        }
      }

      const response = await apiClient.get(url);
      const newMenuItems = response?.data?.data || [];

      // Update the restaurants state with new API data
      if (newMenuItems && newMenuItems.length > 0) {
        // If results are found, update products and page state
        setMenuItems(prevFoodItem => (newPage === 1 ? newMenuItems : [...prevFoodItem, ...newMenuItems]));
        // Update pagination and control states
        setRestaurantPageMenuItem(newPage);
        setHasMoreMenuItems(newMenuItems.length > 0);
      } else {
        // If no products match, clear the list and set hasMore to false
        if (newPage === 1) setMenuItems([]);
        setHasMoreMenuItems(false); // No more products to load

      }
      setLoadingFood(false);
      if (newMenuItems.length == 0) {
        setErrorMenuItem("No menu item found");
      } else {
        setErrorMenuItem(null);
      }
      setSelectedSortOption(null);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setHasMoreMenuItems(false); // Stop further calls on error
    } finally {
      setLoadingFood(false);
    }
  };


  const fetchRestaurants = async (newPage = 1, topRated = false) => {
    if (loadingRestaurants || !hasMoreRestaurants) return;
    setLoadingRestaurants(true);
    try {
      // Build the API URL
      let url = `/restaurants?pagination[page]=${newPage}&pagination[pageSize]=10&populate=image`;
      if (topRated) {
        url += `&filters[rating][$gte]=4`;  // Add a filter for rating greater than or equal to 4
      }

      // Fetch data from the API
      const response = await apiClient.get(url);
      const newRestaurants = response?.data?.data || [];
      const isFavorite = newRestaurants?.favourites?.includes(user?.id); // Check if the current user has favorited this restaurant

      // Update the restaurants state with new API data
      if (newRestaurants && newRestaurants.length > 0) {
        // If results are found, update products and page state
        setRestaurants(prevResto => (newPage === 1 ? newRestaurants : [...prevResto, ...newRestaurants]));
        // Update pagination and control states
        setRestaurantPage(newPage);
        setHasMoreRestaurants(newRestaurants.length > 0);
      } else {
        // If no products match, clear the list and set hasMore to false
        if (newPage === 1) setRestaurants([]);
        setHasMoreRestaurants(false); // No more products to load
      }
      setErrorMenuItem(null);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setHasMoreRestaurants(false);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchResults = async (query) => {
    setLoadingRestaurants(true);
    setError(null);

    try {
      const encodedQuery = query ? encodeURIComponent(query) : '';

      // API 1: Restaurants
      let url1 = `/restaurants?pagination[page]=1&pagination[pageSize]=10&populate=image`;
      if (query) {
        url1 += `&filters[$or][0][name][$contains]=${encodedQuery}&filters[$or][1][location][$contains]=${encodedQuery}`;
      }

      // API 2: Menu Items
      let url2 = `/menu-items?pagination[page]=1&pagination[pageSize]=50&populate=*`;
      if (query) {
        url2 += `&filters[item_name][$contains]=${encodedQuery}`;
      }

      const [api1, api2] = await Promise.all([
        apiClient.get(url1),
        apiClient.get(url2),
      ]);

      // Process and filter results
      const restaurantResults = api1.data.data.map((item) => ({
        ...item,
        source: 'Restaurant',
      }));

      const menuItemResults = api2.data.data.map((item) => ({
        ...item,
        source: 'Menu Item',
      }));


      // Update state
      setRestaurants(restaurantResults);
      setMenuItems(menuItemResults);
      setErrorMenuItem(null);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const handleSearch = debounce((text) => {
    if (text.length > 3) {
      fetchResults(text);

      //Update recent searches if the search term is new
      if (searchTerm && !recentSearches.includes(searchTerm)) {
        setRecentSearches([searchTerm, ...recentSearches].slice(0, 5)); // Limit to last 5 searches
      }
    } else {
      fetchResults('');
    }
  }, 500);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  const applyFilters = () => {
    setFilterVisible(false);
  };

  const handleSortOptionPress = (option) => {
    setSelectedSortOption(option);
    console.log(option)
    if (option !== "nearest to farthest" || option !== "farthest to nearest") {
      fetchMenuItem(1, option);
    } else {
      fetchResults(option)
    }
  };

  const getSortOptionStyle = (option) => {
    return option === selectedSortOption
      ? { backgroundColor: '#00D0DD', color: 'white' }
      : {};
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]); // Clear recent searches
    fetchResults(); // Default fetch for restaurants
  };

  const handleClearRecentViews = () => {
    setRecentViews([]); // Clear recent views
  };

  const handlePopularSearch = (search) => {
    fetchRestaurants(1, search)
  };

  const handleViewRestaurant = (restaurant) => {
    const imageUrl =
      (restaurant.image && restaurant.image[0]?.url)
        ? `${MEDIA_BASE_URL}${restaurant.image[0].url}`
        : Restro;

    router.push({
      pathname: "pages/RestaurantScreen",
      params: {
        id: restaurant.id,
        documentId: restaurant.documentId,
      },
    })
    setRecentViews((prevViews) => {
      // Check if restaurant is already in recent views
      const alreadyViewed = prevViews.find((item) => item.id === restaurant.id);
      if (alreadyViewed) {
        // Move it to the top of the list
        return [restaurant, ...prevViews.filter((item) => item.id !== restaurant.id)];
      }
      // Add the new restaurant to the top of the list
      return [restaurant, ...prevViews].slice(0, 5); // Limit to 5 recent views
    });
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={foodrestro} style={styles.image} />
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>
          {item.is_vegetarian ? "🥬" : "🍖"}
        </Text>
        <Text style={styles.reviewText}>
          {item.is_available ? "Available" : "Unavailable"}
        </Text>
        {/* <Text style={styles.ratingText}>{item.rating} ⭐</Text>
        <Text style={styles.reviewText}>({item.reviews}+)</Text> */}
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>
          {item.item_name.length > 15
            ? `${item.item_name.substring(0, 15)}...`
            : item.item_name}
        </Text>
      </View>
    </View>
  );

  // const renderRestaurantItem = ({ item }) => {

  //   useEffect(() => {
  //     const fetchDistanceToRestaurant = async () => {
  //       if (latitude && longitude && item.location) {
  //         const dist = await calculateDistanceFromUser(
  //           { latitude, longitude },
  //           item.location
  //         );
  //         if (dist) setDistance(dist); // Round distance to 2 decimal places
  //       }
  //     };
  //     fetchDistanceToRestaurant();
  //   }, [latitude, longitude, item.location]);

  //   return (
  //     <TouchableOpacity onPress={() => handleViewRestaurant(item)}>
  //       <View style={styles.cardContainer}>
  //         <View style={styles.card1}>
  //           <Image source={Restro} style={styles.image1} />
  //           {/* <View style={styles.iconContainer1}>
  //           <TouchableOpacity style={styles.heart1} onPress={handleFavoritePress}>
  //             <Ionicons 
  //             name={isFavorite ? "heart" : "heart-outline"}
  //             size={20}
  //             color={isFavorite ? "red" : "white"}
  //             style={styles.icon1} />
  //           </TouchableOpacity>
  //           <TouchableOpacity style={styles.heart1}
  //             onPress={() => router.push("pages/Chat")}
  //           >
  //             <Ionicons name="chatbubble-outline" size={20} color="white" style={styles.icon1} />
  //           </TouchableOpacity>
  //         </View> */}
  //           <View style={styles.ratingContainer1}>
  //             <Text style={styles.ratingText1}>{item?.rating} ⭐</Text>
  //             <Text style={styles.reviewText1}>({item?.reviews}+)</Text>
  //           </View>
  //           <View style={styles.detailsContainer1}>
  //             <Text style={styles.name1}>
  //               {item.name.length > 30
  //                 ? `${item.name.substring(0, 30)}...`
  //                 : item.name}
  //             </Text>
  //             <View style={styles.categories1}>
  //               <Text style={styles.loc}>{item.location}</Text>
  //               {distance && <Text style={styles.distanceText}>{distance} km away</Text>}
  //             </View>
  //           </View>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // }

  const RestaurantCard = ({ item, latitude, longitude }) => {
    const [distance, setDistance] = useState(null);

    useEffect(() => {
      const fetchDistanceToRestaurant = async () => {
        if (latitude && longitude && item.location) {
          const dist = await calculateDistanceFromUser(item.location); // Uses the utility function
          if (dist) setDistance(dist); // Distance is automatically rounded in the utility function
        }
      };
      fetchDistanceToRestaurant();
    }, [latitude, longitude, item.location]);

    const goToRestaurantScreen = () => {
      router.push({
        pathname: "pages/RestaurantScreen",
        params: {
          id: item.documentId,
          documentId: item.documentId,
        },
      })
    };

    return (
      <TouchableOpacity onPress={goToRestaurantScreen}>
        <View style={styles.cardContainer}>
          <View style={styles.card1}>
            <Image source={Restro} style={styles.image1} />
            <View style={styles.ratingContainer1}>
              <Text style={styles.ratingText1}>{item?.rating} ⭐</Text>
              <Text style={styles.reviewText1}>({item?.reviews}+)</Text>
            </View>
            <View style={styles.detailsContainer1}>
              <Text style={styles.name1}>
                {item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name}
              </Text>
              <View style={styles.categories1}>
                <Text style={styles.loc}>{item.location}</Text>
                {distance && <Text style={styles.distanceText}>{distance} km away</Text>}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Find food or restaurant..."
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="options" size={26} color="#00D0DD" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      </View>

      {searchTerm.length === 0 && recentSearches.length > 0 && (
        <View>
          <View style={styles.suggestionsContainer}>
            <Text style={styles.searchHistoryTitle}>Search history</Text>
            <TouchableOpacity onPress={handleClearRecentSearches}
              style={styles.deleteIconContainer}
            >
              <Ionicons
                name="trash-outline" // or "trash" if you want a filled trash icon
                size={18}
                color="black"
                style={styles.heartIcon}
              />

            </TouchableOpacity>
          </View>

          <View style={styles.searchHistoryList}>
            {recentSearches.map((item, index) => (
              <TouchableOpacity
                key={`${item}-${index}`} // Combine item and index to ensure uniqueness
                onPress={() => {
                  handleSearch(item);
                }}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      )}

      {/* <View>
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
      </View> */}

      <View style={{ alignItems: 'center', marginTop: 10 }}>
        {menuItems?.length === 0 && restaurants?.length === 0 && !loadingRestaurants ? (
          <Text style={{ color: 'red', fontSize: 20 }}>No Menu and Restaurants found</Text>
        ) : null}
      </View>
      {ErrorMenuItem && (
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: 'red', fontSize: 20 }}>{ErrorMenuItem}</Text>
        </View>
      )}
      {menuItems?.length > 0 && (
        <View style={{ height: 220, marginTop: 10 }}>
          <>
            <Text style={styles.subTitle}>Menu Items</Text>
            <FlatList
              data={menuItems}
              renderItem={renderFoodItem}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              numColumns={1}
            // ListFooterComponent={
            //   loadingFood ? (
            //     <ActivityIndicator size="small" color="#0000ff" />
            //   ) : null
            // }
            />
          </>
        </View>
      )}

      {restaurants?.length > 0 && (
        <>
          <Text style={[styles.subTitle, { marginTop: 15 }]}>Restaurants</Text>
          <FlatList
            data={restaurants}
            renderItem={({ item }) => (
              <RestaurantCard
                item={item}
                latitude={latitude}
                longitude={longitude}
                handleViewRestaurant={handleViewRestaurant}
              />
            )}
            horizontal={false}
            numColumns={1}
            showsHorizontalScrollIndicator={false} // Horizontal scrolling is not needed for vertical lists
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingRestaurants ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : null
            }
          />
        </>
      )}

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
              {['Price: low to high', 'Price: high to low', 'Location: nearest to farthest', 'Location: farthest to nearest'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionButton, getSortOptionStyle(option)]}
                  onPress={() => {
                    handleSortOptionPress(option);
                    setFilterVisible(false);
                  }}
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
                  onPress={() => {
                    handleSortOptionPress(cuisine);
                    setFilterVisible(false);  // Close filter options after selection
                  }}
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

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: { flex: 1 },
  scrollContent: {
    paddingLeft: 16, // Add padding around the content
    marginBottom: 50,
  },
  searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 20 },
  searchIcon: { marginRight: 8, },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, padding: 10 },
  filterImage: {
    width: 20,
    height: 20,
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
    paddingLeft: 10,

  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: width * 0.4,
    marginHorizontal: 8,

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
  recentsearchTerm: {
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
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 95,
    left: 6,
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderColor: "gray",
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
    marginTop: 5,
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
    width: width - 20, // Full screen width for a single card
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    height: 270,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
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
    marginBottom: 14,
  },
  categories1: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  loc: {
    fontSize: 16,
    width: '65%',
    display: 'flex',
    flexWrap: 'wrap'
  },
  distanceText: {
    textAlign: 'right'
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
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, paddingLeft: 10 },
  sortOptions: { flexDirection: 'column', flexWrap: 'wrap', marginVertical: 8 },
  cusinesOptions: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10, },
  optionButton: { padding: 8, borderWidth: 1, borderColor: '#00D0DD', borderRadius: 20, margin: 4, },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 16 },
  cancelButton: { padding: 12, paddingHorizontal: 40, backgroundColor: '#fff', borderRadius: 8 },
  applyButton: { paddingVertical: 12, paddingHorizontal: 40, backgroundColor: '#00D0DD', borderRadius: 8 },
  cancelText: { color: '#00D0DD' },
  applyText: { color: '#fff' },
  suggestionsContainer: {
    marginTop: -10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchHistoryTitle: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.10,

  },

  searchHistoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
    letterSpacing: -0.17000000178813934,
    textAlign: "center",
    backgroundColor: '#FFF',
    paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5,
    borderRadius: 10
  },
});

export default Search;

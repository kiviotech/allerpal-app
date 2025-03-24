import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import foodrestro from '../../assets/foodrestro.png';
import Restro from "../../assets/Restro.png";
import Footer from './Footer';
import apiClient, { MEDIA_BASE_URL } from '../../src/api/apiClient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useAuthStore from '../../useAuthStore';
import { calculateDistanceFromUser, calculateDistanceFromLocation, filterRestaurantsByDistance, sortRestaurantsByDistance, parseLocationString } from '../../src/utils/distanceUtils';
import { geocodeAddress, getLocationSuggestions, getPlaceDetails } from '../../src/utils/geocodingUtils';
import Slider from '@react-native-community/slider';

// Add debounce function implementation
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const { width } = Dimensions.get('window');

const popularSearches = [
  { id: '1', name: 'Top Rated', image: require('../../assets/star.png') },
  { id: '2', name: 'Best Cuisines', image: require('../../assets/cusines.png') },
];

const Search = () => {
  const router = useRouter()
  const { searchTerm: initialSearchTerm } = useLocalSearchParams();
  const [recentViews, setRecentViews] = useState([]);
  const [foodPage, setFoodPage] = useState(1);
  const [loadingFood, setLoadingFood] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantPage, setRestaurantPage] = useState(1);
  const [hasMoreRestaurants, setHasMoreRestaurants] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [hasMoreMenuItems, setHasMoreMenuItems] = useState(true);
  const [restaurantPageMenuItem, setRestaurantPageMenuItem] = useState(1);
  const { user, isAuthenticated, latitude, longitude } = useAuthStore();
  const [error, setError] = useState(null);
  const [ErrorMenuItem, setErrorMenuItem] = useState(null);
  const [errorRestaurants, setErrorRestaurants] = useState(null);
  const [distance, setDistance] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [popularSearchedRestaurants, setPopularSearchedRestaurants] = useState([]);

  // New state for location search and filtering
  const [isLocationSearch, setIsLocationSearch] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [maxDistanceFilter, setMaxDistanceFilter] = useState(10); // Default to 10km
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Toggle between restaurant search and location search
  const toggleSearchMode = () => {
    setIsLocationSearch(!isLocationSearch);
    setSearchTerm("");
    setLocationSearchTerm("");
    setShowLocationSuggestions(false);
    setSelectedLocation(null);
    // Always show all restaurants when switching modes
    fetchRestaurants(1);
  };

  // Function to fetch location suggestions as user types
  const fetchLocationSuggestions = async (query) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }
    
    setLoadingLocations(true);
    try {
      console.log('Fetching location suggestions for:', query);
      const suggestions = await getLocationSuggestions(query);
      console.log('Got suggestions:', suggestions);
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setLocationSuggestions([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  // Handle selecting a location from suggestions
  const handleSelectLocation = async (location) => {
    setLocationSearchTerm(location.description);
    setShowLocationSuggestions(false); // Hide the dropdown immediately when a location is selected
    
    try {
      const placeDetails = await getPlaceDetails(location.place_id);
      if (placeDetails) {
        setSelectedLocation(placeDetails);
        fetchRestaurantsNearLocation(placeDetails, 1);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    }
  };

  // Update location suggestions as user types
  useEffect(() => {
    if (isLocationSearch && locationSearchTerm) {
      debouncedLocationSearch(locationSearchTerm);
    }
  }, [locationSearchTerm, isLocationSearch]);

  // Fetch restaurants near a specific location
  const fetchRestaurantsNearLocation = async (location, newPage = 1) => {
    if (loadingRestaurants) return;
    setLoadingRestaurants(true);

    try {
      // If location is a string (address), geocode it first
      let locationCoords = location;
      if (typeof location === 'string') {
        const geocodedLocation = await geocodeAddress(location);
        if (!geocodedLocation) {
          throw new Error('Could not geocode the address');
        }
        locationCoords = geocodedLocation;
      }

      // Fetch all restaurants first
      const response = await apiClient.get(
        `/restaurants?pagination[page]=${newPage}&pagination[pageSize]=50&populate=image`
      );
      
      const allRestaurants = response?.data?.data || [];
      
      // Filter restaurants by distance from selected location
      const nearbyRestaurants = await Promise.all(
        allRestaurants.map(async (restaurant) => {
          if (!restaurant.location) return null;
          
          // Parse restaurant coordinates
          const restaurantCoords = await parseLocationString(restaurant.location);
          if (!restaurantCoords) return null;
          
          // Calculate distance between selected location and restaurant
          const distanceInKm = calculateDistanceFromLocation(
            locationCoords,
            restaurantCoords
          );
          
          // Add distance to restaurant object for display
          restaurant.distanceFromSelected = distanceInKm;
          
          // Filter by max distance
          return parseFloat(distanceInKm) <= maxDistanceFilter ? restaurant : null;
        })
      );
      
      // Filter out null values and sort by distance
      const validRestaurants = nearbyRestaurants.filter(Boolean);
      const sortedRestaurants = validRestaurants.sort((a, b) => 
        parseFloat(a.distanceFromSelected) - parseFloat(b.distanceFromSelected)
      );
      
      setRestaurants(sortedRestaurants);
      setHasMoreRestaurants(false); // We're loading all at once for now
      setErrorRestaurants(null);
    } catch (err) {
      console.error("Error fetching restaurants near location:", err);
      setErrorRestaurants("Failed to fetch restaurants near this location");
    } finally {
      setLoadingRestaurants(false);
    }
  };

  // Effect to update restaurant list when maxDistanceFilter changes
  useEffect(() => {
    if (selectedLocation) {
      fetchRestaurantsNearLocation(selectedLocation, 1);
    }
  }, [maxDistanceFilter]);

  // Debounce for location search
  const debouncedLocationSearch = useCallback(
    debounce((query) => {
      fetchLocationSuggestions(query);
    }, 500),
    []
  );

  // Handle load more for restaurants (pagination)
  const handleLoadMore = () => {
    if (hasMoreRestaurants && !loadingRestaurants && searchTerm == "") {
      fetchRestaurants(restaurantPage + 1); // Fetch the next page for restaurants
    }
  };

  // Fetch menu items API
  // const fetchMenuItem = async (newPage = 1, cuisine) => {
  //   try {
  //     let url = `/menu-items?pagination[page]=${newPage}&pagination[pageSize]=50&populate=*`;
  //     if (cuisine) {
  //       // If cuisine is neither "Price: high to low" nor "Price: low to high", filter by cuisine type
  //       if (cuisine !== "Price: high to low" && cuisine !== "Price: low to high") {
  //         url += `&filters[cuisine][cuisine_type][$contains]=${encodeURIComponent(cuisine)}`;
  //       }
  //       // If cuisine is "Price: high to low", sort by price: high to low
  //       else if (cuisine === "Price: high to low") {
  //         url += `&sort=price:desc`;
  //       }
  //       // If cuisine is "Price: low to high", sort by price: low to high
  //       else if (cuisine === "Price: low to high") {
  //         url += `&sort=price:asc`;
  //       }
  //     }

  //     const response = await apiClient.get(url);
  //     const newMenuItems = response?.data?.data || [];

  //     // Update the restaurants state with new API data
  //     if (newMenuItems && newMenuItems.length > 0) {
  //       // If results are found, update products and page state
  //       setMenuItems(prevFoodItem => (newPage === 1 ? newMenuItems : [...prevFoodItem, ...newMenuItems]));
  //       // Update pagination and control states
  //       setRestaurantPageMenuItem(newPage);
  //       setHasMoreMenuItems(newMenuItems.length > 0);
  //     } else {
  //       // If no products match, clear the list and set hasMore to false
  //       if (newPage === 1) setMenuItems([]);
  //       setHasMoreMenuItems(false); // No more products to load

  //     }
  //     setLoadingFood(false);
  //     if (newMenuItems.length == 0) {
  //       setErrorMenuItem("No menu item found");
  //     } else {
  //       setErrorMenuItem(null);
  //     }
  //     setSelectedSortOption(null);
  //   } catch (err) {
  //     console.error("Error fetching menu items:", err);
  //     setHasMoreMenuItems(false); // Stop further calls on error
  //   } finally {
  //     setLoadingFood(false);
  //   }
  // };

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
      const sortedRestaurants = newRestaurants.sort((a, b) => b.rating - a.rating);

      // Update the restaurants state with new API data
      if (newRestaurants && newRestaurants.length > 0) {
        // If results are found, update products and page state
        setRestaurants(prevResto => (newPage === 1 ? newRestaurants : [...prevResto, ...newRestaurants]));
        // Update pagination and control states
        setRestaurantPage(newPage);
        setPopularSearchedRestaurants(sortedRestaurants);
        setHasMoreRestaurants(newRestaurants.length > 0);
      } else {
        // If no products match, clear the list and set hasMore to false
        if (newPage === 1) setRestaurants([]);
        setHasMoreRestaurants(false); // No more products to load
      }
      setErrorRestaurants(null);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setHasMoreRestaurants(false);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const fetchResults = async (query) => {
    setLoadingRestaurants(true);
    setError(null);

    try {
      const encodedQuery = query ? encodeURIComponent(query) : '';

      // Initialize URL with pagination and populate image
      let url = `/restaurants?pagination[page]=1&pagination[pageSize]=10&populate=image`;

      // Add search filter for restaurant name
      if (query) {
        url += `&filters[name][$contains]=${encodedQuery}`;
      }

      // Add filters for reviews and location if sort option is selected
      if (selectedSortOption === 'Reviews: low to high') {
        url += `&filters[rating][$gte]=1&filters[rating][$lte]=5`;
      } else if (selectedSortOption === 'Reviews: high to low') {
        url += `&filters[rating][$gte]=4`;
      } else if (selectedSortOption === 'Location: nearest to farthest') {
        url += `&filters[location][$contains]=${encodedQuery}`;
      } else if (selectedSortOption === 'Location: farthest to nearest') {
        url += `&filters[location][$contains]=${encodedQuery}`;
      }

      // API Request for restaurants
      const response = await apiClient.get(url);
      const restaurantResults = response.data.data.map((item) => ({
        ...item,
        source: 'Restaurant',
      }));

      // Sort results if needed
      if (selectedSortOption === 'Reviews: low to high') {
        restaurantResults.sort((a, b) => a.rating - b.rating);
      } else if (selectedSortOption === 'Reviews: high to low') {
        restaurantResults.sort((a, b) => b.rating - a.rating);
      }

      setRestaurants(restaurantResults);

    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoadingRestaurants(false);
    }
  };

  // Update the handleSearch function to handle different search modes
  const handleSearch = debounce((text) => {
    if (isLocationSearch) {
      // Only fetch location suggestions when in location search mode
      if (text.length >= 3) {
        fetchLocationSuggestions(text);
      } else {
        setLocationSuggestions([]);
      }
    } else {
      // Regular restaurant search
      if (text.length >= 3) {
        fetchResults(text);
        //Update recent searches if the search term is new
        if (text && !recentSearches.includes(text)) {
          setRecentSearches([text, ...recentSearches].slice(0, 5));
        }
      } else {
        fetchResults('');
      }
    }
  }, 500);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  // Update the applyFilters function
  const applyFilters = () => {
    // If no filters are selected, show all restaurants
    if (!selectedSortOption && !selectedLocation) {
      fetchRestaurants(1);
      setFilterVisible(false);
      return;
    }
    
    // Apply sort filter if selected
    if (selectedSortOption) {
      if (isLocationSearch && selectedLocation) {
        // If in location mode and location is selected, use location-based search
        fetchRestaurantsNearLocation(selectedLocation, 1);
      } else {
        // Otherwise use regular search
        fetchResults(searchTerm);
      }
    }
    
    // Apply location filter if selected
    if (selectedLocation && isLocationSearch) {
      fetchRestaurantsNearLocation(selectedLocation, 1);
    }
    
    setFilterVisible(false);
  };

  // Update the handleSortOptionPress function
  const handleSortOptionPress = (option) => {
    // If clicking the same option, remove the filter
    if (option === selectedSortOption) {
      setSelectedSortOption(null);
      if (isLocationSearch && selectedLocation) {
        fetchRestaurantsNearLocation(selectedLocation, 1);
      } else {
        fetchRestaurants(1);
      }
    } else {
      setSelectedSortOption(option);
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

  const RestaurantCard = ({ item, latitude, longitude }) => {
    const [distance, setDistance] = useState(null);
    
    useEffect(() => {
      const fetchDistanceToRestaurant = async () => {
        if (item.distanceFromSelected) {
          setDistance(item.distanceFromSelected);
          return;
        }
        
        if (latitude && longitude && item.location) {
          try {
            const restaurantCoords = parseLocationString(item.location);
            if (restaurantCoords) {
              const dist = await calculateDistanceFromUser(restaurantCoords);
              if (dist) setDistance(dist);
            }
          } catch (error) {
            console.error('Error calculating distance:', error);
          }
        }
      };
      
      fetchDistanceToRestaurant();
    }, [latitude, longitude, item.location, item.distanceFromSelected]);

    const goToRestaurantScreen = () => {
      // Ensure we have the correct ID before navigation
      if (!item.id) {
        console.error('Restaurant ID is missing');
        return;
      }
      
      router.push({
        pathname: "pages/RestaurantScreen",
        params: {
          id: item.id,
          documentId: item.id, // Use the same ID for both
        },
      });
    };

    const imageUrl =
      (item?.image && item?.image[0]?.url)
        ? `${MEDIA_BASE_URL}${item?.image[0].url}`
        : Restro;

    return (
      <TouchableOpacity onPress={goToRestaurantScreen}>
        <View style={styles.cardContainer}>
          <View style={styles.card1}>
            <Image source={imageUrl} style={styles.image1} />
            <View style={styles.ratingContainer1}>
              <Text style={styles.ratingText1}>{item?.rating} ⭐</Text>
              <Text style={styles.reviewText1}>({item?.reviews}+)</Text>
            </View>
            <View style={styles.detailsContainer1}>
              <Text style={styles.name1}>
                {item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name}
              </Text>
              <View style={styles.categories1}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', maxWidth: '55%',}}>
                  <Ionicons name='location' size={20} color='#00D0DD' />
                  <Text style={styles.loc}>{item.location}</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center',}}>
                  <Ionicons name='walk' size={20} color='#00D0DD' />
                  {distance && (
                    <Text style={styles.distanceText}>
                      {distance} km {item.distanceFromSelected ? 'from location' : 'away'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Add a new function to handle outside clicks
  const handleOutsideClick = () => {
    if (showLocationSuggestions) {
      setShowLocationSuggestions(false);
    }
  };

  // Update the back handler function
  const handleBackPress = () => {
    // Simply navigate to home as a fallback
    router.push('/pages/Home');
  };

  return (
    <SafeAreaView style={styles.AreaContainer} onTouchStart={handleOutsideClick}>

      {/* <View style={styles.menu}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}>
        <Ionicons name="menu-sharp" size={24} color="black" />
      </TouchableOpacity>
      </View> */}

      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons 
            name="arrow-back" 
            size={26} 
            style={styles.searchIcon} 
          />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons 
            name={isLocationSearch ? "location" : "search"} 
            size={20} 
            color="#888" 
            style={styles.searchIcon} 
          />
          <TextInput
            placeholder={isLocationSearch ? "Search for a location..." : "Find food or restaurant..."}
            style={styles.searchInput}
            value={isLocationSearch ? locationSearchTerm : searchTerm}
            onChangeText={isLocationSearch ? setLocationSearchTerm : setSearchTerm}
            onFocus={() => {
              if (isLocationSearch && locationSearchTerm.length >= 3) {
                setShowLocationSuggestions(true);
              }
            }}
          />
          <TouchableOpacity onPress={toggleSearchMode} style={styles.searchModeToggle}>
            <Ionicons 
              name={isLocationSearch ? "restaurant" : "location"} 
              size={20} 
              color="#00D0DD" 
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="options" size={26} color="#00D0DD" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      </View>

      {/* {sidebarVisible && <Sidebar isVisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />} */}

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

      {/* 
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
      )} */}

      {/* Location suggestions */}
      {isLocationSearch && showLocationSuggestions && locationSuggestions.length > 0 && (
        <View style={styles.suggestionsDropdown} onTouchStart={(e) => e.stopPropagation()}>
          {loadingLocations ? (
            <ActivityIndicator size="small" color="#00D0DD" />
          ) : (
            <FlatList
              data={locationSuggestions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.suggestionItem} 
                  onPress={() => handleSelectLocation(item)}
                >
                  <Ionicons name="location-outline" size={18} color="#00D0DD" style={styles.suggestionIcon} />
                  <Text style={styles.suggestionText}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {/* Selected location indicator */}
      {selectedLocation && (
        <View style={styles.selectedLocationContainer}>
          <Ionicons name="location" size={18} color="#00D0DD" />
          <Text style={styles.selectedLocationText}>
            Showing restaurants near {selectedLocation.formattedAddress}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              setSelectedLocation(null);
              setLocationSearchTerm("");
              fetchRestaurants(1);
            }}
            style={styles.clearLocationButton}
          >
            <Ionicons name="close-circle" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {restaurants?.length > 0 ? (
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
            keyExtractor={(item) => item.id.toString()}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingRestaurants ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : null
            }
          />
        </>
      ) : (
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text style={{ color: "red", fontSize: 20 }}>No restaurants found</Text>
        </View>
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

            {/* Distance filter (only show when a location is selected) */}
            {selectedLocation && (
              <View style={styles.distanceFilterContainer}>
                <Text style={styles.sectionTitle}>Distance</Text>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={50}
                    step={1}
                    value={maxDistanceFilter}
                    onValueChange={setMaxDistanceFilter}
                    minimumTrackTintColor="#00D0DD"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#00D0DD"
                  />
                  <View style={styles.sliderLabelsContainer}>
                    <Text style={styles.sliderValue}>1km</Text>
                    <Text style={styles.sliderValue}>{maxDistanceFilter}km</Text>
                    <Text style={styles.sliderValue}>50km</Text>
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>Sort by</Text>
            <View style={styles.sortOptions}>
              {['Reviews: low to high', 'Reviews: high to low', 'Location: nearest to farthest', 'Location: farthest to nearest'].map((option) => (
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

      {/* <Footer /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: { flex: 1 },
  scrollContent: {
    paddingLeft: 16, // Add padding around the content
    marginBottom: 50,
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10
  },
  menuButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  searchHeader: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#fff",
    margin: "auto",
    width: "80%",
  },
  searchIcon: { marginRight: 8, },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
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
    height: 290,
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
    // flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  loc: {
    fontSize: 16,
    // maxWidth: '55%',
    display: 'flex',
    flexWrap: 'wrap',
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
  searchModeToggle: {
    padding: 8,
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: 70,
    left: 40,
    right: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionIcon: {
    marginRight: 10,
  },
  selectedLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7f8',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  selectedLocationText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  clearLocationButton: {
    padding: 5,
  },
  distanceFilterContainer: {
    marginVertical: 16,
  },
  sliderContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  sliderValue: {
    fontSize: 12,
    color: '#666',
  },
});

export default Search;

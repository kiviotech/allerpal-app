// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Modal } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import foodrestro from '../../assets/foodrestro.png';
// import Restro from "../../assets/Restro.png";
// import Footer from './Footer';
// import { getAllRestaurants } from '../../src/api/repositories/restaurantRepositories';
// import { fetchAllMenuItems } from '../../src/services/menuItemsServices';
// import { MEDIA_BASE_URL } from '../../src/api/apiClient';
// import { useRouter } from 'expo-router';
// import { useSearchParams } from 'expo-router';
// import { saveToStorage } from '../../src/utils/storage';
// import { fetchAllCuisines } from '../../src/services/cuisineServices';

// const { width } = Dimensions.get('window');


// const popularSearches = [
//   { id: '1', name: 'Top Rated', image: require('../../assets/star.png') },
//   { id: '2', name: 'Best Cuisines', image: require('../../assets/cusines.png') },
// ];

// // const recentSearches = ['Mexican Food', 'Italian', 'Birmingham'];

// const Search = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredFood, setFilteredFood] = useState([]);
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [showInitial, setShowInitial] = useState(true);
//   const [filterVisible, setFilterVisible] = useState(false);
//   const [selectedSortOption, setSelectedSortOption] = useState(null);
//   const [recentViews, setRecentViews] = useState([]);
//   const [hasMoreRestaurants, setHasMoreRestaurants] = useState(true);
//   const [restaurantPage, setRestaurantPage] = useState(1);
//   const [loadingRestaurants, setLoadingRestaurants] = useState(false);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [cuisines, setCuisines] = useState([]);
//   const [filteredCuisines, setFilteredCuisines] = useState([]);
//   const router = useRouter()

//   // useEffect(() => {
//   //   if (cuisine_type) {
//   //     handleSearch(cuisine_type); // Automatically search using cuisine_type
//   //   }
//   // }, [cuisine_type]);

//   let uniqueCuisines = [];

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [menuResponse, restaurantResponse] = await Promise.all([
//           fetchAllMenuItems(),
//           getAllRestaurants({ page: 1, limit: 3 }),
//         ]);

//         // Handle Menu Items
//         if (menuResponse?.data) {
//           setMenuItems(menuResponse.data);
//           setFilteredFood(menuResponse.data);
//           setCuisines(menuResponse.data.map(item => item.cuisine))

//           uniqueCuisines = [...new Set(cuisines.map((type) => type.cuisine_type))];
//           // console.log('cuiiii', uniqueCuisines)
//           // const initialMenus = menuResponse?.data || [];
//         } else {
//           setMenuItems([]);
//           setFilteredFood([]);
//           setFilteredCuisines([]);
//         }

//         // Handle Restaurants
//         const initialRestaurants = restaurantResponse?.data?.data || [];
//         setRestaurants(initialRestaurants);
//         setFilteredRestaurants(initialRestaurants);
//         setHasMoreRestaurants(initialRestaurants.length > 0);
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         setMenuItems([]);
//         setFilteredFood([]);
//         setRestaurants([]);
//         setFilteredRestaurants([]);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Fetch more restaurants when user scrolls
//   const fetchRestaurants = useCallback(
//     async (page) => {
//       if (loadingRestaurants || !hasMoreRestaurants) return;

//       setLoadingRestaurants(true);
//       try {
//         const response = await getAllRestaurants({ page, limit: 2 });
//         const newRestaurants = response?.data?.data || [];
//         setRestaurants((prev) => (page === 1 ? newRestaurants : [...prev, ...newRestaurants]));
//         setFilteredRestaurants((prev) =>
//           page === 1 ? newRestaurants : [...prev, ...newRestaurants]
//         );
//         setHasMoreRestaurants(newRestaurants.length > 0); // Stop fetching if no data is returned
//         setRestaurantPage(page);
//       } catch (error) {
//         console.error("Error fetching restaurants:", error);
//       } finally {
//         setLoadingRestaurants(false);
//       }
//     },
//     [loadingRestaurants, hasMoreRestaurants]
//   );

//   useEffect(() => {
//     const fetchCuisine = async () => {
//       const CuisineResponse = await fetchAllCuisines();
//       console.log('resp', CuisineResponse.data)
//     }
//     fetchCuisine();
//   }, [])
//   // Infinite scroll handler with debounce
//   // Infinite scroll handler
//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - 200
//       ) {
//         fetchRestaurants(restaurantPage + 1); // Fetch next page on scroll
//       }
//     };

//     const debounceScroll = debounce(handleScroll, 200);

//     window.addEventListener("scroll", debounceScroll);
//     return () => window.removeEventListener("scroll", debounceScroll);
//   }, [restaurantPage, fetchRestaurants]);

//   // Debounce function to prevent rapid API calls
//   const debounce = (func, delay) => {
//     let timer;
//     return (...args) => {
//       clearTimeout(timer);
//       timer = setTimeout(() => func(...args), delay);
//     };
//   };

//   const applyFilters = () => {
//     setFilterVisible(false);
//     handleSortOptionPress(option)
//   };

//   const handleSortOptionPress = (option) => {
//     setSelectedSortOption(option);
//     handleSearch(option)
//   };

//   const getSortOptionStyle = (option) => {
//     return option === selectedSortOption
//       ? { backgroundColor: '#00D0DD', color: 'white' }
//       : {};
//   };

//   const handleSearch = (text) => {
//     setSearchTerm(text);
//     setShowInitial(false);
//     if (text.length < 3) {
//       setFilteredRestaurants([]);
//       setFilteredFood([]);
//       setFilteredCuisines([]);
//       return;
//     }
//     const searchText = text && typeof text === 'string' ? text.toLowerCase() : '';
//     const filteredRestaurantsList = restaurants.filter(
//       (restaurant) =>
//         restaurant.location.toLowerCase().includes(searchText) ||
//         restaurant.name.toLowerCase().includes(searchText)  
//     );
//     setFilteredRestaurants(filteredRestaurantsList);

//     const filteredFoodList = menuItems.filter((food) =>
//       food.item_name.toLowerCase().includes(searchText)
//     );
//     setFilteredFood(filteredFoodList);

//     const filteredCuisinesTypes = menuItems.filter((menuItem) =>
//       menuItem.cuisine.cuisine_type.toLowerCase().includes(searchText)
//     );
//     setFilteredFood(filteredCuisinesTypes);

//     const matchedSearches = [
//       ...new Set(
//         filteredRestaurantsList
//           .map((restaurant) => restaurant.name || restaurant.location)
//           .concat(filteredFoodList.map((food) => food.item_name))
//       ), // Merge restaurant and food names for recent searches
//     ];

//     setRecentSearches((prevSearches) => {
//       const updatedSearches = [...matchedSearches, ...prevSearches.filter((s) => s !== text)];
//       return updatedSearches.slice(0, 3); // Limit to 5
//     });
//   };

//   useEffect(() => {
//     saveToStorage('recentViews', recentViews);
//   }, [recentViews]);

//   useEffect(() => {
//     saveToStorage('recentSearches', recentSearches);
//   }, [recentSearches]);

//   const [liked, setLiked] = useState(false);

//   const handleHeartPress = () => {
//     setLiked(!liked);
//   };

//   const handleClearRecentSearches = () => {
//     setRecentSearches([]); // Clear recent searches
//   };

//   const handleClearRecentViews = () => {
//     setRecentViews([]); // Clear recent views
//   };

//   const handlePopularSearch = (search) => {
//     setSearchTerm(search);
//     handleSearch(search); // Trigger the search with the selected popular search
//   };

//   const handleViewRestaurant = (restaurant) => {
//     console.log('rest', restaurant)
//     const imageUrl =
//       restaurant.image && restaurant.image[0]?.url
//         ? `${MEDIA_BASE_URL}${restaurant.image[0].url}`
//         : Restro;

//     router.push({
//       pathname: "pages/RestaurantScreen",
//       params: {
//         id: restaurant.documentId,
//         documentId: restaurant.documentId,
//         name: restaurant.name,
//         rating: restaurant.rating,
//         categories: restaurant.categories,
//         image: imageUrl,
//       },
//     })
//     setRecentViews((prevViews) => {
//       const updatedViews = prevViews.filter((item) => item.id !== restaurant.id);
//       const newViews = [{ ...restaurant, image: imageUrl }, ...updatedViews];
//       return newViews.slice(0, 5); // Limit to 5
//     });
//   };


//   const renderFoodItem = ({ item }) => (
//     <View style={styles.card}>
//       <Image source={foodrestro} style={styles.image} />
//       <View style={styles.priceContainer}>
//         <Text style={styles.priceText}>{item.price}</Text>
//         <TouchableOpacity onPress={handleHeartPress} style={[styles.heartContainer, liked && styles.heartContainerLiked]}>
//           <Ionicons
//             name={liked ? "heart" : "heart-outline"}
//             size={18}
//             color='white'
//             style={styles.heartIcon}
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.ratingContainer}>
//         <Text style={styles.ratingText}>{item.rating} ⭐</Text>
//         <Text style={styles.reviewText}>({item.reviews}+)</Text>
//       </View>
//       <View style={styles.detailsContainer}>
//         <Text style={styles.name}>{item.item_name}</Text>
//       </View>
//     </View>
//   );

//   const renderRestaurantItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handleViewRestaurant(item)}>
//       <View style={styles.cardContainer}>
//         <View style={styles.card1}>
//           <Image source={Restro} style={styles.image1} />
//           <View style={styles.iconContainer1}>
//             <View style={styles.heart1}>
//               <Ionicons name="heart-outline" size={20} color="white" style={styles.icon1} />
//             </View>
//             <View style={styles.heart1}>
//               <Ionicons name="chatbubble-outline" size={20} color="white" style={styles.icon1} />
//             </View>
//           </View>
//           <View style={styles.ratingContainer1}>
//             <Text style={styles.ratingText1}>{item.rating} ⭐</Text>
//             <Text style={styles.reviewText1}>({item.reviews}+)</Text>
//           </View>
//           <View style={styles.detailsContainer1}>
//             <Text style={styles.name1}>{item.name}</Text>
//             <View style={styles.categories1}>
//               <Text style={styles.loc}>{item.location}</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );


//   return (
//     <SafeAreaView style={styles.AreaContainer}>
//       <ScrollView>
//         <View style={styles.container}>
//           <View style={styles.searchContainer}>
//             <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
//             <TextInput
//               placeholder="Find food or restaurant..."
//               style={styles.searchInput}
//               value={searchTerm}
//               onChangeText={handleSearch}
//             />
//             <TouchableOpacity onPress={() => setFilterVisible(true)}>
//               <Ionicons name="options" size={26} color="#00D0DD" style={{ marginLeft: 15 }} />
//             </TouchableOpacity>
//           </View>

//           <Modal
//             visible={filterVisible}
//             animationType="slide"
//             transparent={true}
//             onRequestClose={() => setFilterVisible(false)}
//           >
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Filters</Text>

//                 <Text style={styles.sectionTitle}>Sort by</Text>
//                 <View style={styles.sortOptions}>
//                   {['Relevance', 'Price: low to high', 'Price: high to low', 'Location: nearest to farthest', 'Location: farthest to nearest'].map((option) => (
//                     <TouchableOpacity
//                       key={option}
//                       style={[styles.optionButton, getSortOptionStyle(option)]}
//                       onPress={() => handleSortOptionPress(option)}
//                     >
//                       <Text style={{ color: option === selectedSortOption ? 'white' : 'black' }}>
//                         {option}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 <Text style={styles.sectionTitle}>By Cuisine</Text>
//                 <View style={styles.cusinesOptions}>
//                   {['Italian', 'Mexican', 'Chinese', 'Indian', 'British', 'Korean'].map((cuisine, index) => (
//                     <TouchableOpacity
//                       key={cuisine}
//                       style={[styles.optionButton, getSortOptionStyle(index)]}
//                       onPress={() => handleSortOptionPress(index)}
//                     >
//                       <Text style={{ color: index === selectedSortOption ? 'white' : 'black' }}>{cuisine}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 <View style={styles.buttonContainer}>
//                   <TouchableOpacity onPress={() => setFilterVisible(false)} style={styles.cancelButton}>
//                     <Text style={styles.cancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
//                     <Text style={styles.applyText}>Apply</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>

//           {showInitial ? (

//             <>
//               <View>
//                 <View>
//                   <Text style={styles.sectionTitle}>Popular Searches</Text>
//                   <FlatList
//                     data={popularSearches}
//                     horizontal={true}
//                     keyExtractor={(item) => item.id}
//                     showsHorizontalScrollIndicator={false}
//                     // style={{ paddingHorizontal: 10 }}
//                     renderItem={({ item }) => (
//                       <TouchableOpacity
//                         style={styles.popularSearchCard}
//                         onPress={() => handlePopularSearch(item.name)}
//                       >
//                         <Image source={item.image} style={styles.popularSearchImage} />
//                         <Text>{item.name}</Text>
//                       </TouchableOpacity>
//                     )}
//                   />
//                 </View>
//                 <View>
//                   <View style={styles.recentHeader}>
//                     <Text style={styles.sectionTitle}>Recent Searches</Text>
//                     <TouchableOpacity
//                       onPress={handleClearRecentSearches}
//                       style={styles.clearButton}
//                     >
//                       <Text>X</Text>
//                     </TouchableOpacity>
//                   </View>
//                   <View style={styles.recentSearchContainer}>
//                     {recentSearches.map((search, index) => (
//                       <Text key={index} style={styles.recentSearchText}>
//                         {search}
//                       </Text>
//                     ))}
//                   </View>
//                 </View>
//                 <View>
//                   <>
//                     <Text style={styles.subTitle}>Menu Items</Text>
//                     <FlatList
//                       data={filteredFood}
//                       renderItem={renderFoodItem}
//                       horizontal={true}
//                       showsHorizontalScrollIndicator={false}
//                       keyExtractor={(item) => item.id}
//                       numColumns={1}
//                     />
//                   </>
//                 </View>
//               </View>
//               <View>
//                 <>
//                   <Text style={styles.subTitle}>Restaurants</Text>
//                   <FlatList
//                     data={filteredRestaurants}
//                     renderItem={renderRestaurantItem}
//                     keyExtractor={(item) => item.id}
//                     // onEndReached={loadMoreRestaurants}
//                     onEndReachedThreshold={0.5}

//                   />
//                 </>
//               </View>

//             </>
//           ) : (
//             <>
//               {recentSearches.length > 0 ?
//                 (
//                   <>
//                     <View style={styles.recentHeader}>
//                       <Text style={styles.sectionTitle}>Recent Searches</Text>
//                       <TouchableOpacity
//                         onPress={handleClearRecentSearches}
//                         style={styles.clearButton}
//                       >
//                         <Text>X</Text>
//                       </TouchableOpacity>
//                     </View>
//                     <View style={styles.recentSearchContainer}>
//                       {recentSearches.map((search, index) => (
//                         <Text key={index} style={styles.recentSearchText}>
//                           {search}
//                         </Text>
//                       ))}
//                     </View>

//                     {recentViews.length > 0 && (
//                       <>
//                         <View style={styles.recentHeader}>
//                           <Text style={styles.sectionTitle}>Recently Viewed</Text>
//                           <TouchableOpacity
//                             onPress={handleClearRecentViews}
//                             style={styles.clearButton}
//                           >
//                             <Text style={styles.clearButtonText}>X</Text>
//                           </TouchableOpacity>
//                         </View>
//                         <FlatList
//                           data={recentViews}
//                           keyExtractor={(item) => item.id.toString()}
//                           renderItem={renderRestaurantItem}
//                         />
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   <></>
//                   // <Text style={styles.sectionTitle}>Start typing to search for restaurants or food items...</Text>
//                 )
//               }
//               <Text style={styles.results}>Search Results</Text>
//               {filteredFood.length > 0 ?
//                 <>
//                   <Text style={styles.subTitle}>Menu Items</Text>
//                   <FlatList
//                     data={filteredFood}
//                     renderItem={renderFoodItem}
//                     horizontal={true}
//                     showsHorizontalScrollIndicator={false}
//                     keyExtractor={(item) => item.id}
//                     numColumns={1}
//                   />
//                 </>
//                 :
//                 <></>}

//               {filteredRestaurants.length > 0 ?
//                 <>
//                   <Text style={styles.subTitle}>Restaurants</Text>
//                   <FlatList
//                     data={filteredRestaurants}
//                     renderItem={renderRestaurantItem}
//                     keyExtractor={(item) => item.id}
//                     // onEndReached={loadMoreRestaurants}
//                     onEndReachedThreshold={0.5}

//                   />
//                 </>
//                 : <></>}

//             </>
//           )}
//         </View>
//       </ScrollView>
//       <Footer />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   AreaContainer: { flex: 1, padding: 10, width: '100%' },
//   container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9', marginBottom: 70 },
//   searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 20 },
//   searchIcon: { marginRight: 8, },
//   searchInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, padding: 10 },
//   filterImage: {
//     width: 20,
//     height: 20,
//     // marginLeft: 10,
//   },
//   results: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 20,
//     marginBottom: 10
//   },
//   recentSearchContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
//   searchTag: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 20, fontSize: 14, backgroundColor: '#f1f1f1' },

//   cardContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   subTitle: {
//     fontSize: 20,
//     fontWeight: 600,
//     marginVertical: 10
//   },

//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 9,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//     width: width * 0.4,
//     marginHorizontal: 8,
//     height: 155,
//     marginTop: 10,
//   },
//   image: {
//     width: '100%',
//     height: 120,  // Reduced height for a shorter card
//   },
//   popularSearchCard: {
//     borderColor: "#00D0DD",
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderRadius: 20,
//     padding: 10,
//     margin: 10,
//     alignItems: 'center'
//   },
//   recentHeader: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between'
//   },
//   recentSearchText: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginTop: 10
//   },
//   clearButton: {
//     // backgroundColor: 'red',
//     padding: 5,

//   },
//   popularSearchContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginVertical: 10,
//   },

//   popularSearchItem: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     margin: 5,
//     width: width * 0.25, // Adjust size based on the layout
//     borderColor: '#00D0DD',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     backgroundColor: '#fff'
//   },

//   popularSearchImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25, // For rounded images
//     marginBottom: 5,
//   },
//   priceContainer: {

//     position: 'absolute',
//     top: 6,
//     left: 6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//     paddingHorizontal: 8,
//   },
//   priceText: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: '#000',
//     backgroundColor: 'white',
//     borderRadius: 5,
//     paddingHorizontal: 10
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     position: 'absolute',

//     top: 108,
//     left: 6,
//     backgroundColor: 'white',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 12,
//     borderColor: 'gray'
//   },
//   ratingText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   reviewText: {
//     fontSize: 10,
//     marginLeft: 2,
//     color: '#777',
//   },
//   detailsContainer: {
//     padding: 8,
//     alignItems: 'center',
//   },
//   name: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 4,
//     marginTop: 5
//   },
//   heartContainer: {

//     width: 25,
//     height: 25,
//     borderRadius: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,


//   },
//   heartContainerLiked: {
//     backgroundColor: '#00aced',
//   },
//   card1: {
//     width: '90%',
//     // width: width * 0.7,
//     marginRight: 16,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 5,
//     height: 250,
//     marginTop: 20,
//   },
//   image1: {
//     width: '100%',
//     height: 150,
//   },
//   iconContainer1: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     gap: '3%'
//   },
//   icon1: {
//     marginLeft: 0,
//   },
//   ratingContainer1: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     backgroundColor: 'white',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },
//   ratingText1: {
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   reviewText1: {
//     fontSize: 12,
//     marginLeft: 4,
//     color: '#777',
//   },
//   detailsContainer1: {
//     padding: 16,
//   },
//   name1: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   categories1: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 10,
//     justifyContent: 'flex-end'
//   },
//   loc: {
//     fontSize: 16,

//   },
//   category1: {
//     fontSize: 12,
//     color: '#555',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     backgroundColor: '#eee',
//     borderRadius: 15,
//     marginRight: 4,
//     marginBottom: 4,
//   },

//   heart1: {
//     width: 30,
//     height: 30,
//     borderRadius: '50%',
//     backgroundColor: '#00aced',
//     justifyContent: 'center',
//     alignItems: 'center',

//   },
//   // Modal styles
//   modalContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
//   modalContent: { width: '100%', backgroundColor: 'white', borderRadius: 8, padding: 16 },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
//   sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16 },
//   sortOptions: { flexDirection: 'column', flexWrap: 'wrap', marginVertical: 8 },
//   cusinesOptions: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10, },
//   optionButton: { padding: 8, borderWidth: 1, borderColor: '#00D0DD', borderRadius: 20, margin: 4, },
//   buttonContainer: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 16 },
//   cancelButton: { padding: 12, paddingHorizontal: 40, backgroundColor: '#fff', borderRadius: 8 },
//   applyButton: { paddingVertical: 12, paddingHorizontal: 40, backgroundColor: '#00D0DD', borderRadius: 8 },
//   cancelText: { color: '#00D0DD' },
//   applyText: { color: '#fff' },
// });

// export default Search;


import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import foodrestro from '../../assets/foodrestro.png';
import Restro from "../../assets/Restro.png";
import Footer from './Footer';
import { fetchAllMenuItems } from '../../src/services/menuItemsServices';
import apiClient, { MEDIA_BASE_URL } from '../../src/api/apiClient';
import { useRouter } from 'expo-router';
import debounce from 'lodash/debounce';

const { width } = Dimensions.get('window');


const popularSearches = [
  { id: '1', name: 'Top Rated', image: require('../../assets/star.png') },
  { id: '2', name: 'Best Cuisines', image: require('../../assets/cusines.png') },
];

// const recentSearches = ['Mexican Food', 'Italian', 'Birmingham'];

const Search = () => {

  const [filteredFood, setFilteredFood] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [showInitial, setShowInitial] = useState(false);
  const [recentViews, setRecentViews] = useState([]);
  const [foodPage, setFoodPage] = useState(1);
  const [loadingFood, setLoadingFood] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState([]); // Stores the list of restaurants
  const [restaurantPage, setRestaurantPage] = useState(1); // Tracks current page
  const [hasMoreRestaurants, setHasMoreRestaurants] = useState(true); // Tracks if more data is available
  const [loadingRestaurants, setLoadingRestaurants] = useState(false); // Prevents duplicate API calls
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);

  const [hasMoreMenuItems, setHasMoreMenuItems] = useState(true); // Tracks if more data is available
  const [restaurantPageMenuItem, setRestaurantPageMenuItem] = useState(1);
  const [cache, setCache] = useState({});

  const router = useRouter()

  useEffect(() => {
    resetSearch();
  }, []);

  const resetSearch = () => {
    setRestaurants([]);
    setMenuItems([]);
    setRestaurantPage(1);
    setRestaurantPageMenuItem(1);
    setHasMoreRestaurants(true);
    setHasMoreMenuItems(true);
    fetchMenuItem(1);
    fetchRestaurants(1, true);
  };


  // Handle load more for menu items (pagination)
  const handleLoadMoreFoodItem = () => {
    if (hasMoreMenuItems) {
      fetchMenuItem(restaurantPageMenuItem + 1); // Fetch the next page for menu items
    }
  };

  // Handle load more for restaurants (pagination)
  const handleLoadMore = () => {
    if (hasMoreRestaurants && !loadingRestaurants) {
      fetchRestaurants(restaurantPage + 1); // Fetch the next page for restaurants
    }
  };

  // Fetch menu items API
  const fetchMenuItem = async (newPage = 1) => {
    if (loadingFood || !hasMoreMenuItems) return; // Prevent unnecessary calls
    setLoadingFood(true);

    try {
      const itemName = searchTerm; // Extract the item_name from searchTerm
      let url = `/menu-items?pagination[page]=${newPage}&pagination[pageSize]=3&populate=*`;

      if (itemName !== "") {
        url += `&filters[item_name][$contains]=${itemName}`; // Add item name filter
        console.log("itemName not cleared ", empty)
      }

      const response = await apiClient.get(url);
      const newMenuItems = response?.data?.data || [];

      if (newMenuItems.length > 0) {
        setMenuItems((prev) =>
          newPage === 1 ? newMenuItems : [...prev, ...newMenuItems]
        );
        setRestaurantPageMenuItem(newPage); // Update the current page for menu items
        setHasMoreMenuItems(newMenuItems.length === 3); // Assuming page size is 3
      } else {
        if (newPage === 1) setMenuItems([]); // Clear items on new search
        setHasMoreMenuItems(false); // No more data to fetch
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setHasMoreMenuItems(false); // Stop further calls on error
    } finally {
      setLoadingFood(false);
    }
  };

  // Fetch restaurants API
  const fetchRestaurants = async (newPage = 1, empty = false, searchText) => {
    if (loadingRestaurants || !hasMoreRestaurants) return;

    setLoadingRestaurants(true);

    // Use cache if it exists for the current search term and page
    if (cache[searchText] && cache[searchText][newPage]) {
      setRestaurants(cache[searchText][newPage]);
      return;
    }

    try {
      let url = `/restaurants?pagination[page]=${newPage}&pagination[pageSize]=3&populate=image`;

      // Only apply search filters if the search term length is >= 3
      if (searchText && !empty) {
        url += `&filters[name][$contains]=${searchText}`;
      }

      const response = await apiClient.get(url);
      const newRestaurants = response?.data?.data || [];

      // Update the restaurants list with new data
      setRestaurants((prev) =>
        newPage === 1 ? newRestaurants : [...prev, ...newRestaurants]
      );
      setRestaurantPage(newPage);

      // Handle pagination: If more data exists, set 'hasMoreRestaurants'
      setHasMoreRestaurants(newRestaurants.length > 0);

      // Cache the new data for the current search term and page
      setCache((prevCache) => ({
        ...prevCache,
        [searchTerm]: {
          ...prevCache[searchTerm],
          [newPage]: newRestaurants, // Cache restaurants by page
        },
      }));
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setHasMoreRestaurants(false);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.trim().length >= 3) {
        fetchRestaurants(1, false, term);
      } else if (term.trim().length === 0) {
        fetchRestaurants(1, true); // Fetch default data if input is cleared
      }
    }, 500),
    []
  );

  const handleSearch = (text) => {
    setSearchTerm(text); // Update the state
    setRestaurantPage(1); // Reset pagination
    setHasMoreRestaurants(true); // Reset state
    debouncedSearch(text); // Pass the current text directly to debouncedSearch
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

      {searchTerm.length === 0 && recentSearches.length > 0 && (
        <View>
          <View style={styles.suggestionsContainer}>
            <Text style={styles.searchHistoryTitle}>Search history</Text>
            <TouchableOpacity
              onPress={() => handleClearRecentViews()}
              style={styles.deleteIconContainer}
            >
              <Ionicons onPress={handleClearRecentSearches}
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
                  setSearchTerm(item);
                  handleSearch();
                }}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      )}


      {menuItems.length > 0 && (
        <View style={{ height: 220 }}>
          <>
            <Text style={styles.subTitle}>Menu Items</Text>
            <FlatList
              data={menuItems}
              renderItem={renderFoodItem}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              numColumns={1}
              onEndReached={handleLoadMoreFoodItem} // This will trigger when the user reaches the end of the menu items list
              onEndReachedThreshold={0.5} // Trigger when the user is 50% from the bottom
            />
          </>
        </View>
      )}

      {restaurants.length > 0 && (
        <>
          <Text style={[styles.subTitle, { marginTop: 15 }]}>Restaurants</Text>
          <FlatList
            data={restaurants}
            renderItem={renderRestaurantItem}
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

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: { flex: 1 },
  scrollContent: {
    paddingLeft: 16, // Add padding around the content
    marginBottom: 50
  },
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
    height: 250,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15
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

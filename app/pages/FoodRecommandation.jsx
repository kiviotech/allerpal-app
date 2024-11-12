import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import foodrestro from "../../assets/foodrestro.png";
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

const foodData = [
  {
    id: 1,
    name: "Salmon Salad",
    image: foodrestro,
    price: "$5.50",
    rating: 4.5,
    reviews: 25,
  },
  {
    id: 2,
    name: "Pasta",
    image: foodrestro,
    price: "$6.00",
    rating: 4.7,
    reviews: 30,
  },
  {
    id: 3,
    name: "Pizza",
    image: foodrestro,
    price: "$8.00",
    rating: 4.3,
    reviews: 40,
  },
  {
    id: 4,
    name: "Pizza",
    image: foodrestro,
    price: "$8.00",
    rating: 4.3,
    reviews: 40,
  },
];

const FoodCard = ({ item }) => {
  const [liked, setLiked] = useState(false);

  const handleHeartPress = () => {
    setLiked(!liked);
  };
  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>{item.price}</Text>
        <TouchableOpacity onPress={handleHeartPress} style={styles.heartContainer}>

          <Ionicons
            name={liked ? "heart" : "heart-outline"} // Filled heart if liked, outline otherwise
            size={18}
            color={liked ?  '#00aced'  : 'white'}
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
};

const FoodRecommendations = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food recommendations for you</Text>
      <FlatList
        data={foodData}
        renderItem={({ item }) => <FoodCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
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
    height: 170
  },
  image: {
    width: '100%',
    height: 120,  // Reduced height for a shorter card
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
    marginTop: 10
  },
  heartContainer: {

    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent background
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,


  },
  heartIcon: {
    marginLeft: 3,
  },

});

export default FoodRecommendations;


// !==============================================================


// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// // import apiClient from "../apiClient"; // Assuming apiClient is set up for your API calls
// import { getAllRestaurants } from '../../src/api/repositories/restaurantRepositories';


// const { width } = Dimensions.get('window');

// // Define your FoodCard component
// const FoodCard = ({ item }) => {
//   const [liked, setLiked] = useState(false);

//   const handleHeartPress = () => {
//     setLiked(!liked);
//   };

//   return (
//     <View style={styles.card}>
//       <Image source={{ uri: item.image }} style={styles.image} />
//       <View style={styles.priceContainer}>
//         <Text style={styles.priceText}>{item.price}</Text>
//         <TouchableOpacity onPress={handleHeartPress} style={styles.heartContainer}>
//           <Ionicons
//             name={liked ? "heart" : "heart-outline"}
//             size={18}
//             color={liked ? '#00aced' : 'white'}
//             style={styles.heartIcon}
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.ratingContainer}>
//         <Text style={styles.ratingText}>{item.rating} ⭐</Text>
//         <Text style={styles.reviewText}>({item.reviews}+)</Text>
//       </View>
//       <View style={styles.detailsContainer}>
//         <Text style={styles.name}>{item.name}</Text>
//       </View>
//     </View>
//   );
// };

// // Define your FoodRecommendations component
// const FoodRecommendations = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch data from the API when component mounts
//     const fetchRestaurants = async () => {
//       try {
//         const response = await getAllRestaurants();
//         setRestaurants(response.data.data);
//       } catch (error) {
//         console.error("Failed to fetch restaurants:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurants();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#00aced" style={styles.loader} />;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Food recommendations for you</Text>
//       <FlatList
//         data={restaurants}
//         renderItem={({ item }) => <FoodCard item={item} />}
//         keyExtractor={(item) => item.id.toString()}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: 8 }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 20,
//     backgroundColor: '#f5f5f5',
//     width: '100%',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     paddingHorizontal: 16,
//     marginBottom: 10,
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
//     height: 170
//   },
//   image: {
//     width: '100%',
//     height: 120,  // Reduced height for a shorter card
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
//     marginTop: 10
//   },
//   heartContainer: {

//     width: 25,
//     height: 25,
//     borderRadius: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent background
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,


//   },
//   heartIcon: {
//     marginLeft: 3,
//   },

// });

// export default FoodRecommendations;



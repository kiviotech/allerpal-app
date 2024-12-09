// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   StyleSheet,
//   Dimensions,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import { fetchReviewsByRestaurantId } from "../../src/services/reviewServices";
// import { MEDIA_BASE_URL } from "../../src/api/apiClient";
// import { MaterialIcons } from "@expo/vector-icons";

// const ReviewCards = ({ restaurantId }) => {
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     const fetchRestaurantReviews = async () => {
//       try {
//         const response = await fetchReviewsByRestaurantId(restaurantId);
//         setReviews(response.data);
//       } catch (error) {
//         console.error("Error:", error.message);
//       }
//     };

//     fetchRestaurantReviews();
//   }, [restaurantId]);

//   return (
//     <SafeAreaView style={styles.AreaContainer}>
//       {reviews.length > 0 ?
//       <View style={styles.Container}>
//       <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
//         {reviews?.map((item, index) => (
//           <View key={index} style={styles.card}>
//             {/* Header Section */}
//             <View style={styles.header}>
//               <View style={styles.profileContainer}>
//                 <Image
//                   source={{
//                     uri: "https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg",
//                   }}
//                   style={styles.profileImage}
//                 />
//                 <View style={styles.ratingBadge}>
//                   <Text style={styles.ratingText}>{item.rating}</Text>
//                   <MaterialIcons name="star" size={15} color="yellow" />
//                 </View>
//               </View>
//               <View style={styles.headerText}>
//                 <Text style={styles.name}>
//                   {item?.profile?.name || "Anonymous"}
//                 </Text>
//                 <Text style={styles.date}>
//                   {new Date(item.createdAt).toLocaleDateString()}
//                 </Text>
//               </View>
//             </View>

//             {/* Image Section */}
//             <View style={styles.imageCarousel}>
//               {item.Image && item.Image.length > 0 && (
//                 <Image
//                   source={{ uri: `${MEDIA_BASE_URL}${item.Image[0].url}` }}
//                   style={styles.Image}
//                 />
//               )}
//             </View>

//             <Text style={styles.review}>
//               {item.comment || "No comment provided."}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//     :
//     <>
//     <Text style={styles.review}>No review yet , be the first one to review</Text>
//     </>}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   AreaContainer: {
//     flex: 1,
//     padding: 10,
//     paddingBottom: 80,
//     marginTop: 20,
//     backgroundColor: "#F9F9F9",
//     width: "100%",
//   },

//   Container: {
//     backgroundColor: "#F9F9F9",
//     display: "flex",
//     justifyContent: 'center',
//     width: "100%",
//     gap:20
//   },
//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: 15,
//     padding: 15,
//     width: Dimensions.get("window").width * 0.8,
//     marginHorizontal: 10,
//     height: 450,
//     // transform: [{ rotateY: "15deg" }, { rotateX: "5deg" }], // Slight rotation for 3D effect
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     marginLeft: 10,
//   },
//   profileContainer: {
//     position: "relative",
//     marginRight: 10,
//   },
//   profileImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 20,
//   },
//   ratingBadge: {
//     position: "absolute",
//     bottom: -0,
//     right: -5,
//     backgroundColor: "#4CAF50",
//     borderRadius: 8,
//     paddingHorizontal: 5,
//     paddingVertical: 2,
//     display: "flex",
//     flexDirection: "row",
//   },
//   ratingText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   headerText: {
//     flex: 1,
//   },
//   name: {
//     fontWeight: "bold",
//     fontSize: 20,
//   },
//   date: {
//     fontSize: 15,
//     color: "#777",
//   },
//   imageCarousel: {
//     marginVertical: 10,
//     marginLeft: 10,
//   },
//   reviewImage: {
//     width: 100,
//     height: 80,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   review: {
//     fontSize: 18,
//     color: "#555",
//     marginLeft: 10,
//     marginTop: 10,
//   },
//   Image: {
//     width: "100%",
//     height: 140,
//   },
// });

// export default ReviewCards;



import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

const GOOGLE_API_KEY = "AIzaSyDFQTSshpxEzndpEMEIDi_8f7OUGyh-Hs8"; // Replace with your actual Google API Key
const PLACE_ID_API = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const PLACE_DETAILS_API = "https://maps.googleapis.com/maps/api/place/details/json";
const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

const ReviewCards = ({ restaurantName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoogleReviews = async () => {
      try {
        // Step 1: Get Place ID
        const placeIdResponse = await axios.get(PROXY_URL + PLACE_ID_API, {
            params: {
            input: restaurantName,
            inputtype: "textquery",
            fields: "place_id",
            key: GOOGLE_API_KEY,
          },
        });

        const placeId = placeIdResponse.data.candidates[0]?.place_id;
        if (!placeId) {
          throw new Error("Place ID not found.");
        }

        // Step 2: Fetch Reviews
        const detailsResponse = await axios.get(PROXY_URL + PLACE_DETAILS_API, {
          params: {
            place_id: placeId,
            fields: "name,rating,reviews",
            key: GOOGLE_API_KEY,
          },
        });

        const fetchedReviews = detailsResponse.data.result.reviews || [];
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleReviews();
  }, [restaurantName]);

  if (loading) {
    return (
      <SafeAreaView style={styles.AreaContainer}>
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.AreaContainer}>
      {reviews.length > 0 ? (
        <View style={styles.Container}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {reviews.map((item, index) => (
              <View key={index} style={styles.card}>
                {/* Header Section */}
                <View style={styles.header}>
                  <View style={styles.profileContainer}>
                    <Image
                      source={{
                        uri: item.profile_photo_url || "https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg",
                      }}
                      style={styles.profileImage}
                    />
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingText}>{item.rating}</Text>
                      <MaterialIcons name="star" size={15} color="yellow" />
                    </View>
                  </View>
                  <View style={styles.headerText}>
                    <Text style={styles.name}>{item.author_name || "Anonymous"}</Text>
                    <Text style={styles.date}>{item.relative_time_description}</Text>
                  </View>
                </View>

                {/* Review Text */}
                <Text style={styles.review}>{item.text || "No comment provided."}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <Text style={styles.review}>No reviews yet. Be the first to review!</Text>
      )}
    </SafeAreaView>
  );
};

export default ReviewCards;

const styles = StyleSheet.create({
  AreaContainer: { flex: 1, backgroundColor: "#fff", padding: 10 },
  Container: { flexDirection: "row" },
  card: { width: 250, margin: 10, borderRadius: 8, backgroundColor: "#f8f8f8", padding: 10 },
  header: { flexDirection: "row", marginBottom: 10 },
  profileContainer: { alignItems: "center" },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  ratingBadge: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 16, fontWeight: "bold", marginRight: 5 },
  headerText: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  date: { fontSize: 12, color: "#666" },
  review: { fontSize: 14, color: "#333", marginTop: 10 },
  loadingText: { textAlign: "center", marginTop: 20, fontSize: 16 },
});

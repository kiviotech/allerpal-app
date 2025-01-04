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
import { fetchReviewsByRestaurantId } from "../../src/services/reviewServices";
import Restro from "../../assets/Restro.png";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";


// const GOOGLE_API_KEY = "AIzaSyDFQTSshpxEzndpEMEIDi_8f7OUGyh-Hs8"; // Replace with your actual Google API Key
// const PLACE_ID_API = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
// const PLACE_DETAILS_API = "https://maps.googleapis.com/maps/api/place/details/json";
// const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

const ReviewCards = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchGoogleReviews = async () => {
  //     try {
  //       // Step 1: Get Place ID
  //       const placeIdResponse = await axios.get(PROXY_URL + PLACE_ID_API, {
  //           params: {
  //           input: restaurantName,
  //           inputtype: "textquery",
  //           fields: "place_id",
  //           key: GOOGLE_API_KEY,
  //         },
  //       });

  //       const placeId = placeIdResponse.data.candidates[0]?.place_id;
  //       if (!placeId) {
  //         throw new Error("Place ID not found.");
  //       }

  //       // Step 2: Fetch Reviews
  //       const detailsResponse = await axios.get(PROXY_URL + PLACE_DETAILS_API, {
  //         params: {
  //           place_id: placeId,
  //           fields: "name,rating,reviews",
  //           key: GOOGLE_API_KEY,
  //         },
  //       });

  //       const fetchedReviews = detailsResponse.data.result.reviews || [];
  //       setReviews(fetchedReviews);
  //     } catch (error) {
  //       console.error("Error fetching reviews:", error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchGoogleReviews();
  // }, [restaurantName]);

  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.AreaContainer}>
  //       <Text style={styles.loadingText}>Loading reviews...</Text>
  //     </SafeAreaView>
  //   );
  // }

  useEffect(() => {
    const collectRestaurants = async () => {
      try {
        setLoading(true)
        const response = await fetchReviewsByRestaurantId(restaurantId);
        setReviews(response.data)
      }
      catch (error) {
        console.error("Error fetching restaurants:", error);
        setReviews([])
      }
      setLoading(false)
    }
    collectRestaurants()
  }, []);

  return (
    <SafeAreaView >
      <ScrollView style={styles.AreaContainer}>
        {reviews.length > 0 ? (
          <View style={styles.Container}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {reviews.map((item, index) => {
                const imageUrl =
                  (item.Image && item.Image[0]?.url)
                    ? `${MEDIA_BASE_URL}${item.Image[0].url}`
                    : Restro;
                return (
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
                        <Text style={styles.name}>
                          {!item.isAnonymous ? item.profile.name : "Anonymous"}
                        </Text>
                        <Text style={styles.date}>
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Image source={{ uri: imageUrl }} style={styles.reviewImage} />
                      <Text style={styles.review}>
                        {item.comment?.length > 120
                          ? `${item.comment?.substring(0, 120)}...`
                          : item.comment}
                        {/* {item.comment || "No comment provided."} */}
                      </Text>
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        ) : (
          <Text style={styles.review}>No reviews yet. Be the first to review!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewCards;

const styles = StyleSheet.create({
  AreaContainer: { flex: 1, padding: 10, marginBottom: 70 },
  Container: { flexDirection: "row", justifyContent: 'center', gap: 20 },
  card: { width: 250, margin: 10, borderRadius: 8, padding: 10, height: 350, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, },
  header: { flexDirection: "row", marginBottom: 10 },
  profileContainer: { alignItems: "center", flexDirection: "column" },
  profileImage: { width: 35, height: 35, borderRadius: 25, marginRight: 10 },
  ratingBadge: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 16, fontWeight: "bold", marginRight: 5 },
  headerText: { textAlign: 'center' },
  name: { fontSize: 20, fontWeight: "bold" },
  reviewImage: { width: '95%', height: 120, margin: 'auto' },
  date: { fontSize: 12, color: "#666" },
  review: { fontSize: 16, marginTop: 10, padding: 10 },
  loadingText: { textAlign: "center", marginTop: 20, fontSize: 16 },
});

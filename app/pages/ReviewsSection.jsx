import React from "react";
import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import ReviewForm from "./ReviewForm";

const ReviewsSection = ({ id, restaurantId }) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Reviews Header */}
      <Text style={styles.header}>Reviews</Text>

      {/* Review Input */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() =>
          router.push({
            pathname: "pages/ReviewForm",
            params: {
              id: id,
            },
          })
        }
      >
        <Image
          source={{
            uri: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/32a508cf-362e-4d59-adb0-e3d0dbe264a1/dgve4ta-09c9e34a-827c-4eb1-b29b-9dcfea30c150.png/v1/fill/w_1920,h_1920,q_80,strp/couple_profile_picture__brunette_girl_in_love_by_samnooneson_dgve4ta-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzMyYTUwOGNmLTM2MmUtNGQ1OS1hZGIwLWUzZDBkYmUyNjRhMVwvZGd2ZTR0YS0wOWM5ZTM0YS04MjdjLTRlYjEtYjI5Yi05ZGNmZWEzMGMxNTAucG5nIiwiaGVpZ2h0IjoiPD0xOTIwIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uud2F0ZXJtYXJrIl0sIndtayI6eyJwYXRoIjoiXC93bVwvMzJhNTA4Y2YtMzYyZS00ZDU5LWFkYjAtZTNkMGRiZTI2NGExXC9zYW1ub29uZXNvbi00LnBuZyIsIm9wYWNpdHkiOjk1LCJwcm9wb3J0aW9ucyI6MC40NSwiZ3Jhdml0eSI6ImNlbnRlciJ9fQ.BvWfGNRYWH20fXm6hxMIAf8hUUzZZiopYZ1rbSo8EOc",
          }}
          style={styles.avatar}
        />
        <TextInput
          style={styles.input}
          placeholder="Write Your Review..."
          placeholderTextColor="#A9A9A9"
        />
      </TouchableOpacity>

      {/* No Reviews Message */}
      {/* <Text style={styles.noReviewsText}>
        No review yet, be the first one to review
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#000",
    fontSize: 16,
    outlineStyle: "none",
  },
  noReviewsText: {
    fontSize: 16,
    color: "grey",
    textAlign: "start",
  },
});

export default ReviewsSection;

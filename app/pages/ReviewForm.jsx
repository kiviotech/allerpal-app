import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Rating } from "react-native-ratings";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import download from "../../assets/download_icon.png";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import useAuthStore from "../../useAuthStore";
import { BASE_URL } from "../../src/api/apiClient";

const ReviewForm = () => {
  const { id } = useLocalSearchParams();
  const { documentId } = useAuthStore();
  console.log("documentId", documentId);
  const navigation = useNavigation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isAnonymous: false,
    allergensRelated: false,
    allergens: "",
    rating: 4,
  });
  const [image, setImage] = useState(null);
  const [imageIds, setImageIds] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      try {
        setUploading(true);

        // Convert URI to Blob and set up FormData
        const formData = new FormData();
        const imageBlob = await (await fetch(result.assets[0].uri)).blob();
        formData.append(
          "files",
          imageBlob,
          result.assets[0].uri.split("/").pop()
        );

        // Make upload request to Strapi
        const uploadResponse = await axios.post(
          `${BASE_URL}/api/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer dd026626aad98316a19cb314c2ec35410264da10f10c5198469cad8a1fc211fa8dac00ef1052db8fc9b6296494cbd3daa1e33766b75326514379156059b5a70685136cc53f156238baa0b315de54f649c995767f00bb9c15a511a7c057b5f2cadb912ba40b619c1c095f2a4826c11b92917d690c0573da4f64872217d2971af0`, // Replace with a valid JWT token
            },
          }
        );

        const uploadedImageId = uploadResponse.data[0]?.id;
        if (uploadedImageId) {
          setImageIds((prev) => [...prev, uploadedImageId]);
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
        Alert.alert(
          "Upload Error",
          "Failed to upload image. Please try again."
        );
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    const reviewData = {
      title: formData.title,
      comment: formData.description,
      isAnonymous: formData.isAnonymous,
      allergens: formData.allergensRelated ? null : formData.allergens,
      rating: formData.rating,
      restaurant: id,
      profile: documentId,
      Image: imageIds,
      locale: "en",
    };

    const payload = { data: reviewData };

    try {
      const response = await axios.post(`${BASE_URL}/api/reviews`, payload, {
        headers: {
          Authorization: `Bearer dd026626aad98316a19cb314c2ec35410264da10f10c5198469cad8a1fc211fa8dac00ef1052db8fc9b6296494cbd3daa1e33766b75326514379156059b5a70685136cc53f156238baa0b315de54f649c995767f00bb9c15a511a7c057b5f2cadb912ba40b619c1c095f2a4826c11b92917d690c0573da4f64872217d2971af0`, // Replace with a valid JWT token
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Review submitted successfully!");
        setFormData({
          title: "",
          description: "",
          isAnonymous: false,
          allergensRelated: false,
          allergens: "",
          rating: 4,
        });
        setImage(null);
        setImageIds([]);
        // router.push("./RestaurantScreen");
        navigation.goBack();
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error(
        "Failed to submit review:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to submit review. Please try again.";
      Alert.alert("Submission Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.ArrowContainer}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Review</Text>
      </View>

      <Text style={styles.label}>Title of Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name of title"
        placeholderTextColor="#a0a0a0"
        value={formData.title}
        onChangeText={(value) => handleInputChange("title", value)}
      />

      <Text style={styles.label}>Review Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter experience about food and visit here"
        placeholderTextColor="#a0a0a0"
        value={formData.description}
        onChangeText={(value) => handleInputChange("description", value)}
        multiline
      />

      <View style={styles.row}>
        <Text style={styles.checkboxLabel}>Post this review anonymously</Text>
        <TouchableOpacity
          style={[
            styles.checkbox,
            formData.isAnonymous && styles.checkedCheckbox,
          ]}
          onPress={() =>
            handleInputChange("isAnonymous", !formData.isAnonymous)
          }
        >
          {formData.isAnonymous && (
            <Ionicons name="checkmark" size={15} color="#00C9D6" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.reviewContainer}>
        <Text style={styles.label}>
          Is this review related to your saved allergens?
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              formData.allergensRelated && styles.selectedCheckbox,
            ]}
            onPress={() => handleInputChange("allergensRelated", true)}
          >
            {formData.allergensRelated && (
              <Ionicons name="checkmark" size={15} color="#00C9D6" />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Yes</Text>
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              !formData.allergensRelated && styles.selectedCheckbox,
            ]}
            onPress={() => handleInputChange("allergensRelated", false)}
          >
            {!formData.allergensRelated && (
              <Ionicons name="checkmark" size={15} color="#00C9D6" />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>No</Text>
        </View>
      </View>

      {!formData.allergensRelated && (
        <>
          <Text style={styles.label}>Please specify any allergens</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your allergens here"
            placeholderTextColor="#a0a0a0"
            value={formData.allergens}
            onChangeText={(value) => handleInputChange("allergens", value)}
          />
        </>
      )}

      <View style={styles.uploadContainer}>
        <Text style={styles.label}>Upload related photos</Text>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pickImage}
          disabled={uploading}
        >
          <View style={styles.uploadContent}>
            <Image source={download} style={styles.icon} />
            <Text style={styles.uploadText}>
              Drag & Drop or Choose file to Upload
            </Text>
          </View>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        {uploading && <Text>Uploading image...</Text>}
      </View>

      <Text style={styles.label}>Rate your Experience</Text>
      <View style={styles.ratingContainer}>
        <Rating
          startingValue={formData.rating}
          imageSize={30}
          onFinishRating={(value) => handleInputChange("rating", value)}
          style={styles.rating}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  label1: {
    fontSize: 18,
    marginTop: 30,
    color: "#333",
  },
  label2: {
    fontSize: 18,
    marginTop: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  input1: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    height: 100,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textArea: {
    height: 80,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },
  option: {
    fontSize: 16,
    color: "#333",
    marginHorizontal: 10,
  },
  selectedOption: {
    fontWeight: "bold",
    color: "#00f",
  },
  ratingContainer: {
    display: "flex",
  },
  rating: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  dateIcon: {
    position: "absolute",
    right: 10,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#00aced",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 25,

    width: "40%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  reviewContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 16,
    color: "#a0a0a0",
    marginBottom: 10,
  },
  uploadBox: {
    borderColor: "#00C9D6",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,

    borderStyle: "dashed",
    borderWidth: 3,
  },
  uploadContent: {
    alignItems: "center",
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    color: "#808080",
    textAlign: "center",
  },
  fileTypes: {
    fontSize: 12,
    color: "#C0C0C0",
    marginTop: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00C9D6",
    borderRadius: 5,
    padding: 4,
    width: 20,
    height: 20,
    marginHorizontal: 8,
  },
  selectedCheckbox: {
    backgroundColor: "#E0F7FA",
  },
  ArrowContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    marginTop: 13, // Add some space above the back arrow
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    padding: 15,
    color: "#000",
    marginTop: 10, // Move header down a bit
  },
  icon: {
    width: 24, // Adjust size as needed
    height: 24,
    marginRight: 5,
  },
});

export default ReviewForm;

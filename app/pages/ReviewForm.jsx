import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  CheckBox,
  Modal,
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
  console.log('id', id)
  const profileId = useAuthStore((state) => state.profileId);
  const navigation = useNavigation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isAnonymous: false,
    allergensRelated: false,
    allergens: "",
    rating: 0,
  });
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [imageIds, setImageIds] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    rating: "",
  });
  const [isThankYouVisible, setIsThankYouVisible] = useState(false);
  const { jwt } = useAuthStore(state => state);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    // Clear error message when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  // Form validation before submission
  const validateForm = () => {
    let isValid = true;
    let newErrors = { title: "", description: "", rating: "" };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
      isValid = false;
    }
    if (!formData.rating) {
      newErrors.rating = "Please rate your experience.";
      isValid = false;
    }
    if (!isTermsAccepted) {
      Alert.alert("Validation Error", "Please accept the terms and conditions.");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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
          `${BASE_URL}/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
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
    if (!isTermsAccepted) {
      return;
    }
    else if (!validateForm()) return;
    else {
      const reviewData = {
        title: formData.title,
        comment: formData.description,
        isAnonymous: formData.isAnonymous,
        allergens: formData.allergensRelated ? null : formData.allergens,
        rating: formData.rating,
        restaurant: id,
        profile: profileId,
        Image: imageIds,
        locale: "en",
      };

      const payload = { data: reviewData };

      try {
        const response = await axios.post(`${BASE_URL}/reviews`, payload, {
          headers: {
            Authorization: `Bearer ${jwt}`, // Replace with a valid JWT token
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
          setIsThankYouVisible(true); // Show the Thank You modal

          setTimeout(() => {
            setIsThankYouVisible(false);
            router.back(); // Go back to the previous screen
          }, 2000);// Redirect after 2 seconds
          
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
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.ArrowContainer}>
          <TouchableOpacity
            style={styles.backArrow}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Review</Text>
        </View>

        <View style={styles.lableInput}>
          <Text style={styles.label}>Title of Review</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name of title"
            placeholderTextColor="#a0a0a0"
            value={formData.title}
            onChangeText={(value) => {
              const textOnly = value.replace(/[^a-zA-Z\s]/g, '');
              handleInputChange("title", textOnly);
            }}
          />
          {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
        </View>

        <View style={styles.lableInput}>
          <Text style={styles.label}>Review Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter experience about food and visit here"
            placeholderTextColor="#a0a0a0"
            value={formData.description}
            multiline
            onChangeText={(value) => {
              handleInputChange("description", value);
            }}
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
        </View>

        <View style={styles.row}>
          <Text style={styles.checkboxLabel}>Post this review anonymously</Text>
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              formData.isAnonymous && styles.selectedCheckbox,
            ]}
            onPress={() =>
              handleInputChange("isAnonymous", !formData.isAnonymous)
            }
          >
            {formData.isAnonymous && (
              <Ionicons name="checkmark-sharp" size={18} color="#00C9D6" />
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
                <Ionicons name="checkmark-sharp" size={18} color="#00C9D6" />
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
                <Ionicons name="checkmark-sharp" size={18} color="#00C9D6" />
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>No</Text>
          </View>
        </View>

        {!formData.allergensRelated && (
          <View style={styles.lableInput}>
            <Text style={styles.label}>Please specify any allergens</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your allergens here"
              placeholderTextColor="#a0a0a0"
              value={formData.allergens}
              onChangeText={(value) => {
                const textOnly = value.replace(/[^a-zA-Z\s]/g, '');
                handleInputChange("allergens", textOnly);
              }}
            />
          </View>
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

        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.disclaimerButton}>
          <Text style={styles.linkText}>Terms and Conditions</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Rate your Experience</Text>
        <View style={styles.ratingContainer}>
          <Rating
            startingValue={formData.rating}
            imageSize={30}
            onFinishRating={(value) => handleInputChange("rating", value)}
            style={styles.rating}
          />
          {errors.rating ? <Text style={styles.errorText}>{errors.rating}</Text> : null}
        </View>

        <View style={styles.termsContainer}>
          <CheckBox
            value={isTermsAccepted} // Controlled state
            onValueChange={setIsTermsAccepted} // Toggle state on change
            style={styles.termsCheckbox}
          />
          <Text style={styles.termsText}>
            By ticking the box and submitting a review, the User affirms they have read, understood, and agree to comply with these Terms and Conditions. Allerpal reserves the right to update or modify these terms without prior notice, and continued use of the platform constitutes acceptance of any such changes.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.submitButton,
          !isTermsAccepted && styles.buttonDisabled,]} onPress={handleSubmit} disabled={!isTermsAccepted}>
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Thank you modal */}
      <Modal visible={isThankYouVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.thankyouContainer}>
            <Text style={styles.thankyouTitle}>Thank You!</Text>
            <Text style={styles.thankyouSubtitle}>Your review has been submitted successfully.</Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>X</Text>
            </TouchableOpacity>

            {/* Modal Title */}
            <Text style={styles.modalTitle}>Allerpal Review Submission Terms and Conditions</Text>
            <Text style={styles.modalSubtitle}>
              By submitting a review on Allerpal, you (“User”) agree to the following terms and conditions. Allerpal reserves the right to enforce these terms to maintain integrity, legality, and respect within the platform. Failure to adhere may result in removal of the review, account suspension, or further actions as deemed necessary.
            </Text>

            {/* Scrollable Content */}
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>1. Truthfulness and Accuracy</Text>
                {"\n"}• The User agrees that all statements in their review reflect their own, accurate, and honest experiences. Misleading, exaggerated, or intentionally false information is strictly prohibited.
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.boldText}>2. User Responsibility</Text>
                {"\n"}• The User accepts full responsibility for all content posted in their review. Allerpal does not verify or endorse User-generated content, and the User agrees to post only information they genuinely believe to be true and accurate.
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.boldText}>3. Prohibition of Defamatory or Harassing Content</Text>
                {"\n"}• The User agrees not to include defamatory, malicious, or harassing statements that may unjustly harm the reputation of any restaurant, business, or individual. Allerpal reserves the right to remove reviews containing defamatory or harmful content, and the User may be held personally liable for any damages arising from such content.
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.boldText}>4. Respectful and Appropriate Language</Text>
                {"\n"}• The User agrees to use respectful language and to refrain from using offensive, discriminatory, vulgar, or otherwise inappropriate language. Reviews containing hate speech, personal attacks, or threats will be removed.
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.boldText}>5. Disclosure of Conflicts of Interest</Text>
                {"\n"}• The User agrees to disclose any personal, professional, or financial relationships with the restaurant being reviewed. Paid or promotional reviews are prohibited, and any undisclosed conflicts of interest will result in removal of the review.
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.boldText}>6. Confidential and Proprietary Information</Text>
                {"\n"}• The User agrees not to disclose confidential, proprietary, or insider information about any restaurant, including but not limited to recipes, operational details, or business practices, unless such information is publicly available.
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.boldText}>7. Grant of License to Allerpal</Text>
                {"\n"}• By submitting a review, the User grants Allerpal a perpetual, worldwide, non-exclusive, royalty-free license to use, reproduce, distribute, display, and modify the content for any purpose related to Allerpal’s services, in accordance with applicable laws.
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.boldText}>8. Right to Edit or Remove Content</Text>
                {"\n"}• Allerpal reserves the right to edit, modify, or remove reviews that violate these Terms and Conditions or are otherwise deemed inappropriate or harmful. Repeated violations of these terms may result in account suspension or termination.
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.boldText}>9. Legal Compliance</Text>
                {"\n"}• The User agrees to abide by all applicable laws, rules, and regulations when posting reviews. Reviews that infringe on the rights of others, violate laws, or breach privacy rights will be removed, and the User may face further actions as required by law.
              </Text>

              <Text style={styles.modalText}>
                <Text style={styles.boldText}>10. Indemnification and Hold Harmless Clause</Text>
                {"\n"}• The User agrees to indemnify, defend, and hold Allerpal, its officers, directors, employees, and affiliates harmless from any claims, liabilities, damages, costs, or expenses (including legal fees) arising from the content of their review or any violation of these Terms and Conditions.
              </Text>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
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
    borderColor: "#000",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    fontSize: 16,

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
    fontSize: 16,

  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textArea: {
    height: 80,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 18,
    color: "#333",
  },
  option: {
    fontSize: 18,
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
  termsContainer: {
    flexDirection: "row",
    marginTop: "5%",
  },
  termsCheckbox: {
    width: 25,
    height: 25,
  },
  termsText: {
    fontSize: 16,
    textAlign: 'justify',
    color: "#555",
    flex: 1,
    marginLeft: 10,
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
  buttonDisabled: {
    backgroundColor: "#aaa",
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
  errorText: {
    color: 'red',
    marginTop: 2
  },
  lableInput: {
    marginVertical: 20
  },
  label: {
    fontSize: 18,
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
    fontSize: 18,
    color: "#808080",
    textAlign: "center",
  },
  fileTypes: {
    fontSize: 18,
    color: "#C0C0C0",
    marginTop: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  disclaimerButton: {
    marginTop: 10,
    padding: 10
  },
  linkText: {
    color: "#00c4cc",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00C9D6",
    borderRadius: 5,
    width: 25,
    height: 25,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },

  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 20,
    width: "90%", // Responsive width
    maxWidth: 500, // Max width to prevent over-expansion
    alignItems: "center",
  },

  thankyouContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 50,
    width: "90%", // Responsive width
    maxWidth: 500, // Max width to prevent over-expansion
    alignItems: "center",
  },
  thankyouTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  thankyouSubtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "justify",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "justify",
  },

  modalContent: {
    maxHeight: 500, // Scrollable if content is long
    paddingVertical: 10,
  },

  modalText: {
    fontSize: 14,
    textAlign: "justify",
    // color: "#333", 
    marginBottom: 15,
  },

  modalButton: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
    marginLeft: 'auto'
  },

  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'right',
  },

  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
  },

  modalCloseIcon: {
    fontSize: 22,
    color: "#333",
  },
});

export default ReviewForm;

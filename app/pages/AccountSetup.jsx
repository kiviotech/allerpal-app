import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import apiClient from "../../src/api/apiClient";
import useAuthStore from "../../useAuthStore";
import { createNewProfileAllergy } from "../../src/services/profileAllergiesServices";
import { createNewProfile } from "../../src/services/profileServices";
import profileEndpoints from "../../src/api/endpoints/profileEndpoints";

const AccountSetup = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const userId = useAuthStore((state) => state?.user?.id);
  const userName = useAuthStore((state) => state?.user?.username);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setInputValue("");
  };

  const handleNextPress = async () => {
    const profileData = {
      data: {
        name: selectedOption === "Myself" ? userName : inputValue, // Use userName if 'Myself', otherwise inputValue
        relation: selectedOption.toLowerCase(), // Convert selectedOption to lowercase
        user: userId.toString(), // Convert userId to string
      },
    };
  
    console.log("Profile Data:", JSON.stringify(profileData, null, 2)); // Debugging log
  
    try {
      const response = await apiClient.post(profileEndpoints.createProfile, profileData); // POST request to API
      console.log("Profile created successfully:", response.data.data);
  
      const documentId = response.data.data.documentId;
      const profileId = response.data.data.id;
  
      // Set documentId in Zustand store
      useAuthStore.getState().setDocumentId(documentId);
      useAuthStore.getState().setProfileId(profileId);
  
      // Show success message
      Alert.alert("Success", "Profile created successfully!");
  
      // Navigate to the Disclamier page with profileId as a parameter
      router.push({
        pathname: "./Disclamier",
        params: { 
          profileId: profileId,
          documentId: documentId,
        },
      });
    } catch (error) {
      console.error("Error creating profile:", error.response?.data || error.message); // Log error details
      Alert.alert("Error", "Failed to create profile. Please try again."); // Show error alert
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Account Setup</Text>

        <Text style={styles.label}>I am creating an Allergy Profile for:</Text>

        <View style={styles.optionContainer}>
          {["Myself", "My Child", "My Partner"].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleOptionChange(option)}
              style={styles.checkboxContainer}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedOption === option && styles.checkedCheckbox,
                ]}
              >
                {selectedOption === option && (
                  <Ionicons name="checkmark-sharp" size={20} color="#00c4cc" />
                )}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedOption && selectedOption !== "Myself" && (
          <TextInput
            style={styles.input}
            placeholder={`Enter ${selectedOption?.split(' ')[1].toLowerCase()}'s name here`}
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.nextButtonText}>Next </Text>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "10%",
    maxWidth: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  optionContainer: {
    flexDirection: "column",
    marginBottom: 10,
    width: '50%',
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#00c4cc",
    borderWidth: "bold",
    paddingVertical: 10,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#00c4cc",
    borderRadius: 5,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedCheckbox: {
    color: "#00c4cc", // Change this color as needed
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '60%'
  },
  optionText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#00c4cc",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  nextButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",

  },
});

export default AccountSetup;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import apiClient from "../../src/api/apiClient";
import useAuthStore from "../../useAuthStore";

const AccountSetup = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const userId = useAuthStore((state) => state.user.id);
  const userName = useAuthStore((state) => state.user.username);
  console.log("userName", userName);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setInputValue("");
  };

  const handleNextPress = async () => {
    if (selectedOption === "Myself") {
      const profileData = {
        data: {
          name: userName,
          relation: selectedOption.toLowerCase(),
          user: userId.toString(),
        },
      };

      try {
        const response = await apiClient.post("/profiles", profileData);
        console.log("Profile created successfully:", response);
        const documentId = response.data.data.documentId;
        const profileId = response.data.data.id;
        console.log("id", profileId);
        useAuthStore.getState().setDocumentId(documentId);
        Alert.alert("Success", "Profile created successfully!");
        router.push({
          pathname: "./Disclamier",
          params: { profileId: profileId },
        });
      } catch (error) {
        console.error("Error creating profile:", error);
        Alert.alert("Error", "Failed to create profile. Please try again.");
      }
    } else if (selectedOption && inputValue.trim() === "") {
      alert("Please fill in the details for the selected option.");
    } else {
      const profileData = {
        data: {
          name: inputValue,
          relation: selectedOption.toLowerCase(),
          user: userId.toString(),
        },
      };

      try {
        const response = await apiClient.post("/profiles", profileData);
        console.log("Profile created successfully:", response);
        const documentId = response.data.data.documentId;
        useAuthStore.getState().setDocumentId(documentId);
        Alert.alert("Success", "Profile created successfully!");
        router.push("./Disclamier");
      } catch (error) {
        console.error("Error creating profile:", error);
        Alert.alert("Error", "Failed to create profile. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Setup</Text>

      <Text style={styles.label}>I am creating an Allergy profile for</Text>

      <View style={styles.optionContainer}>
        {["Myself", "Children", "Partner", "Friend", "Family"].map((option) => (
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
                <Ionicons name="checkmark" size={16} color="cyan" />
              )}
            </View>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedOption && selectedOption !== "Myself" && (
        <TextInput
          style={styles.input}
          placeholder={`Enter ${selectedOption.toLowerCase()} details`}
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
  );
};

// !=============================================================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
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
    marginLeft: "10%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "cyan",
    borderWidth: "bold",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "cyan",
    borderRadius: 5,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  checkedCheckbox: {
    color: "cyan", // Change this color as needed
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  optionText: {
    fontSize: 16,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex",
  },
  nextButton: {
    backgroundColor: "cyan",
    padding: 10,
    borderRadius: 25,
    width: "35%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
});

export default AccountSetup;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  CheckBox,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import SwitchToggle from "react-native-switch-toggle";

import { getAllergies } from "./../../src/api/repositories/allergyRepositories";
import { createNewUserAllergy } from "../../src/services/userAllergyServices";
import { createNewProfileAllergy } from "../../src/services/profileAllergiesServices";
import useAuthStore from "../../useAuthStore";
import useSetupStore from "../../useSetupStore";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";
import { updateProfileById } from "../../src/services/profileServices";

const FinishSetUp = () => {
  const router = useRouter();
  const { profileId, documentId } = useLocalSearchParams();
  const [allergens, setAllergensState] = useState([]);
  const {
    selectedAllergies,
    toggleAllergySelection,
    excludeMayContain,
    setExcludeMayContain,
    termsAccepted,
    setTermsAccepted,
  } = useSetupStore();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    // console.log("User:", user.documentId); // Log user info when the component mounts
    console.log("Profile ID received finish setup:", profileId); // Log the received profileId
  }, [user, profileId]);

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const response = await getAllergies();
        const allergyData = response?.data?.data;
        allergyData.sort((a, b) => a.name.localeCompare(b.name));
        setAllergensState(allergyData);
      } catch (error) {
        console.error("Error fetching allergens:", error);
      }
    };

    fetchAllergies();
  }, []);

  const handleToggleAllergen = (key) => {
    setAllergensState((prevState) =>
      prevState.map((item) =>
        item.id === key.id
          ? { ...item, checked: !item.checked } // Toggle the checked property
          : item
      )
    );
    toggleAllergySelection(key.id); // Update Zustand store
  };

  const CustomCheckBox = ({ checked, onPress }) => (
    <TouchableOpacity
      style={[styles.checkBox, checked]}
      onPress={onPress}
    >
      {checked && <Ionicons name="checkmark-sharp" size={24} color="#00c4cc" />}
    </TouchableOpacity>
  );

  const handleFinishSetup = async () => {
    if (selectedAllergies.length > 0 && termsAccepted) {
      const payload = {
        user: [user.id],
        allergies: selectedAllergies,
        custom_description: "Custom description here",
        locale: "en",
      };

      try {
        const profileAllergyPayload = {
          data: {
            profile: documentId,
            severity: "mild",
            allergies: selectedAllergies,
            locale: "en",
            excludeMayContain: excludeMayContain
          },
        };
        const resp = await createNewProfileAllergy(profileAllergyPayload);
        router.push("./Home");
      } catch (error) {
        console.error("Error creating/updating allergy profiles:", error);
      }
    } else {
      alert("Please select at least one allergen and accept the terms.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => router.push("./AccountSetup")}
          style={styles.backButtonContainer}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        Select your allergens to create and save your personalised allergy
        profile. Allerpal will give you recommendations based on this
        information so please fill out carefully.
      </Text>

      <View style={styles.allergensContainer}>
        <View style={styles.checkboxContainer}>
          {allergens?.map((key) => (
            <View key={key.id} style={styles.checkboxRow}>
              <CustomCheckBox
                checked={key?.checked || false}
                onPress={() => handleToggleAllergen(key)}
              />
              <View style={styles.imageiconContainer}>
                <Image source={{ uri: `${MEDIA_BASE_URL}${key?.Allergen_icon?.url}` }} style={styles.icon} ></Image>
                <Text style={styles.checkboxLabel}>
                  {key.name}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.toggleLabel}>
          Do you wish to EXCLUDE dishes that 'MAY CONTAIN' the selected
          Allergies
        </Text>
        <SwitchToggle
          switchOn={excludeMayContain}
          onPress={() => setExcludeMayContain(!excludeMayContain)}
          circleColorOff="#bbb"
          circleColorOn="#00c4cc"
          backgroundColorOn="#e0f7fa"
          backgroundColorOff="#ddd"
          containerStyle={styles.switchToggleContainer}
          circleStyle={styles.switchCircle}
        />
        <Text style={styles.switchText}>
          {excludeMayContain ? "Yes" : "No"}
        </Text>
      </View>

      <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.disclaimerButton}>
        <Text style={styles.linkText}>User Agreement and Legal Disclaimer</Text>
      </TouchableOpacity>

      <View style={styles.termsContainer}>
        <CheckBox value={termsAccepted} onValueChange={setTermsAccepted} style={styles.termsCheckbox} />
        <Text style={styles.termsText}>
          By ticking this box you are confirming you have read, understood, and agree to all of the terms outlined in this User Agreement and Legal Disclaimer. You accept full responsibility for verifying all allergen-related information and assume all risks related to dining with food allergies.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.finishButton,
          !(termsAccepted && selectedAllergies.length > 0) &&
          styles.buttonDisabled,
        ]}
        onPress={handleFinishSetup}
      >
        <Text style={styles.buttonText}>Finish Setup</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Allerpal User Agreement and Legal Disclaimer</Text>
            <Text style={styles.modelSubtitle}>By creating an Allerpal account and using this app, you acknowledge and agree to the following terms:</Text>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalText}>
                1.	Restaurant and Menu Information Disclaimer: Allerpal compiles restaurant and menu information from publicly available sources, data provided by restaurants, and feedback from users. While Allerpal endeavors to ensure accuracy, we cannot and do not guarantee the completeness, reliability, or timeliness of this information. Restaurant menus, ingredients, and allergen-handling practices are subject to change without notice, and Allerpal has no control over these changes. It is the user’s responsibility to verify all menu items and ingredients directly with restaurant staff to confirm allergen information before consuming any food or beverage.
              </Text>
              <Text style={styles.modalText}>
                2.	User Responsibility Disclaimer: Allerpal provides informational support to assist users in making dining decisions but does not assume responsibility for individual choices, actions, or outcomes. Users are solely responsible for assessing their own risk, confirming allergen safety with restaurant staff, and making dining decisions that align with their allergy management needs. Allerpal recommends that users practice vigilance, use personal discretion, and make decisions in consultation with medical professionals regarding any specific allergen management requirements.
              </Text>
              <Text style={styles.modalText}>
                3.	Liability Disclaimer: Allerpal, its founders, employees, and affiliates are not liable for any adverse reactions, allergic responses, injuries, or other incidents that may result from dining at any restaurant listed, recommended, or reviewed within this app. Allerpal is provided “as is,” without warranties of any kind, whether expressed or implied, including but not limited to warranties of accuracy, completeness, merchantability, or fitness for a particular purpose. By using Allerpal, you accept all inherent risks associated with dining out with food allergies and agree to release, indemnify, and hold harmless Allerpal, its founders, employees, and affiliates from any claims, liabilities, damages, or losses, arising from or related to your use of this app or reliance on its information.
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
    backgroundColor: "#fff",
    padding: 20,
  },
  backButtonContainer: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    color: "#333",
    marginTop: "5%",
    textAlign: 'justify',

  },
  allergensContainer: {
    marginTop: "5%",
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#00c4cc",
    marginRight: 10,
    flex: 1,
    fontWeight: "bold",
  },
  switchToggleContainer: {
    width: 50,
    height: 25,
    borderRadius: 25,
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  switchText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#00c4cc",
    fontWeight: "bold",
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
  finishButton: {
    backgroundColor: "#00c4cc",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    marginTop: "10%",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "10%",
  },
  icon: {
    width: 35,
    height: 35,
    marginLeft: 10,
  },
  imageiconContainer: {
    borderColor: "#00c4cc",
    width: '90%',
    maxWidth: 500,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    gap: '5%',

  },
  checkBox: {
    width: 25,
    height: 25,
    borderColor: "#00c4cc",
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
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

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modelSubtitle: {
    fontSize: 16,
    // fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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

export default FinishSetUp;

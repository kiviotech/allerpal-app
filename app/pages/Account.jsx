import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-web";
import { useRouter } from "expo-router";
import Footer from "./Footer";
import useAuthStore from "../../useAuthStore";
import { deleteToken } from "../../src/utils/storage";
import useAllergyStore from "../../src/stores/allergyStore";
import { logout } from "../../src/utils/auth";
import { Ionicons } from "@expo/vector-icons";

const Account = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("auth/Login");
    }
  }, [isAuthenticated]);

  const clearAllergies = useAllergyStore((state) => state.clearAllergies);
  const [isNotificationsEnabled, setNotificationsEnabled] =
    React.useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // Combined modal state
  const [modalContent, setModalContent] = useState({
    message: "",
    isSignOut: false,
  }); // State to handle modal content dynamically

  // Toggle notifications switch
  const toggleSwitch = () =>
    setNotificationsEnabled((previousState) => !previousState);

  // Show modal with dynamic content
  const showModal = (message, isSignOut = false) => {
    setModalContent({ message, isSignOut });
    setModalVisible(true);
  };

  // Handle sign out
  const handleSignOut = () => {
    setModalVisible(false);
    router.replace("auth/Login");
    logout();
    clearAllergies();
    deleteToken();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('/pages/Home')}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Account</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          {/* Profile navigation */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push("./Profile")}
          >
            <Icon name="person-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>My Profile</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push("./ChangePassword")}
          >
            <Icon name="lock-closed-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Change Password</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          {/* My Bookings */}
          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              showModal(
                "The My Bookings page is currently unavailable."
              )
            }
          >
            <Icon name="calendar-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>My Bookings</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          {/* Notifications */}
          <View style={styles.option}>
            <Icon name="notifications-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#00CFFF" }}
              thumbColor={isNotificationsEnabled ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() =>
                showModal(
                  "Notifications settings are currently unavailable."
                )
              }
              value={isNotificationsEnabled}
            />
          </View>

          {/* Language */}
          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              showModal(
                "Language settings are currently unavailable."
              )
            }
          >
            <Icon name="language-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Language</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          {/* Theme */}
          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              showModal(
                "Theme settings are currently unavailable."
              )
            }
          >
            <Icon name="color-palette-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Theme</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          {/* Legal & Policies */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push('./LegalPolicy')}>
              
            <Icon name="document-text-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Legal & Policies</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() =>
              showModal(
                "Are you sure you want to logout?",
                true // Pass `isSignOut` as true
              )
            }
          >
            <Text style={styles.signOutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Unified Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)} // Close modal on back press
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalContent.title}</Text>
              <Text style={styles.modalText}>{modalContent.message}</Text>
              <View style={styles.buttonContainer}>
                {modalContent.isSignOut && (
                  <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                  >
                    <Text style={styles.signOutText}>Confirm</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>
                    {modalContent.isSignOut ? "Cancel" : "Close"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* <View style={styles.footer}>
          <Footer />
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  backButton: {
    marginRight: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    // marginBottom: 20,
    color: "#333",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  signOutButton: {
    // marginBottom: 50,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    borderRadius: 10,
    borderWidth:1.5,
    borderColor:"#00CFFF"
  },
  signOutText: {
    color: "#00CFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    alignSelf: "stretch",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    width: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 50,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#00CFFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

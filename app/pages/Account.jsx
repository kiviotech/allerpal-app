// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Switch,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
// import { SafeAreaView } from "react-native-web";
// import { useRouter } from "expo-router";
// import Footer from "./Footer";
// import useAuthStore from "../../useAuthStore";
// import { deleteToken } from "../../src/utils/storage";
// import useAllergyStore from "../../src/stores/allergyStore";

// const Account = () => {
//   const router = useRouter();
//   const logout = useAuthStore((state) => state.logout);
//   const clearAllergies = useAllergyStore((state) => state.clearAllergies);
//   const [isNotificationsEnabled, setNotificationsEnabled] =
//     React.useState(false);

//   const toggleSwitch = () =>
//     setNotificationsEnabled((previousState) => !previousState);

//   const handleSignOut = () => {
//     router.push("auth/Login");
//     logout();
//     clearAllergies();
//     deleteToken();
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.wrapper}>
//         <ScrollView contentContainerStyle={styles.container}>
//           <Text style={styles.title}>Account</Text>
//           <TouchableOpacity
//             style={styles.option}
//             onPress={() => router.push("./Profile")}
//           >
//             <Icon name="person-outline" size={24} color="#00CFFF" />
//             <Text style={styles.optionText}>My Profile</Text>
//             <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.option}>
//             <Icon name="lock-closed-outline" size={24} color="#00CFFF" />
//             <Text style={styles.optionText}>Change Password</Text>
//             <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.option}>
//             <Icon name="calendar-outline" size={24} color="#00CFFF" />
//             <Text style={styles.optionText}>My Bookings</Text>
//             <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
//           </TouchableOpacity>

//           <View style={styles.option}>
//             <Icon name="notifications-outline" size={24} color="#00CFFF" />
//             <Text style={styles.optionText}>Notifications</Text>
//             <Switch
//               trackColor={{ false: "#767577", true: "#00CFFF" }}
//               thumbColor={isNotificationsEnabled ? "#ffffff" : "#f4f3f4"}
//               ios_backgroundColor="#3e3e3e"
//               onValueChange={toggleSwitch}
//               value={isNotificationsEnabled}
//             />
//           </View>

//           <TouchableOpacity style={styles.option}>
//             <Icon name="language-outline" size={24} color="#00CFFF" />
//             <Text style={styles.optionText}>Language</Text>
//             <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.option}>
//             <Icon name="color-palette-outline" size={24} color="#00CFFF" />
//             <Text style={styles.optionText}>Theme</Text>
//             <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.option}>
//             <Icon name="document-text-outline" size={24} color="#00CFFF" />
//             <Text style={styles.optionText}>Legal & Policies</Text>
//             <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.signOutButton}
//             onPress={handleSignOut}
//           >
//             <Text style={styles.signOutText}>Sign Out</Text>
//           </TouchableOpacity>
//         </ScrollView>

//         <View style={styles.footer}>
//           <Footer />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   wrapper: {
//     flex: 1,
//     justifyContent: "space-between",
//   },
//   container: {
//     flexGrow: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#333",
//   },
//   option: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     marginBottom: 15,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//     marginTop: 10,
//   },
//   optionText: {
//     flex: 1,
//     marginLeft: 15,
//     fontSize: 16,
//     color: "#333",
//   },
//   signOutButton: {
//     marginTop: 20,
//     paddingVertical: 15,
//     alignItems: "center",
//     borderRadius: 10,
//     shadowColor: "#00CFFF",
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   signOutText: {
//     color: "#00CFFF",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   footer: {
//     alignSelf: "stretch",
//   },
// });

// export default Account;


import React, { useState } from "react";
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
import { Alert } from 'react-native';

const Account = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const clearAllergies = useAllergyStore((state) => state.clearAllergies);
  const [isNotificationsEnabled, setNotificationsEnabled] =
    React.useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // Added state for modal visibility
  const [modalMessage, setModalMessage] = useState(""); // Added state for modal message

  // Toggle notifications switch
  const toggleSwitch = () =>
    setNotificationsEnabled((previousState) => !previousState);

  // Handle modal visibility and message
  const showUnavailableMessage = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  // Handle sign out
  const handleSignOut = () => {
    router.push("auth/Login");
      logout();
      clearAllergies();
      deleteToken();
    }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Account</Text>

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
            onPress={() => showUnavailableMessage("My Bookings")}
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
                showUnavailableMessage("Notifications Settings")
              }
              value={isNotificationsEnabled}
            />
          </View>

          {/* Language */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => showUnavailableMessage("Language Settings")}
          >
            <Icon name="language-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Language</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          {/* Theme */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => showUnavailableMessage("Theme Settings")}
          >
            <Icon name="color-palette-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Theme</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          {/* Legal & Policies */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => showUnavailableMessage("Legal & Policies")}
          >
            <Icon name="document-text-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Legal & Policies</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal for Unavailable Pages */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)} // Close modal on back press
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                {modalMessage} Page is Currently Unavailable
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.footer}>
          <Footer />
        </View>
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
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 10,
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  signOutButton: {
    marginTop: 20,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#00CFFF",
    shadowRadius: 8,
    elevation: 5,
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

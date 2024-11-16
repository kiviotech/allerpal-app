import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-web";
import { useRouter } from "expo-router";
import Footer from "./Footer";
import useAuthStore from "../../useAuthStore";

const Account = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [isNotificationsEnabled, setNotificationsEnabled] =
    React.useState(false);

  const toggleSwitch = () =>
    setNotificationsEnabled((previousState) => !previousState);

  const handleSignOut = () => {
    router.push("../auth/Login");
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Account</Text>
          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push("./Profile")}
          >
            <Icon name="person-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>My Profile</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Icon name="lock-closed-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Change Password</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Icon name="calendar-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>My Bookings</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          <View style={styles.option}>
            <Icon name="notifications-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#00CFFF" }}
              thumbColor={isNotificationsEnabled ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isNotificationsEnabled}
            />
          </View>

          <TouchableOpacity style={styles.option}>
            <Icon name="language-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Language</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Icon name="color-palette-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Theme</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Icon name="document-text-outline" size={24} color="#00CFFF" />
            <Text style={styles.optionText}>Legal & Policies</Text>
            <Icon name="chevron-forward-outline" size={24} color="#00CFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <Footer />
        </View>
      </View>
    </SafeAreaView>
  );
};

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
});

export default Account;

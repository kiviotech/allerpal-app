import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const Footer = () => {
  const router = useRouter();
  const currentRoute = usePathname(); // Get the current active route

  // Helper function to check if the tab is active
  const isActiveTab = (route) => currentRoute === route;

  // Helper function to handle tab press
  const handleTabPress = (route) => {
    if (route) {
      router.push(route); // Navigate to the specified route
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress("/pages/Home")}
        >
          <Ionicons
            name={isActiveTab("/pages/Home") ? "home" : "home-outline"}
            size={24}
            color={isActiveTab("/pages/Home") ? "#00aced" : "#888"}
          />
          <Text
            style={[
              styles.footerText,
              isActiveTab("/pages/Home") && styles.activeFooterText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Search Tab */}
        {/* <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress("/pages/Search")}
        >
          <Ionicons
            name={isActiveTab("/pages/Search") ? "search" : "search-outline"}
            size={24}
            color={isActiveTab("/pages/Search") ? "#00aced" : "#888"}
          />
          <Text
            style={[
              styles.footerText,
              isActiveTab("/pages/Search") && styles.activeFooterText,
            ]}
          >
            Search
          </Text>
        </TouchableOpacity> */}

        {/* Community Tab */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress("/pages/Blog")}
        >
          <Ionicons
            name={isActiveTab("/pages/Blog") ? "newspaper" : "newspaper-outline"}
            size={24}
            color={isActiveTab("/pages/Blog") ? "#00aced" : "#888"}
          />
          <Text
            style={[
              styles.footerText,
              isActiveTab("/pages/Blog") && styles.activeFooterText,
            ]}
          >
            Blog
          </Text>
        </TouchableOpacity>

        {/* Chat Tab */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress("/pages/Chat")}
        >
          <Ionicons
            name={
              isActiveTab("/pages/Chat") ? "chatbubble" : "chatbubble-outline"
            }
            size={24}
            color={isActiveTab("/pages/Chat") ? "#00aced" : "#888"}
          />
          <Text
            style={[
              styles.footerText,
              isActiveTab("/pages/Chat") && styles.activeFooterText,
            ]}
          >
            Inbox
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress("/pages/Account")}
        >
          <Ionicons
            name={isActiveTab("/pages/Account") ? "person" : "person-outline"}
            size={24}
            color={isActiveTab("/pages/Account") ? "#00aced" : "#888"}
          />
          <Text
            style={[
              styles.footerText,
              isActiveTab("/pages/Account") && styles.activeFooterText,
            ]}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  activeFooterText: {
    color: "#00aced",
  },
});

export default Footer;

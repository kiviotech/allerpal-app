import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Login from "./auth/Login";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.splashText}>Allerpal</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return <Login />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Set a background color if needed
  },
  splashText: {
    fontSize: 32, // Changed to 32px for a larger splash text
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    fontFamily: "System", // Uses the system's default font
  },
});

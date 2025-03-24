import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

const PasswordChangedNotification = () => {
  const router = useRouter();

  // Automatically redirect to login after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/auth/Login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="checkmark-circle" size={100} color="#00CFFF" style={styles.icon} />
        
        <Text style={styles.title}>Password Changed!</Text>
        
        <Text style={styles.message}>
          Your password has been successfully reset. You can now login with your new password.
        </Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.replace("/auth/Login")}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#00CFFF",
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PasswordChangedNotification;

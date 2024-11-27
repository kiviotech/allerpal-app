import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import Successmark from "../../assets/Successmark.jpg"
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const { width, height } = Dimensions.get("window");

const PasswordChangedNotification = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push('./Login')
  }

  return (
    <View style={styles.container}> 
    <View style={{ alignItems: 'center',   marginTop: 50,}}>
        <Image source={Successmark} style={styles.imageStyle} />
      </View>

      <Text style={styles.textStyle}>Password Changed!</Text>
      <Text
        style={[
          styles.textStyle,
          { color: "gray", fontSize: 15, fontWeight: "500", marginBottom: 30 },
        ]}
      >
        Your password has been changed{" "}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.redirectButton} onPress={goToLogin}>
          <Text style={styles.redirectButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>

      {/* <CommonButton text="Back to Login" handlePress={goToLogin}/> */}
    </View>
  );
};

export default PasswordChangedNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes full height of the screen
    justifyContent: "center", // Centers content vertically
    // alignItems: 'center',
    backgroundColor: "#FFFFFF", // Optional: Set background color if needed
    padding: 15,
  },
  textStyle: {
    color: "#1E232C",
    textAlign: "center",
    fontFamily: "Montserrat",
    fontSize: 26,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 26,
    marginVertical: 5, // Add margin between texts
  },
  imageStyle: {
    marginBottom: 20, // Space between image and text
    resizeMode: "contain", // Ensures the image scales correctly
  },
  buttonContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  redirectButton: {
    justifyContent: 'center',
    backgroundColor: "#00D0DD",
    borderRadius: 28,
    padding: "4%",
    marginBottom: "5%",
    width: "50%",
    marginTop: "15%",
  },
  redirectButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: width < 360 ? 18 : 20,
    fontWeight: "bold",
  }
});

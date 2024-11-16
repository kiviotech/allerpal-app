import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { login } from "../../src/utils/auth";
import useAuthStore from "../../useAuthStore";

const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Optional loading state
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const gotoSignUp = () => {
    router.push("../auth/SignUp");
  };

  const handleLogin = async () => {
    let validationErrors = {};
    const { email, password } = formData;

    // Basic validation
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      validationErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      validationErrors.password = "Password should be at least 6 characters";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await login(email, password);
      console.log("Login response" + response);

      router.push("../pages/Home");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrors({ general: errorMessage });
      console.error("Login error:", error);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>LogIn</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
          />
        </View>
        <View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
          />
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <Text
          style={styles.forgot_password}
          onPress={() => router.push("../pages/ResetPassWord")}
        >
          Forgot Password
        </Text>

        <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
          <Text style={styles.signUpButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Don't have an account?{" "}
          <Text style={styles.loginLink} onPress={gotoSignUp}>
            SignUp
          </Text>
        </Text>

        {/* Social Buttons with Icons */}
        {/* <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.iconContainer}>
              <Icon name="facebook" size={30} color="blue" />
            </View>
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.iconContainer}>
              <Icon name="google" size={30} color="#DB4437" />
            </View>
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "5%",
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "10%",
  },
  title: {
    fontSize: width < 360 ? 26 : 35,
    fontWeight: "bold",
    marginBottom: "5%",
    width: "80%",
    textAlign: "left",
  },
  centeredTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "5%",
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  centeredText: {
    marginHorizontal: 10,
    fontSize: width < 360 ? 16 : 18,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: width < 360 ? 18 : 20,
    marginTop: "2%",
    marginBottom: "1%",
    textAlign: "left",
    width: "80%",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: "3%",
    fontSize: width < 360 ? 14 : 16,
  },
  signUpButton: {
    backgroundColor: "#007bff",
    borderRadius: 28,
    padding: "4%",
    marginBottom: "5%",
    width: "50%",
    marginTop: "5%",
  },
  signUpButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: width < 360 ? 14 : 16,
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    marginBottom: "5%",
    fontSize: width < 360 ? 14 : 16,
  },
  loginLink: {
    color: "#007bff",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "5%",
    width: "100%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,

    borderRadius: 5,
    padding: "3%",
    justifyContent: "center",
    marginHorizontal: "2.5%",
  },
  socialButtonText: {
    color: "#007bff",
    marginLeft: 5, // Space between icon and text
  },
  iconContainer: {
    //   backgroundColor: 'blue',
    borderRadius: "50%", // Make it round
    padding: 5, // Add padding for round effect
    justifyContent: "center",
    alignItems: "center",
  },
  forgot_password: {
    color: "#007bff",
    fontSize: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default Login;

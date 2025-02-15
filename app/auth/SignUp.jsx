import React, { useEffect, useState } from "react";
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
import { signup } from "../../src/utils/auth";
import useAuthStore from "../../useAuthStore";

const { width, height } = Dimensions.get("window");

const SignUp = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const jwt = useAuthStore((state) => state.jwt);

  useEffect(() => {
    if (jwt) {
      // Use a timeout to prevent the immediate state update
      const timer = setTimeout(() => {
        router.replace("/pages/Home");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [jwt, router]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    let validationErrors = {};
    const { fullName, email, password, confirmPassword } = formData;
  
    // Full Name validation: must be alphabetic or alphanumeric, not only numbers
    if (!fullName) {
      validationErrors.fullName = "Full Name is required";
    } else if (!/^(?!\d+$)[a-zA-Z0-9\s]+$/.test(fullName)) {
      validationErrors.fullName = "Full Name cannot be only numbers";
    }
  
    // Email validation
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      validationErrors.email = "Please enter a valid email address";
    }
  
    // Password validation
    if (!password) {
      validationErrors.password = "Password is required";
    } else if (/\s/.test(password)) {
      validationErrors.password = "Password should not contain spaces";
    } else if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(password)) {
      validationErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/\d/.test(password)) {
      validationErrors.password = "Password must contain at least one number";
    }
  
    // Confirm Password validation
    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
  
    // If there are validation errors, set them and exit
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    // Clear errors and proceed with signup
    setErrors({});
    setLoading(true);
  
    try {
      // Call the signup function
      const response = await signup(fullName, email, password);
  
      // If signup is successful, navigate to the AccountSetup page
      router.push("../pages/AccountSetup");
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again later.";
  
      if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.response?.data?.error?.message) {
        const backendMessage = error.response.data.error.message;
  
        if (backendMessage.includes("Email or Username are already taken")) {
          errorMessage = "Email or Username are already taken.";
        } else {
          errorMessage = backendMessage;
        }
      }
      setErrors({ general: errorMessage });
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const gotoLogin = () => {
    router.push("auth/Login");
  };
  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  
    // Clear the error for the specific field being updated
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field]; // Remove error for the current field
      return updatedErrors;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Sign Up</Text>

        {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

        {/* Input Fields with Labels and Error Messages */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor={"#B3B3B3"}
            value={formData.fullName}
            onChangeText={(value) => handleInputChange("fullName", value)}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={"#B3B3B3"}
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.input}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={"#B3B3B3"}
              secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword
              value={formData.password}
              style={styles.inputField}
              onChangeText={(value) => handleInputChange("password", value)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? "eye" : "eye-slash"}
                size={20}
                color="#B3B3B3"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.input}>
            <TextInput
              style={styles.inputField}
              placeholder="Re-enter your password"
              placeholderTextColor={"#B3B3B3"}
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showConfirmPassword ? "eye" : "eye-slash"}
                size={20}
                color="#B3B3B3"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginLink} onPress={gotoLogin}>
            Login
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: "5%",
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "10%",
    maxWidth: 500,
  },
  title: {
    fontSize: width < 360 ? 26 : 30,
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
    width: "100%", // Full width for the container
    alignItems: "center", // Center inputs within the container
  },
  label: {
    fontSize: width < 360 ? 16 : 18,
    marginTop: "2%",
    marginBottom: "1%", // Reduced margin to align with input
    textAlign: "left", // Align label to the left
    width: "80%", // Set width to match input width
  },
  input: {
    width: "80%", // Full width input
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: "3%",
    fontSize: width < 360 ? 14 : 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputField: {
    width: "90%", // Full width input
    outlineStyle: "none", // Removes focus outline
  },
  signUpButton: {
    backgroundColor: "#00D0DD",
    borderRadius: 28,
    padding: "4%",
    marginBottom: "5%",
    width: "50%", // Full width button
    marginTop: "10%",
  },
  signUpButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: width < 360 ? 18 : 20,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: '5%',
    textAlign: "center",
    marginBottom: "5%",
    fontSize: width < 360 ? 16 : 18,
  },
  loginLink: {
    color: "#00D0DD",
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

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
});

export default SignUp;

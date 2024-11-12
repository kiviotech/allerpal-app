

// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useRouter } from 'expo-router';


// const { width, height } = Dimensions.get('window');

// const SignUp = ({ navigation }) => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [errors, setErrors] = useState({});

//   const router = useRouter();

//   // Helper function to validate email format
//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSignUp = () => {
//     let validationErrors = {};
//     const { fullName, email, password, confirmPassword } = formData;

//     // Basic validation
//     if (!fullName) {
//       validationErrors.fullName = 'Full Name is required';
//     }

//     if (!email) {
//       validationErrors.email = 'Email is required';
//     } else if (!isValidEmail(email)) {
//       validationErrors.email = 'Please enter a valid email address';
//     }

//     if (!password) {
//       validationErrors.password = 'Password is required';
//     } else if (password.length < 6) {
//       validationErrors.password = 'Password should be at least 6 characters';
//     }

//     if (!confirmPassword) {
//       validationErrors.confirmPassword = 'Confirm Password is required';
//     } else if (password !== confirmPassword) {
//       validationErrors.confirmPassword = 'Passwords do not match';
//     }

//     // Set errors if there are any
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     // If no errors, navigate to the AccountSetup page
//     setErrors({});
//     router.push('../pages/AccountSetup');
//   };

//   const gotoLogin = () => {
//     router.push('../auth/Login');
//   };

//   // Function to handle text input change and update formData
//   const handleInputChange = (field, value) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [field]: value,
//     }));
//   };

// !==================================================================================


import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { signup } from '../../src/utils/auth';
import useAuthStore from '../../useAuthStore';



const { width, height } = Dimensions.get('window');

const SignUp = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    let validationErrors = {};
    const { fullName, email, password, confirmPassword } = formData;

    // Basic validation
    if (!fullName) {
      validationErrors.fullName = 'Full Name is required';
    }
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      validationErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      validationErrors.password = 'Password is required';
    } else if (password.length < 6) {
      validationErrors.password = 'Password should be at least 6 characters';
    }
    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Call the signup function from auth.js
      const response = await signup(fullName, email, password);

      console.log(response);

      // If signup is successful, navigate to the AccountSetup page
      router.push('../pages/AccountSetup');
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'Signup failed. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const gotoLogin = () => {
    router.push('../auth/Login');
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Input Fields with Labels and Error Messages */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={gotoLogin}>
            Login
          </Text>
        </Text>

        <View style={styles.centeredTextContainer}>
          <View style={styles.line} />
          <Text style={styles.centeredText}>SIGN UP</Text>
          <View style={styles.line} />
        </View>

        {/* Social Buttons with Icons */}
        <View style={styles.socialButtons}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ~======================================================================================





const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: '5%',
      width: '100%',
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: '10%',
    },
    title: {
      fontSize: width < 360 ? 26 : 30,
      fontWeight: 'bold',
      marginBottom: '5%',
      width:'80%',
      textAlign: 'left',
    },
    centeredTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: '5%',
      width: '100%',
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: '#ccc',
    },
    centeredText: {
      marginHorizontal: 10,
      fontSize: width < 360 ? 16 : 18,
      fontWeight: 'bold',
    },
    inputContainer: {
      width: '100%', // Full width for the container
      marginBottom: '3%',
      alignItems: 'center', // Center inputs within the container
      marginTop:'5%'
    },
    label: {
      fontSize: width < 360 ? 16 : 18,
      marginTop:'2%',
      marginBottom: '1%', // Reduced margin to align with input
      textAlign: 'left', // Align label to the left
      width: '80%', // Set width to match input width
    },
    input: {
      width: '80%', // Full width input
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: '3%',
      fontSize: width < 360 ? 14 : 16,
    },
    signUpButton: {
      backgroundColor: '#007bff',
      borderRadius: 28,
      padding: '4%',
      marginBottom: '5%',
      width: '50%', // Full width button
      marginTop:'5%'
    },
    signUpButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: width < 360 ? 14 : 16,
      fontWeight: 'bold',
    },
    loginText: {
      textAlign: 'center',
      marginBottom: '5%',
      fontSize: width < 360 ? 14 : 16,
    },
    loginLink: {
      color: '#007bff',
    },
    socialButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: '5%',
      width: '100%',
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
     
      borderRadius: 5,
      padding: '3%',
      justifyContent: 'center',
      marginHorizontal: '2.5%',
    },
    socialButtonText: {
      color: '#007bff',
      marginLeft: 5, // Space between icon and text
    },
    iconContainer: {
    //   backgroundColor: 'blue',
      borderRadius: '50%', // Make it round
      padding: 5, // Add padding for round effect
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    
    errorText:{
      color: 'red',
      fontSize: 16,
      marginTop: 5,
      textAlign: 'left',
      marginLeft: 10,
    }
  });
  
export default SignUp;

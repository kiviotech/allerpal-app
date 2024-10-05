import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton/CustomButton';
import colors from '../../constants/colors';
import icons from '../../constants/icons';
import CustomCheckbox from '../../components/customCheckbox/CustomCheckbox';
import fonts from '../../constants/fonts';
import { getAllergies } from '../../src/api/repositories/allergyRepository'; // Import the getAllergies function
import { router, useLocalSearchParams } from 'expo-router';
import { signup } from '../../src/utils/auth';
import { createUserAllergy } from '../../src/api/repositories/userAllergyRepository';

const AllergyInformation = () => {

  const { name, email } = useLocalSearchParams(); // Access the passed parameters from router.query

  const [allergies, setAllergies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for handling error messages (e.g. email already exists)
  const [password, setPassword] = useState(''); // State for password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [passwordError, setPasswordError] = useState(null); // State for password mismatch error
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for toggling password visibility
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // State for toggling confirm password visibility


  // Fetch allergies from the backend on component mount
  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const response = await getAllergies();
        const allergiesData = response.data.data.reduce((acc, allergy) => {
          acc[allergy.name] = { id: allergy.id, checked: false }; // Initialize each allergy as not checked (false)
          return acc;
        }, {});
        setAllergies(allergiesData); // Set allergies from backend response
        setLoading(false);
      } catch (error) {
        setError('Failed to load allergies.');
        setLoading(false);
      }
    };

    fetchAllergies();
  }, []);

  const toggleSwitch = (key) => {
    setAllergies(prevAllergies => ({
      ...prevAllergies,
      [key]: {
        ...prevAllergies[key],
        checked: !prevAllergies[key].checked // Toggle the checked value
      }
    }));
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (confirmPassword && text !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (password && text !== password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError(null);
    }
  };

  const handleSubmit = async () => {
    if (password === confirmPassword && !passwordError) {
      try {
        // Register the user using the signup API
        const response = await signup(name, email, password);
        console.log('Signup successful', response);
        setError('Account created successfully! Redirecting to login...');

        // After signup, post the user's allergies to the backend
        const selectedAllergies = Object.keys(allergies)
          .filter(key => allergies[key].checked) // Only include allergies that are checked
          .map(key => allergies[key].id); // Get the allergy IDs

        // Prepare the payload for posting allergies
        const allergyPayload = {
          data: {
            user: [response.user.id], // Assuming response contains user ID
            allergies: selectedAllergies, // Allergies selected by the user
            custom_description: "Any custom description", // You can add more details if needed
            locale: "en", // Assuming locale is 'en', update if needed
          }
        };

        // Send the user allergies to the backend
        try {
          const allergyResponse = await createUserAllergy(allergyPayload);
          console.log('Allergy information submitted:', allergyResponse);

          setTimeout(() => {
            router.replace('/(auth)/login'); // Navigate to the login page after submission
          }, 2000); // Wait for 2 seconds before redirecting
        } catch (allergyError) {
          console.error('Error submitting allergies:', allergyError);
          setError('Failed to submit allergy information.');
        }

      } catch (error) {
        // Handle error due to existing email or other issues
        if (error.response && error.response?.data?.error?.status === 400) {
          const errorMessage = error.response.data.error.message;
          if (errorMessage.includes('Email or Username are already taken')) {
            setError('The email address is already registered.');
          } else {
            setError('An error occurred. Please try again.');
          }
        } else {
          console.error('Error signing up:', error.message);
          setError('An unexpected error occurred.');
        }
      }
    }
  };


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggle password visibility state
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible); // Toggle confirm password visibility state
  };

  const gotoMyAllergyInfoPage = () => {
    // Handle navigation or submission here
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={icons.user} style={styles.userImage} />
        <Text style={styles.header}>My Allergy Information</Text>
        <View style={styles.buttonContainer}>
          <CustomButton borderRadius={15}
            buttonStyle={{ backgroundColor: colors.primary }}
            text='Allergens Affinity' textStyle={{ fontSize: 14, fontFamily: fonts.inter400, color: colors.loginPageTextColor }}
            onPress={gotoMyAllergyInfoPage}
          />
        </View>
        <View style={styles.allergensContainer}>
          {Object.keys(allergies).map((key, index) => (
            <View key={index} style={styles.checkboxContainer}>
              <CustomCheckbox
                isChecked={allergies[key].checked}  // Use 'checked' property from allergies object
                onPress={() => toggleSwitch(key)}  // Toggle checkbox state
                height={21}
                width={23}
              />
              <Text style={styles.checkboxLabel}>{key}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.allergensContainer, { marginTop: -10, width: '100%' }]}>
          <Text style={{ fontSize: 12, fontFamily: 'Inter_700Bold', color: colors.blackColor, }}>If others Please Specify</Text>
          <TextInput
            style={[styles.textInput, { marginTop: 5 }]}
            placeholder="If others, please specify"
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={4} // You can adjust this value based on your preference
          />
        </View>

        {/* Password Fields */}
        <View style={[styles.passwordContainer, { marginTop: -20 }]}>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Select Password"
              secureTextEntry={!isPasswordVisible} // Toggle visibility
              value={password}
              onChangeText={handlePasswordChange}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.toggleButton}>
              <Text style={styles.toggleText}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.passwordContainer, { marginTop: 10 }]}>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password"
              secureTextEntry={!isConfirmPasswordVisible} // Toggle visibility
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
            />
            <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.toggleButton}>
              <Text style={styles.toggleText}>{isConfirmPasswordVisible ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Show password mismatch error */}
        {passwordError && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}

        {/* Show email or other signup errors */}
        {error && (
          <Text style={styles.errorText}>{error}</Text> // Now placed between confirm password and create account button
        )}

        <View style={[styles.buttonContainer, { marginTop: 10 }]}>
          <CustomButton
            buttonStyle={{ backgroundColor: colors.secondary }}
            textStyle={{ fontSize: 14, fontFamily: fonts.inter400, color: colors.background }}
            text='Create Account'
            onPress={handleSubmit}
          />
        </View>
        <View style={styles.privicyPolicy}>
          <Image source={icons.privacy}></Image>
          <Text style={{ color: colors.primary, marginTop: -10, marginLeft: -8 }}>Privacy Policy</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllergyInformation;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  userImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginBottom: 20,
  },
  header: {
    fontSize: 15,
    fontFamily: fonts.inter400,
    color: colors.loginPageTextColor,
    marginBottom: 20,
  },
  allergensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 30
  },
  checkboxContainer: {
    width: '30%', // 30% width ensures three items per row with space for margins
    marginBottom: 10, // Spacing between rows
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkboxLabel: {
    marginLeft: 8,
    marginTop: 5,
    fontSize: 12,
    fontFamily: fonts.inter400,
    color: colors.blackColor,
  },
  textInput: {
    width: '100%',
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: colors.text,
    padding: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 15, // Align the "Show/Hide" text inside the input box
  },
  toggleText: {
    color: colors.primary,
    fontSize: 16,
  },
  privicyPolicy: {},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});

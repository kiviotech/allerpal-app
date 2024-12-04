import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { forgotPassword } from '../../src/utils/auth';

const ResetPassword = () => {
  const [email, setEmail] = useState(''); // State for email input
  const [loader, setLoader] = useState(false); // State for loader during API call
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errors, setErrors] = useState(''); // State for error messages

  // Form validation function
  const validateForm = () => {
    if (!email) {
      setErrors('Email is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors('Please enter a valid email address.');
      return false;
    }
    setErrors(''); // Clear errors if validation passes
    return true;
  };

  // Function to handle password reset
  const handlePasswordReset = async () => {
    const isValid = validateForm();
    if (isValid) {
      setLoader(true);
      setSuccessMessage('');
      try {
        const response = await forgotPassword(email); // Pass the email directly
        if (response) {
          setSuccessMessage(
            'We have sent a password reset link to your email address. Please check your inbox and click the link to reset your password.'
          );
        }
      } catch (error) {
        console.error('Error:', error.message);
        Alert.alert('Error', 'Failed to send reset link. Please try again.');
      } finally {
        setLoader(false);
      }
    } else {
      console.log('Form is not valid', errors);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Please enter your email address to request a password reset
        </Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {errors ? <Text style={styles.errorText}>{errors}</Text> : null}

        {successMessage ? (
          <Text style={styles.successMessage}>{successMessage}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
          {loader ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send new password</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  innerContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#808080',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#808080',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00c4cc',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
});

export default ResetPassword;
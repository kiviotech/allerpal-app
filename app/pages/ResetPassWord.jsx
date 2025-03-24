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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { forgotPassword } from '../../src/utils/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { useToast } from '../ToastContext';

const ResetPassword = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

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
    setErrors('');
    return true;
  };

  const handlePasswordReset = async () => {
    if (!validateForm()) return;

    setLoader(true);
    setSuccessMessage('');
    try {
      await forgotPassword(email);
      
      // Show success message
      const successMsg = 'Password reset link sent! Please check your email and follow the instructions.';
      setSuccessMessage(successMsg);
      showToast(successMsg, 'success');
      
      // Disable button to prevent multiple requests
      setButtonDisabled(true);
      
      // Optional: Navigate back after a delay
      setTimeout(() => {
        router.replace('/auth/Login');
      }, 5000);
    } catch (error) {
      console.error('Error:', error);
      
      // Handle different error cases
      let errorMsg = 'Failed to send reset link. Please try again.';
      
      if (error.response?.data?.error) {
        // If we have a specific error message from the API, use it
        const apiError = error.response.data.error;
        if (apiError.message.includes('email') || apiError.message.includes('not found')) {
          errorMsg = 'We could not find a user with that email address.';
        } else {
          errorMsg = apiError.message;
        }
      }
      
      setErrors(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoader(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back-outline" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Forgot Password</Text>
        </View>
        
        <View style={styles.innerContainer}>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
          </Text>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {errors ? <Text style={styles.errorText}>{errors}</Text> : null}
          {successMessage ? (
            <View style={styles.successContainer}>
              <Icon name="checkmark-circle" size={20} color="#2ecc71" style={{ marginRight: 8 }} />
              <Text style={styles.successMessage}>{successMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, buttonDisabled && styles.disabledButton]}
            onPress={handlePasswordReset}
            disabled={buttonDisabled || loader}
          >
            {loader ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => router.replace('/auth/Login')}
          >
            <Text style={styles.loginLinkText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  innerContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    color: '#777',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  inputContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  button: {
    backgroundColor: '#00CFFF',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#7AD7F0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 15,
    alignSelf: 'flex-start',
    width: '100%',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f8f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  successMessage: {
    color: '#2ecc71',
    fontSize: 14,
    flex: 1,
  },
  loginLink: {
    marginTop: 30,
  },
  loginLinkText: {
    color: '#00CFFF',
    fontSize: 16,
  },
});

export default ResetPassword;

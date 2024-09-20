import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import LoginField from '../../components/LoginField';
import { useRouter } from 'expo-router';
import { NativeWindStyleSheet } from "nativewind";
import colors from '../../constants/colors';
import UserImageCommon from '../../components/UserImage/UserImageCommon';
import { SafeAreaView } from 'react-native-safe-area-context';
import fonts from '../../constants/fonts';
import { useNavigation } from '@react-navigation/native'; // Import the hook

NativeWindStyleSheet.setOutput({
  default: "native",
});

const Login = () => {
  const navigation = useNavigation(); // Use the hook to get navigation object
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const submit = async (action) => {
    try {
      if (action === 'SignUp') {
        // Navigate to the Sign Up page
        router.replace('/signup');
      } else {
        // Handle login action
        router.replace('/home');
      }
    } catch (error) {
      console.error('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.container}>
          <UserImageCommon shapeWidth={250} shapeHeight={250} />
          <View style={styles.content}>
            <Text style={styles.header}>Login</Text>
            <View style={styles.inputContainer}>
              <LoginField
                placeholder="UserName/ Email Id"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                keyboardType='email-address'
                style={styles.loginField}
              />


              <View style={styles.passwordContainer}>
                <LoginField
                  placeholder="Password"
                  value={form.password}
                  handleChangeText={(e) => setForm({ ...form, password: e })}
                  secureTextEntry={true}
                  style={styles.loginField}
                />
              </View>

              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                buttonStyle={{ fontSize: 13 }}
                text='Log In'
                onPress={() => submit('login')}
              />
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.dontHaveAnAccount}>
                Don’t Have an Account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('(auth)/signup')}>
                <Text style={styles.createAccountText}> Create New Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 16,
    padding: 15,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 32,
    color: '#006E75',
    fontSize: 15,
    fontFamily: fonts.inter400,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  passwordContainer: {
    marginTop: 32,
  },
  loginField: {
    marginBottom: 16,
  },
  forgotPasswordText: {
    marginTop: 35,
    fontFamily: fonts.inter400,
    textAlign: 'center',
    color: colors.loginPageTextColor,
  },
  dontHaveAnAccount: {
    color: colors.loginPageTextColor,
    textAlign: 'center',
    fontFamily: fonts.inter400,
  },
  createAccountText: {
    marginTop: 4,
    marginLeft: -8,
    fontSize: 16,
    fontFamily: fonts.inter400,
    textAlign: 'center',
    color: colors.loginPageTextColor,
  },
  buttonContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
});

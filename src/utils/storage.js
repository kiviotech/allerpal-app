import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = () => {
  const token = AsyncStorage.getItem("jwt");
  return token;
};

// Function to save JWT token
export const saveToken = async (token) => {
  await AsyncStorage.setItem('jwt', token);
};

// Function to save user ID
export const saveUserId = async (userId) => {
  await AsyncStorage.setItem('userId', userId.toString());
};

// Function to remove JWT and user ID from storage (logout)
export const deleteToken = async () => {
  await AsyncStorage.removeItem('jwt');
  await AsyncStorage.removeItem('userId');
};
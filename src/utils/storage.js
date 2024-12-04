import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get the JWT token
export const getToken = () => {
  return AsyncStorage.getItem("authToken");
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

// Generic function to save data to AsyncStorage
export const saveToStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving data to AsyncStorage:", error);
  }
};

// Generic function to retrieve data from AsyncStorage
export const getFromStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Error retrieving data from AsyncStorage:", error);
  }
};

// Function to save recent searches
export const saveRecentSearch = async (searchQuery) => {
  try {
    const currentSearches = await getFromStorage('recentSearches');
    const updatedSearches = [searchQuery, ...currentSearches.filter((q) => q !== searchQuery)].slice(0, 10); // Limit to 10 unique recent searches
    await saveToStorage('recentSearches', updatedSearches);
  } catch (error) {
    console.error("Error saving recent search:", error);
  }
};

// Function to get recent searches
export const getRecentSearches = async () => {
  return getFromStorage('recentSearches');
};

// Function to save recent views
export const saveRecentView = async (viewItem) => {
  try {
    const currentViews = await getFromStorage('recentViews');
    const updatedViews = [viewItem, ...currentViews.filter((item) => item.id !== viewItem.id)].slice(0, 10); // Limit to 10 unique recent views
    await saveToStorage('recentViews', updatedViews);
  } catch (error) {
    console.error("Error saving recent view:", error);
  }
};

// Function to get recent views
export const getRecentViews = async () => {
  return getFromStorage('recentViews');
};

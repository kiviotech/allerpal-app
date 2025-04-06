import AsyncStorage from '@react-native-async-storage/async-storage';

// Get storage based on platform
const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
      removeItem: (key) => localStorage.removeItem(key)
    };
  } else {
    return AsyncStorage;
  }
};

// Function to get JWT token
export const getToken = async () => {
  const storage = getStorage();
  return storage.getItem('authToken');
};

// Function to save JWT token
export const saveToken = async (token) => {
  const storage = getStorage();
  await storage.setItem('authToken', token);
};

// Function to save user ID
export const saveUserId = async (userId) => {
  const storage = getStorage();
  await storage.setItem('userId', userId.toString());
};

// Function to remove JWT and user ID from storage (logout)
export const deleteToken = async () => {
  const storage = getStorage();
  await storage.removeItem('jwt');
  await storage.removeItem('userId');
};

// Generic function to save data to storage
export const saveToStorage = async (key, value) => {
  try {
    const storage = getStorage();
    await storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving data to storage:", error);
  }
};

// Generic function to retrieve data from storage
export const getFromStorage = async (key) => {
  try {
    const storage = getStorage();
    const value = await storage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Error retrieving data from storage:", error);
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

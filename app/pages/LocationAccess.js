import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useLocation } from '../../src/contexts/LocationContext';

import dashboard from "../../assets/dashboard.png";

const LocationAccess = () => {
  const router = useRouter();
  const { userLocation, locationError, isLoadingLocation, updateUserLocation } = useLocation();
  const [hasAttemptedLocation, setHasAttemptedLocation] = useState(false);

  useEffect(() => {
    if (userLocation && hasAttemptedLocation) {
      // Location obtained successfully, navigate to main screen
      router.replace('pages/Home');
    }
  }, [userLocation, hasAttemptedLocation, router]);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    const apiKey = "105569388191333297585x44477"; // Replace with your geocode.xyz API key
    try {
      const response = await fetch(
        `https://geocode.xyz/${latitude},${longitude}?json=1&auth=${apiKey}`
      );
      const data = await response.json();
      if (data.error) {
        return "Address not found";
      } else {
        return data.standard.addresst; // Adjust this based on the response structure
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    }
  };

  // Example Usage
  (async () => {
    const latitude = 40.7128; // Example latitude
    const longitude = -74.006; // Example longitude

    const address = await getAddressFromCoordinates(latitude, longitude);
    console.log("Address:", address);
  })();

  const handleEnableLocation = async () => {
    setHasAttemptedLocation(true);
    try {
      await updateUserLocation();
    } catch (error) {
      if (Platform.OS === 'web') {
        // Web-specific error handling
        if (error.message.includes('permission denied')) {
          Alert.alert(
            'Location Access Denied',
            'Please allow location access in your browser settings to find restaurants near you.',
            [{ text: 'OK' }]
          );
        } else if (error.message.includes('not supported')) {
          Alert.alert(
            'Browser Not Supported',
            'Your browser does not support geolocation. Please try a different browser.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Location Error',
            'Unable to get your location. Please check your browser settings and try again.',
            [{ text: 'OK' }]
          );
        }
      } else {
        // Native platform error handling
        Alert.alert(
          'Location Access Required',
          'Please enable location access in your device settings to find restaurants near you.',
          [
            { text: 'Not Now', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
      }
    }
  };

  const handleSkipLocation = () => {
    Alert.alert(
      'Limited Functionality',
      'Without location access, you won\'t be able to see restaurants near you or get distance information.',
      [
        { text: 'Enable Location', onPress: handleEnableLocation },
        { text: 'Continue Anyway', onPress: () => router.replace('pages/Home') }
      ]
    );
  };

  const renderLocationMessage = () => {
    if (Platform.OS === 'web') {
      return 'Allow location access in your browser to find restaurants near you';
    }
    return 'Enable location access to discover allergen-friendly restaurants in your area';
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      {/* Background Image with Blur */}
      <ImageBackground
        source={dashboard} // Replace with your background image path
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
        blurRadius={10}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Find Restaurants Near You</Text>

            <View style={styles.imageContainer}>
              <Image
                source={require("../../assets/Location.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* Description */}
            <View>
              <Text style={styles.description}>
                {renderLocationMessage()}
              </Text>
            </View>

            {isLoadingLocation && hasAttemptedLocation ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Getting your location...</Text>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.enableButton}
                  onPress={handleEnableLocation}
                >
                  <Text style={styles.buttonText}>
                    {Platform.OS === 'web' ? 'Allow Location Access' : 'Enable Location'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkipLocation}
                >
                  <Text style={styles.skipButtonText}>Skip for Now</Text>
                </TouchableOpacity>
              </View>
            )}

            {locationError && (
              <Text style={styles.errorText}>
                {Platform.OS === 'web'
                  ? 'Please allow location access in your browser settings'
                  : 'Error accessing location. Please try again.'}
              </Text>
            )}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    width: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    height: "100%", // Centers the container inside the image
  },
  imageStyle: {
    opacity: 0.3, // Optional: You can adjust this value to make the image more transparent if needed
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#fff", // White background for the location container
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderColor: "black", // Black border around the container
    borderWidth: 1, // Optional: Border width for the black border
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageContainer: {
    width: "90%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 150,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  enableButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '80%',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LocationAccess;

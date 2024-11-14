

import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, ImageBackground, TouchableOpacity, Alert,StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import {useRouter} from 'expo-router'


import dashboard from '../../assets/dashboard.png';


const LocationAccessScreen = () => {
  const router = useRouter()
  const [location, setLocation] = useState(null);


  const getAddressFromCoordinates = async (latitude, longitude) => {
    const apiKey = '105569388191333297585x44477'; // Replace with your geocode.xyz API key
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
  
  const handleEnableLocation = async () => {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to access your location.');
      return;
    }
  
    // Get the current location
    try {
      console.log("Fetching location...");
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeout: 10000,
      });
      console.log("Location fetched:", currentLocation);
      setLocation(currentLocation);
  
      // Get the latitude and longitude
      const { latitude, longitude } = currentLocation.coords;
  
      // Fetch the address based on coordinates
      const address = await getAddressFromCoordinates(latitude, longitude);
      console.log("Address:", address);
  
      // Show address in an alert
      Alert.alert(
        'Location Enabled', 
        `Latitude: ${latitude}, Longitude: ${longitude}\nAddress: ${address}`
      );

      // router.push('./Home', { state: { address } }); 
      router.push(`./Home?address=${encodeURIComponent(address)}`);


    } catch (error) {
      Alert.alert('Location Error', 'Unable to fetch location. Please try again.');
      console.log('Error fetching location:', error);
    }
    
  };
  
  
  

  return (
    <SafeAreaView style={styles.AreaContainer}>
      {/* Background Image with Blur */}
      <ImageBackground 
        source= {dashboard} // Replace with your background image path
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
        blurRadius={10}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            
            <Text style={styles.title}>Location Access</Text>

           
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/Location.png')}  
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* Description */}
           <View>
           <Text style={styles.description}>
              To search for best nearby Restaurants, we would want to know your current location
            </Text>
           </View>

            {/* Enable Location Button */}
            <TouchableOpacity style={styles.button} onPress={handleEnableLocation}>
              <Text style={styles.buttonText}>Enable Location Services</Text>
            </TouchableOpacity>
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
    width: '100%',
    justifyContent: 'center',
    height:'100%', // Centers the container inside the image
  },
  imageStyle: {
    opacity: 0.3,  // Optional: You can adjust this value to make the image more transparent if needed
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',  // White background for the location container
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderColor: 'black',  // Black border around the container
    borderWidth: 1,  // Optional: Border width for the black border
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#006E75',
    marginBottom: 15,
  },
  imageContainer: {
    width: '90%',
    borderWidth: 1,
  
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 150,
  },
  description: {
    fontSize: 15,
    color: '#006E75',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00D0DD',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LocationAccessScreen;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

const Disclaimer = () => {
  const router = useRouter();
  
  return (
    <ImageBackground
      source={require('../../assets/img.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
       <BlurView style={StyleSheet.absoluteFill} intensity={50} />
      
      <View style={styles.container}>
        <Text style={styles.title}>Disclaimer</Text>

        <View style={styles.content}>
          <View style={styles.textRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.text}>
              Please be advised that Allerpal's recommendations are based solely on the 14 allergens recognized under UK law, as this is the standard information provided by restaurants.
            </Text>
          </View>
          
          <View style={styles.textRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.text}>
              We understand that many people have severe allergies beyond these 14, and we're committed to advocating for broader allergen awareness and supporting real change in allergy care in the future.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('./FinishSetup')}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// !==========================================================================================================================



const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width:'100%',
    height:'100%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent overlay to improve text readability
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    padding: 20,
    backgroundColor: '#f0f0f0', // Content area background color
    borderRadius: 10,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 20,
    marginRight: 8,
    lineHeight: 24,
  },
  text: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '40%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Disclaimer;

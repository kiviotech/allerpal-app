



import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SwitchToggle from 'react-native-switch-toggle';

const FinishSetUp = () => {
  const router = useRouter();
  const [allergens, setAllergens] = useState({
    Celery: false,
    Eggs: false,
    'Cereals containing gluten': false,
    Lupin: false,
    Mustard: false,
    Milk: false,
    Peanuts: false,
    Sesame: false,
    'Sulphur dioxide/Sulphites': false,
    Soyabeans: false,
    'Molluscs (such as mussels and oysters)': false,
    'Crustaceans (such as prawns, crabs and lobsters)': false,
    'Tree nuts (such as almonds, hazelnuts, walnuts)': false,
  });
  const [excludeMayContain, setExcludeMayContain] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const toggleAllergen = (key) => {
    setAllergens((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  
  const isAnyAllergenSelected = Object.values(allergens).some((isSelected) => isSelected);

  const handleFinishSetup = () => {
    if (isAnyAllergenSelected && termsAccepted) {
      console.log("Allergy profile saved", allergens);
    } else {
      alert("Please accept the terms and conditions");
    }
    router.push('./Home');
  };

  const allergenImages = {
    Celery: require('../../assets/celery.png'),
    Eggs: require('../../assets/eggs.png'),
    'Cereals containing gluten': require('../../assets/cereals.png'),
    Lupin: require('../../assets/lupin.png'),
    Mustard: require('../../assets/mustard.png'),
    Milk: require('../../assets/milk.png'),
    Peanuts: require('../../assets/peanuts.png'),
    Sesame: require('../../assets/sesame.png'),
    'Sulphur dioxide/Sulphites': require('../../assets/sulphur.png'),
    Soyabeans: require('../../assets/soyabeans.png'),
    'Molluscs (such as mussels and oysters)': require('../../assets/mollusca.png'),
    'Crustaceans (such as prawns, crabs and lobsters)': require('../../assets/crustaceans.png'),
    'Tree nuts (such as almonds, hazelnuts, walnuts)': require('../../assets/treenuts.png'),
  };

  const allergenKeys = Object.keys(allergens);
  const mainAllergens = allergenKeys.slice(0, -3);
  const lastThreeAllergens = allergenKeys.slice(-3);

  const CustomCheckBox = ({ checked, onPress }) => (
    <TouchableOpacity style={[styles.checkBox, checked && styles.checkBoxSelected]} onPress={onPress}>
      {checked && <Ionicons name="checkmark" size={16} color="#00c4cc" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('./AccountSetup')} style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        Select your allergens to create and save your personalized allergy profile. Allerpal will give you recommendations based on this information so please fill out carefully.
      </Text>

      <View style={styles.allergensContainer}>
        <View style={styles.checkboxContainer}>
          {mainAllergens.map((key) => (
            <View key={key} style={styles.checkboxRow}>
              <CustomCheckBox checked={allergens[key]} onPress={() => toggleAllergen(key)} />
              <View style={styles.imageiconContainer}>
                <Image source={allergenImages[key]} style={styles.icon} />
                <Text style={styles.checkboxLabel}>{key}</Text>
              </View>
            </View>
          ))}
          {lastThreeAllergens.map((key) => (
            <View key={key} style={styles.singleAllergenRow}>
              <CustomCheckBox checked={allergens[key]} onPress={() => toggleAllergen(key)} />
              <View style={styles.imageiconContainer}>
                <Image source={allergenImages[key]} style={styles.icon1} />
                <Text style={styles.checkboxLabel}>{key}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.toggleLabel}>
          Do you wish to EXCLUDE dishes that ‘MAY CONTAIN’ the selected Allergies
        </Text>
        <SwitchToggle
          switchOn={excludeMayContain}
          onPress={() => setExcludeMayContain(!excludeMayContain)}
          circleColorOff="#bbb"
          circleColorOn="#00c4cc"
          backgroundColorOn="#e0f7fa"
          backgroundColorOff="#ddd"
          containerStyle={styles.switchToggleContainer}
          circleStyle={styles.switchCircle}
        />
        <Text style={styles.switchText}>{excludeMayContain ? 'Yes' : 'No'}</Text>
      </View>

      <TouchableOpacity style={[styles.button, !(termsAccepted && isAnyAllergenSelected) && styles.buttonDisabled]} onPress={handleFinishSetup}>
        <Text style={styles.buttonText}>Finish Setup</Text>
      </TouchableOpacity>

      <View style={styles.termsContainer}>
        <CustomCheckBox checked={termsAccepted} onPress={() => setTermsAccepted(!termsAccepted)} />
        <Text style={styles.termsText}>
        By ticking this box, I confirm that I have read, understood, and agree to the terms outlined in this User Agreement and Legal Disclaimer. I accept full responsibility for verifying all allergen-related information and assume all risks associated with dining out with food allergies.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: '3%',
  },
  backButtonContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    color: '#333',
   
    marginTop: '19%',
  },
  allergensContainer: {
    
    borderRadius: 8,
    padding: 16,
   marginTop:'10%',
   width:'100%'
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
 
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '38%',
    marginBottom: 10,
    gap:'3%'
  },
  singleAllergenRow: { 
    flexDirection: 'row',
     alignItems: 'center',
      width: '100%', 
      marginTop:10,
     
    }, // Last three allergens in full width
 
  checkboxLabel: {
    fontSize: 12,
    color: '#555',
  },
  checkboxLabel1:{
    marginLeft:10,
    color: '#555',
    fontSize: 12,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#00c4cc',
    marginRight: 10,
    flex: 1, 
fontWeight:'bold'
  },
  switchToggleContainer: {
    width: 50,
    height: 25,
    borderRadius: 25,
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  switchText: {
    marginLeft: 10, 
    fontSize: 14,
    color: '#00c4cc',
    fontWeight:'bold'
  },
  button: {
    backgroundColor: '#00c4cc',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    marginTop:'10%'
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsContainer: {
    flexDirection: 'row',
    
    marginTop: '13%',
  },
  termsText: {
    fontSize: '90%',
    color: '#555',
    flex: 1,
    marginLeft: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align switch and text vertically
    marginTop:'10%'
  },
  icon: {
    width: 24,
    height: 24,
    // marginRight: ,
    marginLeft:10
  },
  icon1:{
    width: 24,
    height: 24,
    marginLeft:10

  },
  imageiconContainer: {
    borderColor: '#00c4cc', // Add the blue color
    borderWidth: 1,      // Specify the border width
    borderRadius: 8,     // Optionally, add rounded corners
    padding: 5,          // Add padding to give some space between border and content
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderColor: '#00c4cc',
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkBoxSelected: {
    backgroundColor: '#e0f7fa',
  },
});

export default FinishSetUp;

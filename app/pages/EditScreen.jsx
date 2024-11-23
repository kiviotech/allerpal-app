import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, CheckBox, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import useAuthStore from '../../useAuthStore'; // Assuming this holds user details
import { fetchUserAllergyByUserId, updateUserAllergyByUser } from '../../src/services/userAllergyServices';

const Profile = () => {
  const router = useRouter()
  const [allergens, setAllergens] = useState({
    Celery: false,
    Eggs: false,
    'Cereals containing gluteen': false,
    Lupin: false,
    Mustard: false,
    milk: false,
    Peanuts: false,
    sesame: false,
    'Silphur dioxide/Sulphites': false,
    Soyabeans: false,
    'Molluscs (such as mussels and oysters)': false,
    'Crustaceans(such as prawns,crabs and lobsters)': false,
    'Tree nuts (such as almonds,hazelnuts,walnuts)': false,
  });

  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((state) => state.user?.id); // Fetch logged-in user's ID


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

  useEffect(() => {
    const fetchUserAllergens = async () => {
      try {
        const response = await fetchUserAllergyByUserId(userId);
        const userAllergies = response.data.data[0]?.allergies || [];
        const allAllergens = {
          Celery: false,
          Eggs: false,
          'Cereals containing gluteen': false,
          Lupin: false,
          Mustard: false,
          milk: false,
          Peanuts: false,
          sesame: false,
          'Silphur dioxide/Sulphites': false,
          Soyabeans: false,
          'Molluscs (such as mussels and oysters)': false,
          'Crustaceans (such as prawns,crabs and lobsters)': false,
          'Tree nuts (such as almonds,hazelnuts,walnuts)': false,
        };

        // Set allergens already selected by the user to true
        userAllergies.forEach((allergy) => {
          if (allAllergens[allergy.name] !== undefined) {
            allAllergens[allergy.name] = true;
          }
        });
        setAllergens(allAllergens);
      } catch (error) {
        console.error('Error fetching user allergens:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserAllergens();
  }, [userId]);


  const toggleAllergen = (key) => {
    setAllergens((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveChanges = async () => {
    try {
      const selectedAllergies = Object.entries(allergens)
        .filter(([, isSelected]) => isSelected)
        .map((key) => ({ name: key }));
      console.log('first', selectedAllergies)

      const payload = {
        data: {
          allergies: selectedAllergies,
        },
      };

      console.log('first', payload)

      const response = await updateUserAllergyByUser(userId, payload);
      console.log('Response:', response);
      alert('Allergen preferences updated successfully.');
    } catch (error) {
      console.error('Error updating allergens:', error);
      alert('Failed to update allergen preferences.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  const allergenKeys = Object.keys(allergens);
  const mainAllergens = allergenKeys.slice(0, -3); // All but the last three
  const lastThreeAllergens = allergenKeys.slice(-3);

  const CustomCheckBox = ({ checked, onPress }) => (
    <TouchableOpacity
      style={[styles.checkBox, checked && styles.checkBoxSelected]}
      onPress={onPress}
    >
      {checked && <Ionicons name="checkmark" size={16} color="#00c4cc" />}
    </TouchableOpacity>
  );

  return (
    <View contentContainerStyle={styles.container}>
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
      <TouchableOpacity style={styles.signOutButton} onPress={handleSaveChanges}>
        <Text style={styles.signOutText}>Save Changes</Text>
      </TouchableOpacity>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  profileArrow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
  },
  editText: {
    color: '#00CFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7F8FA',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 20,
    fontSize: 16,
  },



  allergensContainer: {
    // borderColor: 'blue',
    // borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: '10%',
    width: '100%'
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
    gap: '3%'

  },
  singleAllergenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,

  },

  checkboxLabel: {
    fontSize: 13,
    color: '#555',
  },
  checkboxLabel1: {
    marginLeft: 10,
    color: '#555',
    fontSize: 15,
  },
  //     checkboxWrapper: {
  //     borderWidth: 1,
  //     borderColor: '#00CFFF', // Blue border color
  //     borderRadius: 4,
  //     padding: 2,
  //     marginRight: 8,
  //   },
  signOutButton: {
    marginTop: 50,
    paddingVertical: 15,
    alignItems: 'center',

    borderRadius: 10,
    shadowColor: '#00CFFF',
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signOutText: {
    color: '#00CFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkBox: {
    width: 20,
    height: 20,
    borderColor: '#00c4cc',
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: 10,
    marginRight: 10
  },
  checkBoxSelected: {
    backgroundColor: '#e0f7fa',
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
});

export default Profile;
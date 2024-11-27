import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, CheckBox, Image, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../useAuthStore'; // Assuming this holds user details
import { fetchUserAllergyByUserId, updateUserAllergyByUser } from '../../src/services/userAllergyServices';
import { fetchAllAllergies } from '../../src/services/allergyServices';
import { useRouter } from 'expo-router';

const Profile = () => {
  const router = useRouter()
  const [allegenList, setAllergenList] = useState([]);
  const [userAllergenId, setUserAllergenId] = useState(''); // To store allergens of the user
  const [selectedAllergens, setSelectedAllergens] = useState([]); // To track selected allergens
  const [loading, setLoading] = useState(true);

  const userId = useAuthStore((state) => state.user?.id); // Fetch logged-in user's ID

  // const [allergens, setAllergens] = useState({
  //   Celery: false,
  //   Eggs: false,
  //   'Cereals containing gluteen': false,
  //   Lupin: false,
  //   Mustard: false,
  //   milk: false,
  //   Peanuts: false,
  //   sesame: false,
  //   'Silphur dioxide/Sulphites': false,
  //   Soyabeans: false,
  //   'Molluscs (such as mussels and oysters)': false,
  //   'Crustaceans(such as prawns,crabs and lobsters)': false,
  //   'Tree nuts (such as almonds,hazelnuts,walnuts)': false,
  // });



  const allergenImages = {
    celery: require('../../assets/celery.png'),
    egg: require('../../assets/eggs.png'),
    'cereals containing gluteen': require('../../assets/cereals.png'),
    Lupin: require('../../assets/lupin.png'),
    Musturd: require('../../assets/mustard.png'),
    milk: require('../../assets/milk.png'),
    peanut: require('../../assets/peanuts.png'),
    Sesame: require('../../assets/sesame.png'),
    'silphur dioxide/sulphites': require('../../assets/sulphur.png'),
    SoyaBean: require('../../assets/soyabeans.png'),
    'molluscs (such as mussels and oysters)': require('../../assets/mollusca.png'),
    'crustaceans(such as prawns,crabs and lobsters)': require('../../assets/crustaceans.png'),
    'Tree nuts( such as almonds,Cashews,pecans)': require('../../assets/treenuts.png'),
    Fish: require('../../assets/fish.png'),
  };

  useEffect(() => {
    const fetchAllergenData = async () => {
      try {
        const data = await fetchAllAllergies(); // Fetch allergens from backend
        // const allergyName = data.data.map((allergy) => allergy.name);
        // const allergyId = data.data.map((allergy) => allergy.id);
        setAllergenList(data.data);
      } catch (error) {
        console.error('Error fetching allergens:', error);
      }
    };

    const fetchUserAllergens = async () => {
      try {
        const response = await fetchUserAllergyByUserId(userId);
        setUserAllergenId(response.data[0]?.documentId)
        const userAllergies = response.data[0]?.allergies || [];
        const userAllergenIds = userAllergies?.map((item) => item.id) || [];
        // setUserAllergens(userAllergies);
        setSelectedAllergens(userAllergenIds); // Set initially selected allergens for checkboxes
      } catch (error) {
        console.error('Error fetching user allergens:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAllergenData();
      fetchUserAllergens();
    }
  }, [userId]);


  // Handle checkbox toggle
  const handleCheckboxChange = (allergenId) => {
    setSelectedAllergens((prevState) =>
      prevState.includes(allergenId)
        ? prevState.filter((id) => id !== allergenId) // Remove allergen
        : [...prevState, allergenId] // Add allergen
    );
  };

  const handleSaveChanges = async () => {
    try {
      const formattedAllergens = selectedAllergens.map((allergenId) => ({
        id: allergenId,
      }));

      const payload = {
        data: {
          allergies: formattedAllergens,
        },
      };
  
      const response = await updateUserAllergyByUser( userAllergenId, payload);
  
      if (response?.data) {
        console.log('Allergen preferences updated successfully.');
        Alert.alert('Allergen preferences updated successfully.', '', [
         router.push('/pages/Account'),
        ]);
        
      } else {
        console.error('Unexpected response:', response);
        alert('Failed to update allergen preferences. Please try again.');
      }
    } catch (error) {
      console.error('Error updating allergens:', error);
      alert('Failed to update allergen preferences.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  // const allergenKeys = Object.keys(allergens);
  // const mainAllergens = allergenKeys.slice(0, -3); // All but the last three
  // const lastThreeAllergens = allergenKeys.slice(-3);
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
        {allegenList.map((allergen) => (
          <View key={allergen.id} style={styles.checkboxRow}>
            <CustomCheckBox
              checked={selectedAllergens.includes(allergen.id)} // Check if allergen is selected
              onPress={() => handleCheckboxChange(allergen.id)} // Toggle allergen selection
            />
            <View style={styles.imageiconContainer}>
              <Image source={allergenImages[allergen.name]} style={styles.icon} />
              <Text style={styles.checkboxLabel}>{allergen.name}</Text>
            </View>
          </View>
        ))}
          {/* {lastThreeAllergens.map((key) => (
            <View key={key} style={styles.singleAllergenRow}>
              <CustomCheckBox checked={allergens[key]} onPress={() => handleCheckboxChange(key)} />
              <View style={styles.imageiconContainer}>
                <Image source={allergenImages[key]} style={styles.icon1} />
                <Text style={styles.checkboxLabel}>{key}</Text>
              </View>
            </View>
          ))} */}
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
    width: '35%',
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
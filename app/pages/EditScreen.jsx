import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, CheckBox, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../useAuthStore'; // Assuming this holds user details
import { fetchUserAllergyByUserId, updateUserAllergyByUser } from '../../src/services/userAllergyServices';
import { fetchAllAllergies } from '../../src/services/allergyServices';
import { useRouter } from 'expo-router';
import { fetchProfileAllergyByProfileId, updateProfileAllergyById } from '../../src/services/profileAllergiesServices';
import { MEDIA_BASE_URL } from '../../src/api/apiClient';
import { fetchProfileByUserId } from '../../src/services/profileServices';
import { Switch } from 'react-native-web';
import SwitchToggle from 'react-native-switch-toggle';
import { useToast } from '../ToastContext';

const Profile = ({ onSave }) => {
  const router = useRouter();
  const { showToast } = useToast(); // Use the toast hook
  const [allegenList, setAllergenList] = useState([]);
  const [userAllergenId, setUserAllergenId] = useState(''); // To store allergens of the user
  const [selectedAllergens, setSelectedAllergens] = useState([]); // To track selected allergens
  const [profileAllergyId, setProfileAllergyId] = useState(''); // To store profileAllergyId
  const [isAllergenOn, setIsAllergenOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Track save in progress
  const profileId = useAuthStore((state) => state.profileId);

  const userId = useAuthStore((state) => state.user?.id); // Fetch logged-in user's ID

  useEffect(() => {
    const fetchAllergenData = async () => {
      try {
        const data = await fetchAllAllergies();
        const allergyData = data?.data
        allergyData.sort((a, b) => a.name.localeCompare(b.name));
        setAllergenList(allergyData);
      } catch (error) {
        console.error('Error fetching allergens:', error);
      }
    };

    const fetchUserAllergens = async () => {
      try {
        // const response = await fetchProfileAllergyByProfileId(profileId);

        const response = await fetchProfileByUserId(userId);
        setProfileAllergyId(response.data[0]?.profile_allergies[0]?.documentId);
        setUserAllergenId(response.data[0]?.profile_allergies[0]?.allergies)
        const userAllergies = response?.data[0]?.profile_allergies[0]?.allergies || []
        const userAllergenIds = userAllergies?.map((item) => item.id) || [];
        setSelectedAllergens(userAllergenIds); // Set initially selected allergens for checkboxes
        setIsAllergenOn(response?.data[0]?.profile_allergies[0]?.excludeMayContain)
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

  const toggleAllergen = () => {
    setIsAllergenOn((prevState) => !prevState);
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true); // Start saving state
      
      const formattedAllergens = selectedAllergens.map((allergenId) => ({
        id: allergenId,
      }));
      const payload = {
        data: {
          allergies: formattedAllergens,
          excludeMayContain: isAllergenOn,
        },
      };

      const response = await updateProfileAllergyById(profileAllergyId, payload);

      if (response?.data) {
        // Show toast notification
        showToast('Profile updated successfully!', 'success');
        
        // Wait a moment before navigating away so the user can see the toast
        setTimeout(() => {
          if (onSave && typeof onSave === 'function') {
            onSave(); // Call the onSave callback if provided
          } else {
            router.back(); // Fallback to going back
          }
        }, 800);
      } else {
        showToast('Failed to update preferences', 'error');
      }
    } catch (error) {
      console.error('Error updating allergen preferences:', error);
      showToast('Failed to update preferences', 'error');
    } finally {
      setIsSaving(false); // End saving state
    }
  };

  // Handle cancel button press
  const handleCancel = () => {
    if (onSave && typeof onSave === 'function') {
      onSave(); // Just go back without saving
    } else {
      router.back();
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }
  const CustomCheckBox = ({ checked, onPress }) => (
    <TouchableOpacity
      style={[styles.checkBox, checked]}
      onPress={onPress}
    >
      {checked && <Ionicons name="checkmark-sharp" size={24} color="#00c4cc" />}
    </TouchableOpacity>
  );

  return (
    <View contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Allergies</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.allergensContainer}>
          <View style={styles.checkboxContainer}>
            {allegenList.map((allergen) => (
              <View key={allergen.id} style={styles.checkboxRow}>
                <CustomCheckBox
                  checked={selectedAllergens.includes(allergen.id)} // Check if allergen is selected
                  onPress={() => handleCheckboxChange(allergen.id)} // Toggle allergen selection
                />
                <View style={styles.imageiconContainer}>
                  <Image source={{ uri: `${MEDIA_BASE_URL}${allergen?.Allergen_icon?.url}` }} style={styles.icon} ></Image>
                  <Text style={styles.checkboxLabel}>{allergen.name}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.toggleLabel}>
            Do you wish to EXCLUDE dishes that 'MAY CONTAIN' the selected
            Allergies
          </Text>
          <SwitchToggle
            switchOn={isAllergenOn}
            onPress={() => setIsAllergenOn(!isAllergenOn)}
            circleColorOff="#bbb"
            circleColorOn="#00c4cc"
            backgroundColorOn="#e0f7fa"
            backgroundColorOff="#ddd"
            containerStyle={styles.switchToggleContainer}
            circleStyle={styles.switchCircle}
          />
          <Text style={styles.switchText}>
            {isAllergenOn ? "Yes" : "No"}
          </Text>
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.saveButton, isSaving && styles.savingButton]} 
        onPress={handleSaveChanges}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
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
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    position: 'absolute',
    left: 0,
  },
  cancelText: {
    color: '#888',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  profileArrow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center'
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
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  allergensContainer: {
    marginTop: "5%",
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#555',
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "7%",
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
    color: "#00c4cc",
    fontWeight: "bold",
  },
  toggleLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#00CFFF',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  savingButton: {
    backgroundColor: '#7AD7F0',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBox: {
    width: 25,
    height: 25,
    borderColor: '#00c4cc',
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  imageiconContainer: {
    borderColor: "#00c4cc",
    width: '90%',
    maxWidth: 500,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    gap: '5%',
  },
});

export default Profile;
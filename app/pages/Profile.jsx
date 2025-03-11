import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router'
import EditScreen from "./EditScreen"
import useAuthStore from '../../useAuthStore';
import { MEDIA_BASE_URL } from '../../src/api/apiClient';
import useAllergyStore from '../../src/stores/allergyStore';
import { fetchProfileByUserId } from '../../src/services/profileServices';
import SwitchToggle from 'react-native-switch-toggle';
import { updateProfileAllergyById } from '../../src/services/profileAllergiesServices';

const Profile = () => {
  const router = useRouter()
  const [allergens, setAllergens] = useState([]); // Dynamic allergens state
  const [loading, setLoading] = useState(true); // Loading state for allergens
  const [editing, setEditing] = useState(false);
  const [isAllergenOn, setIsAllergenOn] = useState(false);
  const [profileAllergyId, setProfileAllergyId] = useState('');
  const profileId = useAuthStore((state) => state.profileId);
  const setSelectedAllergies = useAllergyStore(
    (state) => state.setSelectedAllergies
  );
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  useEffect(() => {
    const getAllergiesOfUser = async () => {
      try {
        const response = await fetchProfileByUserId(userId);
        const userAllergies = response?.data[0]?.profile_allergies[0]?.allergies || []
        setAllergens(userAllergies);
        setProfileAllergyId(response.data[0]?.profile_allergies[0]?.documentId);
        setIsAllergenOn(response?.data[0]?.profile_allergies[0]?.excludeMayContain);
      } catch (error) {
        console.warn("Error fetching profile allergies");
      }
      finally {
        setLoading(false);
      }
    };

    if (userId) {
      getAllergiesOfUser()
    }
  }, [userId, setSelectedAllergies]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    ); // Show loading indicator while fetching allergens
  }

  const handleAllergenToggle = async () => {
    setIsAllergenOn(prev => !prev); // Optimistically update state

    try {
      const payload = { data: { excludeMayContain: !isAllergenOn } };
      const response = await updateProfileAllergyById(profileAllergyId, payload);

      response?.data
        ? Alert.alert('Allergen preferences updated successfully.')
        : Alert.alert('Failed to update allergen preferences. Please try again.');
    } catch (error) {
      console.error('Error updating allergen preferences:', error);
      Alert.alert('Failed to update allergen preferences. Please try again.');
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View style={styles.header}>
          <View style={styles.profileArrow}>
            <TouchableOpacity onPress={() => router.push('./Account')}>
              <Icon name="arrow-back-outline" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerText}>My Profile</Text>
          </View>
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          defaultValue={user?.username}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          defaultValue={user?.email}
          editable={false}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.toggleLabel}>
            Do you wish to EXCLUDE dishes that 'MAY CONTAIN' the selected
            Allergies
          </Text>
          <SwitchToggle
            switchOn={isAllergenOn}
            onPress={handleAllergenToggle
              //  setIsAllergenOn(!isAllergenOn)
            }
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

        <Text style={styles.label}>Allergens</Text>
        {editing ?
          <EditScreen />
          :
          <>
            <View style={styles.allergensContainer}>
              {(!allergens || allergens.length === 0) ? (
                <Text style={styles.noDataText}>No allergies found</Text>
              ) : (
                allergens?.map((allergen, index) => {
                  return (
                    <TouchableOpacity key={index} style={styles.allergenTag}>
                      <Image source={{ uri: `${MEDIA_BASE_URL}${allergen?.Allergen_icon?.url}` }} style={styles.icon}></Image>
                      <Text style={styles.allergenText}>{allergen.name}</Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  allergenText: {
    color: '#333',
    fontSize: 14,
    marginLeft: 15,
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  loader: { marginTop: 50 },
  noDataText: { fontSize: 14, color: '#888' },
  image: { width: 24, height: 24, borderRadius: 12 },

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
});

export default Profile;

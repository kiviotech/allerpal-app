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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router'
import EditScreen from "./EditScreen"
import useAuthStore from '../../useAuthStore';
import { MEDIA_BASE_URL } from '../../src/api/apiClient';
import useAllergyStore from '../../src/stores/allergyStore';
import { fetchProfileByUserId } from '../../src/services/profileServices';

const Profile = () => {
  const router = useRouter()
  const [allergens, setAllergens] = useState([]); // Dynamic allergens state
  const [loading, setLoading] = useState(true); // Loading state for allergens
  const [editing, setEditing] = useState(false);
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
                      <Image source={{uri: `${MEDIA_BASE_URL}${allergen?.Allergen_icon?.url}`}} style={styles.icon}></Image>
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
});

export default Profile;

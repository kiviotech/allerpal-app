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
import Account from './Account'
import useAuthStore from '../../useAuthStore';
import { fetchUserAllergyById } from '../../src/services/userAllergyServices';
import { MEDIA_BASE_URL } from '../../src/api/apiClient';
import useAllergyStore from '../../src/stores/allergyStore';

const Profile = () => {
  const router = useRouter()
  const [allergens, setAllergens] = useState([]); // Dynamic allergens state
  const [loading, setLoading] = useState(true); // Loading state for allergens
  const [editing, setEditing] = useState(false);
  const setSelectedAllergies = useAllergyStore(
    (state) => state.setSelectedAllergies
  );

  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const data = await fetchUserAllergyById(userId); // Fetch allergens dynamically
        const allergies = data?.data?.map((item) => item.allergies).flat() || [];
        setAllergens(allergies);
        setSelectedAllergies(allergies); // Store selected allergies globally if needed
      } catch (error) {
        console.error('Error fetching allergies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAllergies();
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

        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          defaultValue={user.username}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          defaultValue={user.email}
          editable={false} // Disable editing for email if needed
        />

        <Text style={styles.label}>Allergens</Text>
        {/* <View style={styles.allergensContainer}>
          {allergens.length === 0 ? (
            <Text style={styles.noDataText}>No allergies found</Text>
          ) : (
            allergens.map((allergen, index) => {
              const imageUrl = allergen?.Allergeimage?.[0]?.url
                ? `${MEDIA_BASE_URL}${allergen.Allergeimage[0].url}`
                : null;

              return (
                <TouchableOpacity key={index} style={styles.allergenTag}>
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                  ) : (
                    <Icon name="leaf-outline" size={16} color="#00CFFF" />
                  )}
                  <Text style={styles.allergenText}>{allergen.name}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View> */}
        {editing ?
          <EditScreen />
          :
          <>
            <View style={styles.allergensContainer}>
              {allergens.length === 0 ? (
                <Text style={styles.noDataText}>No allergies found</Text>
              ) : (
                allergens.map((allergen, index) => {
                  const imageUrl = allergen?.Allergeimage?.[0]?.url
                    ? `${MEDIA_BASE_URL}${allergen.Allergeimage[0].url}`
                    : null;

                  return (
                    <TouchableOpacity key={index} style={styles.allergenTag}>
                      {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                      ) : (
                        <Icon name="leaf-outline" size={16} color="#00CFFF" />
                      )}
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
    marginLeft: 5,
  },
  loader: { marginTop: 50 },
  noDataText: { fontSize: 14, color: '#888' },
  image: { width: 24, height: 24, borderRadius: 12 },
});

export default Profile;

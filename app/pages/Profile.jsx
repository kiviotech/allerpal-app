import React, { useEffect, useState, useCallback } from 'react';
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
import { useToast } from '../ToastContext';

const Profile = () => {
  const router = useRouter()
  const { toast } = useToast(); // Add the toast hook
  const [allergens, setAllergens] = useState([]); // Dynamic allergens state
  const [loading, setLoading] = useState(true); // Loading state for allergens
  const [editing, setEditing] = useState(false);
  const [excludeMayContain, setExcludeMayContain] = useState(false); // State for excludeMayContain
  const profileId = useAuthStore((state) => state.profileId);
  const setSelectedAllergies = useAllergyStore(
    (state) => state.setSelectedAllergies
  );
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  // Function to fetch allergies (extracted from useEffect for reuse)
  const getAllergiesOfUser = useCallback(async () => {
    try {
      const response = await fetchProfileByUserId(userId);
      // Get the profile allergies data
      const profileAllergies = response?.data[0]?.profile_allergies[0] || {};
      const userAllergies = profileAllergies?.allergies || [];
      
      // Set the excludeMayContain value
      setExcludeMayContain(profileAllergies?.excludeMayContain || false);
      setAllergens(userAllergies);
    } catch (error) {
      console.warn("Error fetching profile allergies:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Handler for when Edit mode is exited
  const handleExitEditMode = () => {
    setEditing(false);
    setLoading(true); // Show loading state
    getAllergiesOfUser(); // Refresh data
  };

  useEffect(() => {
    if (userId) {
      getAllergiesOfUser();
    }
  }, [userId, getAllergiesOfUser]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    ); // Show loading indicator while fetching allergens
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Render the toast if visible */}
      {toast.visible && (
        <View style={[
          styles.toast, 
          toast.type === 'success' ? styles.successToast : styles.errorToast
        ]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}

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
          <EditScreen onSave={handleExitEditMode} />
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
            
            {/* Display May Contain status */}
            <View style={styles.mayContainContainer}>
              <Text style={styles.label}>May Contain Status</Text>
              <View style={styles.mayContainStatus}>
                <Icon 
                  name={excludeMayContain ? "checkmark-circle" : "close-circle"} 
                  size={22} 
                  color={excludeMayContain ? "#00CFFF" : "#ff6b6b"} 
                  style={styles.statusIcon}
                />
                <Text style={styles.statusText}>
                  {excludeMayContain ? "Excluding foods with 'May Contain' allergens" : "Including foods with 'May Contain' allergens"}
                </Text>
              </View>
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
  toast: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 6,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successToast: {
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
  },
  errorToast: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
  },
  toastText: {
    color: 'white',
    fontWeight: 'bold',
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
    marginBottom: 20,
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
  mayContainContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  mayContainStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statusIcon: {
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
  }
});

export default Profile;

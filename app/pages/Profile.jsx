import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRouter} from 'expo-router'
import EditScreen from "./EditScreen"
import Account from './Account'

const Profile = () => {
  const router = useRouter()
  const allergens = ['Celery', 'Mustard'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileArrow}>
        <TouchableOpacity onPress={()=>router.push('./Account')}>
          <Icon name="arrow-back-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Profile</Text>
        </View>
        <TouchableOpacity onPress={()=> router.push('./EditScreen')}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Full name</Text>
      <TextInput
        style={styles.input}
        placeholder="Full name"
        defaultValue="Arlene Mccoy"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        defaultValue="noname@roreply.com"
        editable={false} // Disable editing for email if needed
      />

      <Text style={styles.label}>Allergens</Text>
      <View style={styles.allergensContainer}>
        {allergens.map((allergen, index) => (
          <TouchableOpacity key={index} style={styles.allergenTag}>
            <Icon name="leaf-outline" size={16} color="#00CFFF" />
            <Text style={styles.allergenText}>{allergen}</Text>
          </TouchableOpacity>
        ))}
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
  profileArrow:{
    display:'flex',
    flexDirection:'row',
    gap:5,
    alignItems:'center',
    justifyContent:'center'
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
});

export default Profile;
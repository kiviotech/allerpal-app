import React,{useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,CheckBox } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRouter} from 'expo-router'

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
        'Tree nuts (such as almonds,hazelnuts,walnuts,Brazil nuts,Cashews,pecans)': false,
      });

      const toggleAllergen = (key) => {
        setAllergens((prev) => ({ ...prev, [key]: !prev[key] }));
      };

      const allergenKeys = Object.keys(allergens);
      const mainAllergens = allergenKeys.slice(0, -3); // All but the last three
      const lastThreeAllergens = allergenKeys.slice(-3);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileArrow}>
        <TouchableOpacity onPress={()=>router.push('./Profile')}>
          <Icon name="arrow-back-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Profile</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.editText}>Cancel</Text>
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
        <View style={styles.checkboxContainer}>
          {mainAllergens.map((key) => (
            <View key={key} style={styles.checkboxRow}>
              <View style={styles.checkboxWrapper}>
                <CheckBox
                  value={allergens[key]}
                  onValueChange={() => toggleAllergen(key)}
           
                />
              </View>
              <Text style={styles.checkboxLabel}>{String(key).charAt(0).toUpperCase() + String(key).slice(1)}</Text>
            </View>
          ))}
                    
                    {lastThreeAllergens.map((key) => (
            <View key={key} style={styles.singleAllergenRow}>
              <CheckBox
                value={allergens[key]}
                onValueChange={() => toggleAllergen(key)}
              />
              <Text style={styles.checkboxLabel1}>{String(key).charAt(0).toUpperCase() + String(key).slice(1)}</Text>
            </View>
          ))}

        </View>
        <TouchableOpacity style={styles.signOutButton}>
        <Text style={styles.signOutText}>Save Changes</Text>
      </TouchableOpacity>
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
    // borderColor: 'blue',
    // borderWidth: 1,
    borderRadius: 8,
    padding: 16,
   marginTop:'10%'
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },
 
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
    gap:'5%',
   
  },
  singleAllergenRow: { 
    flexDirection: 'row',
     alignItems: 'center',
      width: '100%', 
      marginTop:10,
     
    }, 
 
  checkboxLabel: {
    fontSize: 15,
    color: '#555',
  },
  checkboxLabel1:{
    marginLeft:10,
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
});

export default Profile;
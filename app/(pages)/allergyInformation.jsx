import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton/CustomButton';
import colors from '../../constants/colors';
import icons from '../../constants/icons';
import CustomCheckbox from '../../components/customCheckbox/CustomCheckbox';
import fonts from '../../constants/fonts';



const allergyInformation = () => {
  const [allergies, setAllergies] = useState({
    Celery: false,
    Gluten: false,
    Pea: false,
    Chilly: false,
    Legume: false,
    Peanuts: false,
    Coconut: false,
    Lupin: false,
    Sesame: false,
    Crustaceans: false,
    Milk: false,
    Soyabeans: false,
    Eggs: false,
    Molluscs: false,
    Sulphites: false,
    Fish: false,
    Mustard: false,
    TreeNuts: false,
    Garlic: false,
    Onion: false,
    Others: false,
  });

  const toggleSwitch = (key) => {
    setAllergies({ ...allergies, [key]: !allergies[key] });
  };

  const gotoMyAllergyInfoPage = () => {
    // Handle navigation or submission here
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={icons.user} style={styles.userImage} />
        <Text style={styles.header}>My Allergy Information</Text>
        <View style={styles.buttonContainer}>
          <CustomButton borderRadius={15}
            buttonStyle={{ backgroundColor: colors.primary }}
            text='Allergens Affinity' textStyle={{ fontSize: 14, fontFamily: fonts.inter400, color: colors.loginPageTextColor }}
            onPress={gotoMyAllergyInfoPage}
          />
        </View>
        <View style={styles.allergensContainer}>
          {Object.keys(allergies).map((key, index) => (
            <View key={index} style={styles.checkboxContainer}>
              <CustomCheckbox
                isChecked={allergies[key]}  // Correct prop name
                onPress={() => toggleSwitch(key)}  // Correct prop name
                height={21}
                width={23}
              />
              <Text style={styles.checkboxLabel}>{key}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.allergensContainer, { marginTop: -10, width: '100%' }]}>
          <Text style={{ fontSize: 12, fontFamily: 'Inter_700Bold', color: colors.blackColor, }}>If others Please Specify</Text>
          <TextInput
            style={[styles.textInput, { marginTop: 5 }]}
            placeholder="If others, please specify"
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={4} // You can adjust this value based on your preference
          />
        </View>

        <View style={[styles.buttonContainer, { marginTop: -20 }]}>
          <CustomButton
            buttonStyle={{ backgroundColor: colors.primary }}
            textStyle={{ fontSize: 14, fontFamily: fonts.inter400, color: colors.loginPageTextColor }}
            text='Select Password'

          />
        </View>
        <View style={[styles.buttonContainer, { marginTop: 10 }]}>
          <CustomButton
            buttonStyle={{ backgroundColor: colors.primary }}
            textStyle={{ fontSize: 14, fontFamily: fonts.inter400, color: colors.loginPageTextColor }}
            text='Confirm Password'
          />
        </View>
        <View style={[styles.buttonContainer, { marginTop: 10 }]}>
          <CustomButton
            buttonStyle={{ backgroundColor: colors.secondary }}
            textStyle={{ fontSize: 14, fontFamily: fonts.inter400, color: colors.background }}
            text='Create Account'
          />
        </View>
        <View style={styles.privicyPolicy}>
          <Image source={icons.privacy}></Image>
          <Text style={{ color: colors.primary, marginTop: -10, marginLeft: -8 }}>Privacy Policy</Text>
        </View>
      </ScrollView>
    </SafeAreaView>

  );
};

export default allergyInformation;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  userImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginBottom: 20,
  },
  header: {
    fontSize: 15,
    fontFamily: fonts.inter400,
    color: colors.loginPageTextColor,
    marginBottom: 20,
  },
  allergensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 30
  },
  checkboxContainer: {
    width: '30%', // 30% width ensures three items per row with space for margins
    marginBottom: 10, // Spacing between rows
    alignItems: 'center',
    flexDirection: 'row',
  },

  checkboxLabel: {
    marginLeft: 8,
    marginTop: 5,
    fontSize: 12,
    fontFamily: fonts.inter400,
    color: colors.blackColor,
  },
  textInput: {
    width: '100%',
    height: 80,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: colors.text,
    padding: 10, // Adjust padding as needed

    textAlignVertical: 'top' // Align text to the top
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  privicyPolicy: {

  }

});
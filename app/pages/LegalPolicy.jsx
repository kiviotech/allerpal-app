import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

const LegalPolicy = () => {
  const router = useRouter(); // useRouter hook to navigate programmatically

  // Event handler for the back button
  const handleBack = () => {
    router.back(); // Navigate to Home when back is pressed
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Legal and Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.titleHeader}>Allerpal User Agreement and Legal Disclaimer</Text>

        <Text style={styles.subHeader}>
          By creating an Allerpal account and using this app, you acknowledge and agree to the following terms:
        </Text>

        <Text style={styles.sectionHeader}>1. Restaurant and Menu Information Disclaimer:</Text>
        <Text style={styles.paragraph}>
          Allerpal compiles restaurant and menu information from publicly available sources, data provided by restaurants,
          and feedback from users. While Allerpal endeavors to ensure accuracy, we cannot and do not guarantee the
          completeness, reliability, or timeliness of this information. Restaurant menus, ingredients, and allergen-handling
          practices are subject to change without notice, and Allerpal has no control over these changes. It is the user’s
          responsibility to verify all menu items and ingredients directly with restaurant staff to confirm allergen information
          before consuming any food or beverage.
        </Text>

        <Text style={styles.sectionHeader}>2. User Responsibility Disclaimer:</Text>
        <Text style={styles.paragraph}>
          Allerpal provides informational support to assist users in making dining decisions but does not assume responsibility
          for individual choices, actions, or outcomes. Users are solely responsible for assessing their own risk, confirming
          allergen safety with restaurant staff, and making dining decisions that align with their allergy management needs.
          Allerpal recommends that users practice vigilance, use personal discretion, and make decisions in consultation with
          medical professionals regarding any specific allergen management requirements.
        </Text>

        <Text style={styles.sectionHeader}>3. Liability Disclaimer:</Text>
        <Text style={styles.paragraph}>
          Allerpal, its founders, employees, and affiliates are not liable for any adverse reactions, allergic responses,
          injuries, or other incidents that may result from dining at any restaurant listed, recommended, or reviewed within
          this app. Allerpal is provided “as is,” without warranties of any kind, whether expressed or implied, including but
          not limited to warranties of accuracy, completeness, merchantability, or fitness for a particular purpose. By using
          Allerpal, you accept all inherent risks associated with dining out with food allergies and agree to release, indemnify,
          and hold harmless Allerpal, its founders, employees, and affiliates from any claims, liabilities, damages, or losses,
          arising from or related to your use of this app or reliance on its information.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  backButton: {
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
});

export default LegalPolicy;

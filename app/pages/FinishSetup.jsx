// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   CheckBox,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import SwitchToggle from "react-native-switch-toggle";

// import { getAllergies } from "./../../src/api/repositories/allergyRepositories";
// import { createNewUserAllergy } from "../../src/services/userAllergyServices";
// import useAuthStore from "../../useAuthStore";
// import useSetupStore from "../../useSetupStore";

// const FinishSetUp = () => {
//   const router = useRouter();
//   const [allergens, setAllergensState] = useState({});
//   const {
//     selectedAllergies,
//     toggleAllergySelection,
//     excludeMayContain,
//     setExcludeMayContain,
//     termsAccepted,
//     setTermsAccepted,
//   } = useSetupStore();

//   const user = useAuthStore((state) => state.user);
//   useEffect(() => {
//     console.log("User:", user.id); // Log user info when the component mounts
//   }, [user]);

//   useEffect(() => {
//     const fetchAllergies = async () => {
//       try {
//         const response = await getAllergies();
//         const allergyData = response?.data?.data;

//         if (allergyData && Array.isArray(allergyData)) {
//           const allergenObject = allergyData.reduce((acc, allergy) => {
//             const name = allergy.name ?? "Unknown Allergy";
//             const id = allergy.id ?? `unknown-${Math.random()}`;
//             acc[name] = { checked: false, id };
//             return acc;
//           }, {});

//           setAllergensState(allergenObject);
//         } else {
//           console.error("Unexpected data format:", response);
//         }
//       } catch (error) {
//         console.error("Error fetching allergens:", error);
//       }
//     };

//     fetchAllergies();
//   }, []);

//   const handleToggleAllergen = (key) => {
//     setAllergensState((prevState) => {
//       const updatedAllergens = {
//         ...prevState,
//         [key]: { ...prevState[key], checked: !prevState[key].checked },
//       };
//       toggleAllergySelection(prevState[key].id); // Update Zustand store
//       return updatedAllergens;
//     });
//   };

//   const handleFinishSetup = async () => {
//     if (selectedAllergies.length > 0 && termsAccepted) {
//       const payload = {
//         user: [user.id], // Assuming userId is fetched correctly from the auth store
//         allergies: selectedAllergies,
//         custom_description: "Custom description here",
//         locale: "en",
//       };

//       try {
//         const response = await createNewUserAllergy(payload);
//         console.log("Allergy profile saved", response);
//         router.push("./Home");
//       } catch (error) {
//         console.error("Error creating allergy profile:", error);
//       }
//     } else {
//       alert("Please select at least one allergen and accept the terms.");
//     }
//   };

//   const allergenKeys = Object.keys(allergens);
//   const mainAllergens = allergenKeys.slice(0, -3);
//   const lastThreeAllergens = allergenKeys.slice(-3);

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => router.push("./AccountSetup")}
//           style={styles.backButtonContainer}
//         >
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.title}>
//         Select your allergens to create and save your personalised allergy
//         profile. Allerpal will give you recommendations based on this
//         information so please fill out carefully.
//       </Text>

//       <View style={styles.allergensContainer}>
//         <View style={styles.checkboxContainer}>
//           {mainAllergens.map((key) => (
//             <View key={key} style={styles.checkboxRow}>
//               <CheckBox
//                 value={allergens[key]?.checked || false}
//                 onValueChange={() => handleToggleAllergen(key)}
//               />
//               <Text style={styles.checkboxLabel}>
//                 {String(key).charAt(0).toUpperCase() + String(key).slice(1)}
//               </Text>
//             </View>
//           ))}
//           {lastThreeAllergens.map((key) => (
//             <View key={key} style={styles.singleAllergenRow}>
//               <CheckBox
//                 value={allergens[key]?.checked || false}
//                 onValueChange={() => handleToggleAllergen(key)}
//               />
//               <Text style={styles.checkboxLabel1}>
//                 {String(key).charAt(0).toUpperCase() + String(key).slice(1)}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>

//       <View style={styles.switchContainer}>
//         <Text style={styles.toggleLabel}>
//           Do you wish to EXCLUDE dishes that ‘MAY CONTAIN’ the selected
//           Allergies
//         </Text>
//         <SwitchToggle
//           switchOn={excludeMayContain}
//           onPress={() => setExcludeMayContain(!excludeMayContain)}
//           circleColorOff="#bbb"
//           circleColorOn="#00c4cc"
//           backgroundColorOn="#e0f7fa"
//           backgroundColorOff="#ddd"
//           containerStyle={styles.switchToggleContainer}
//           circleStyle={styles.switchCircle}
//         />
//         <Text style={styles.switchText}>
//           {excludeMayContain ? "Yes" : "No"}
//         </Text>
//       </View>

//       <TouchableOpacity
//         style={[
//           styles.button,
//           !(termsAccepted && selectedAllergies.length > 0) &&
//             styles.buttonDisabled,
//         ]}
//         onPress={handleFinishSetup}
//       >
//         <Text style={styles.buttonText}>Finish Setup</Text>
//       </TouchableOpacity>

//       <View style={styles.termsContainer}>
//         <CheckBox value={termsAccepted} onValueChange={setTermsAccepted} />
//         <Text style={styles.termsText}>
//           By ticking this box, I confirm that I have read, understood, and agree
//           to the terms outlined in this User Agreement and Legal Disclaimer. I
//           accept full responsibility for verifying all allergen-related
//           information and assume all risks associated with dining out with food
//           allergies.
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// // !=================================================================================================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 16,
//   },
//   header: {
//     position: "absolute",
//     top: 0,
//     left: "3%",
//   },
//   backButtonContainer: {
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 16,
//     color: "#333",

//     marginTop: "19%",
//   },
//   allergensContainer: {
//     // borderColor: 'blue',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 16,
//     marginTop: "10%",
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },

//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "48%",
//     marginBottom: 10,
//     gap: "5%",
//   },
//   singleAllergenRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     marginTop: 10,
//   }, // Last three allergens in full width

//   checkboxLabel: {
//     fontSize: 15,
//     color: "#555",
//   },
//   checkboxLabel1: {
//     marginLeft: 10,
//     color: "#555",
//     fontSize: 15,
//   },
//   toggleLabel: {
//     fontSize: 14,
//     color: "#00c4cc",
//     marginRight: 10,
//     flex: 1,
//     fontWeight: "bold",
//   },
//   switchToggleContainer: {
//     width: 50,
//     height: 25,
//     borderRadius: 25,
//   },
//   switchCircle: {
//     width: 20,
//     height: 20,
//     borderRadius: 20,
//   },
//   switchText: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: "#00c4cc",
//     fontWeight: "bold",
//   },
//   button: {
//     backgroundColor: "#00c4cc",
//     paddingVertical: 15,
//     borderRadius: 25,
//     alignItems: "center",
//     marginBottom: 20,
//     marginTop: "10%",
//   },
//   buttonDisabled: {
//     backgroundColor: "#aaa",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   termsContainer: {
//     flexDirection: "row",

//     marginTop: "13%",
//   },
//   termsText: {
//     fontSize: "90%",
//     color: "#555",
//     flex: 1,
//     marginLeft: 10,
//   },
//   switchContainer: {
//     flexDirection: "row",
//     alignItems: "center", // Align switch and text vertically
//     marginTop: "10%",
//   },
// });

// export default FinishSetUp;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  CheckBox,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import SwitchToggle from "react-native-switch-toggle";

import { getAllergies } from "./../../src/api/repositories/allergyRepositories";
import { createNewUserAllergy } from "../../src/services/userAllergyServices";
import { createNewProfileAllergy } from "../../src/services/profileAllergiesServices";
import useAuthStore from "../../useAuthStore";
import useSetupStore from "../../useSetupStore";
import { MEDIA_BASE_URL } from "../../src/api/apiClient";

const FinishSetUp = () => {
  const router = useRouter();
  const { profileId } = useLocalSearchParams();
  const [allergens, setAllergensState] = useState([]);
  const {
    selectedAllergies,
    toggleAllergySelection,
    excludeMayContain,
    setExcludeMayContain,
    termsAccepted,
    setTermsAccepted,
  } = useSetupStore();

  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    console.log("User:", user.documentId); // Log user info when the component mounts
    console.log("Profile ID received finish setup:", profileId); // Log the received profileId
  }, [user, profileId]);

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const response = await getAllergies();
        const allergyData = response?.data?.data;
        console.log('allergy', allergyData)
          setAllergensState(allergyData);
      } catch (error) {
        console.error("Error fetching allergens:", error);
      }
    };

    fetchAllergies();
  }, []);

  const handleToggleAllergen = (key) => {
    setAllergensState((prevState) =>
      prevState.map((item) =>
        item.id === key.id
          ? { ...item, checked: !item.checked } // Toggle the checked property
          : item
      )
    );
      toggleAllergySelection(key.id); // Update Zustand store
      // return updatedAllergens;
    // };
  };

  // const allergenImages = {
  //   celery: require("../../assets/celery.png"),
  //   egg: require("../../assets/eggs.png"),
  //   "cereals ": require("../../assets/cereals.png"),
  //   Lupin: require("../../assets/lupin.png"),
  //   Musturd: require("../../assets/mustard.png"),
  //   milk: require("../../assets/milk.png"),
  //   peanut: require("../../assets/peanuts.png"),
  //   Sesame: require("../../assets/sesame.png"),
  //   "silphur dioxide/sulphites": require("../../assets/sulphur.png"),
  //   SoyaBean: require("../../assets/soyabeans.png"),
  //   "molluscs(such as mussels and oysters)": require("../../assets/mollusca.png"),
  //   "Crustaceans (such as prawns, crabs and lobsters)": require("../../assets/crustaceans.png"),
  //   "Tree nuts": require("../../assets/treenuts.png"),
  //   Fish: require("../../assets/fish.png"),
  // };

  const CustomCheckBox = ({ checked, onPress }) => (
    <TouchableOpacity
      style={[styles.checkBox, checked]}
      onPress={onPress}
    >
      {checked && <Ionicons name="checkmark-sharp" size={24} color="#00c4cc" />}
    </TouchableOpacity>
  );

  const handleFinishSetup = async () => {
    if (selectedAllergies.length > 0 && termsAccepted) {
      const payload = {
        user: [user.id],
        allergies: selectedAllergies,
        custom_description: "Custom description here",
        locale: "en",
      };

      try {
        // const response = await createNewUserAllergy(payload);
        // console.log("User allergy profile saved", response);

        // Create profile allergies with allergies as array
        const profileAllergyPayload = {
          data: {
            profile: profileId,
            severity: "mild",
            allergies: selectedAllergies, // Changed 'allergy' to 'allergies'
            locale: "en",
          },
        };
        const resp = await createNewProfileAllergy(profileAllergyPayload);
        console.log('Successfully created profile_allergy', resp.data)

        router.push("./Home");
      } catch (error) {
        console.error("Error creating/updating allergy profiles:", error);
      }
    } else {
      alert("Please select at least one allergen and accept the terms.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => router.push("./AccountSetup")}
          style={styles.backButtonContainer}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        Select your allergens to create and save your personalised allergy
        profile. Allerpal will give you recommendations based on this
        information so please fill out carefully.
      </Text>

      <View style={styles.allergensContainer}>
        <View style={styles.checkboxContainer}>
          {allergens?.map((key) => (
            <View key={key.id} style={styles.checkboxRow}>
              <CustomCheckBox
                checked={key?.checked || false}
                onPress={() => handleToggleAllergen(key)}
              />
              <View style={styles.imageiconContainer}>
                <Image source={{uri: `${MEDIA_BASE_URL}${key?.Allergen_icon?.url}`}} style={styles.icon} ></Image>
                <Text style={styles.checkboxLabel}>
                  {key.name}
                </Text>
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
          switchOn={excludeMayContain}
          onPress={() => setExcludeMayContain(!excludeMayContain)}
          circleColorOff="#bbb"
          circleColorOn="#00c4cc"
          backgroundColorOn="#e0f7fa"
          backgroundColorOff="#ddd"
          containerStyle={styles.switchToggleContainer}
          circleStyle={styles.switchCircle}
        />
        <Text style={styles.switchText}>
          {excludeMayContain ? "Yes" : "No"}
        </Text>
      </View>

      <View style={styles.termsContainer}>
        <CheckBox value={termsAccepted} onValueChange={setTermsAccepted} style={styles.termsCheckbox} />
        <Text style={styles.termsText}>
          By ticking this box, I confirm that I have read, understood, and agree
          to the terms outlined in this User Agreement and Legal Disclaimer. I
          accept full responsibility for verifying all allergen-related
          information and assume all risks associated with dining out with food
          allergies.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.finishButton,
          !(termsAccepted && selectedAllergies.length > 0) &&
            styles.buttonDisabled,
        ]}
        onPress={handleFinishSetup}
      >
        <Text style={styles.buttonText}>Finish Setup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButtonContainer: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    color: "#333",
    marginTop: "5%",
    textAlign: 'justify',

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
  },
  toggleLabel: {
    fontSize: 16,
    color: "#00c4cc",
    marginRight: 10,
    flex: 1,
    fontWeight: "bold",
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
  finishButton: {
    backgroundColor: "#00c4cc",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    marginTop: "10%",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  termsContainer: {
    flexDirection: "row",
    marginTop: "10%",
  },
  termsCheckbox: {
    width: 25,
    height: 25,
  },
  termsText: {
    fontSize: 16,
    textAlign: 'justify',
    color: "#555",
    flex: 1,
    marginLeft: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "10%",
  },
  icon: {
    width: 35,
    height: 35,
    marginLeft: 10,
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
  checkBox: {
    width: 25,
    height: 25,
    borderColor: "#00c4cc",
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});

export default FinishSetUp;

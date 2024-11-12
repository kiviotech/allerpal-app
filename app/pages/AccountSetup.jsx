// import React, { useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// const AccountSetup = () => {
//   const router = useRouter();
//   const [selectedOptions, setSelectedOptions] = useState({
//     Myself: false,
//     "My Child": false,
//     "My Partner": false,
//   });

//   const handleOptionChange = (option) => {
//     setSelectedOptions((prevOptions) => ({
//       ...prevOptions,
//       [option]: !prevOptions[option], // Toggle the selected state
//     }));
//     console.log("Current selected option:", option);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Account Setup</Text>

//       <Text style={styles.label}>I am creating an Allergy profile for</Text>

//       <View style={styles.optionContainer}>
//         {Object.keys(selectedOptions).map((option) => (
//           <TouchableOpacity
//             key={option}
//             onPress={() => handleOptionChange(option)}
//             style={styles.checkboxContainer}
//           >
//             <View
//               style={[
//                 styles.checkbox,
//                 selectedOptions[option] && styles.checkedCheckbox,
//               ]}
//             >
//               {selectedOptions[option] && (
//                 <Ionicons name="checkmark" size={16} color="white" />
//               )}
//             </View>
//             <Text style={styles.optionText}>{option}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <View style={styles.outerButtonContainer}>
//         <TouchableOpacity
//           style={styles.nextButton}
//           onPress={() => router.push("./Disclamier")}
//         >
//           <Text style={styles.nextButtonText}>Next </Text>
//           <Ionicons name="arrow-forward" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AccountSetup = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null); // Only one option can be selected

  const handleOptionChange = (option) => {
    setSelectedOption(option); // Set the selected option
    console.log("Current selected option:", option);
  };

  const handleNextPress = () => {
    if (selectedOption === "Myself") {
      router.push("./Disclamier"); // Only navigate if "Myself" is selected
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Setup</Text>

      <Text style={styles.label}>I am creating an Allergy profile for</Text>

      <View style={styles.optionContainer}>
        {["Myself", "My Child", "My Partner"].map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => handleOptionChange(option)}
            style={styles.checkboxContainer}
          >
            <View
              style={[
                styles.checkbox,
                selectedOption === option && styles.checkedCheckbox,
              ]}
            >
              {selectedOption === option && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.outerButtonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.nextButtonText}>Next </Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
// !=============================================================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  optionContainer: {
    flexDirection: "column",
    marginBottom: 10,
    marginLeft: "10%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "cyan",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  checkedCheckbox: {
    backgroundColor: "cyan", // Change this color as needed
  },
  optionText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "cyan",
    padding: 10,
    borderRadius: 25,
    width: "35%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  outerButtonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
});

export default AccountSetup;

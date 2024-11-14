





// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import Disclamier from "../pages/Disclamier"


// const VerificationCode = () => {
//   const [code, setCode] = useState(['', '', '', '']);
//   const router = useRouter();

//   const handleKeyPress = (key, index) => {
//     const newCode = [...code];
//     newCode[index] = key;
//     setCode(newCode);

//     // Automatically move to the next input if available
//     if (key !== '' && index < code.length - 1) {
//       inputRefs[index + 1].focus();
//     }
//   };

//   const handleDelete = () => {
//     const newCode = [...code];
//     const lastFilledIndex = newCode.findIndex((value) => value === '');
//     const deleteIndex = lastFilledIndex === -1 ? newCode.length - 1 : lastFilledIndex - 1;
  
//     if (deleteIndex >= 0) {
//       newCode[deleteIndex] = '';
//       setCode(newCode);
//     }
//   };

//   const inputRefs = [];

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.push('../auth/Login')} style={styles.backButtonContainer}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.topContent}>
//         <Text style={styles.title}>Verification Code</Text>
//         <Text style={styles.subtitle}>
//           Please type the verification code sent to prelookstudio@gmail.com
//         </Text>

//         <View style={styles.codeInputContainer}>
//           {code.map((value, index) => (
//             <TextInput
//               key={index}
//               style={styles.codeInput}
//               keyboardType="number-pad"
//               maxLength={1}
//               value={value}
//               onChangeText={(text) => handleKeyPress(text, index)}
//               ref={(input) => (inputRefs[index] = input)}
//             />
//           ))}
//         </View>

//         <Text style={styles.resendText}>
//           I don’t receive a code?{' '}
//           <Text style={styles.resendLink} onPress={()=> router.push('../pages/AccountSetup')} >Please resend</Text>
//         </Text>
//       </View>

//       <View style={styles.outerContainer}>
//         <View style={styles.numberPad}>
//           {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
//             <TouchableOpacity
//               key={number}
//               style={styles.numberKey}
//               onPress={() => handleKeyPress(number.toString(), code.indexOf(''))}
//             >
//               <Text style={styles.numberText}>{number}</Text>
//             </TouchableOpacity>
//           ))}
//             <View style={styles.lastRow}>
//             <TouchableOpacity style={styles.emptyKey} />
//             <TouchableOpacity style={styles.numberKey} onPress={() => handleKeyPress('0', code.indexOf(''))}>
//               <Text style={styles.numberText}>0</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.numberKey} onPress={handleDelete}>
//               <Ionicons name="backspace" size={20} color="black" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 2,
//     width:'100%'
//   },
//   header: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//   },
//   backButtonContainer: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   topContent: {
//     alignItems: 'center',
//     marginTop: '45%', // Adjusted spacing from the top
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   codeInputContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '80%',
//     height:'40%',
//     marginBottom: 20,
//   },
//   codeInput: {
//     width: '20%',
   
//     borderWidth: 1,
//     borderRadius: 10,
//     borderColor: '#ccc',
//     textAlign: 'center',
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   resendText: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 10,
//   },
//   resendLink: {
//     color: '#007AFF',
//     fontWeight: '600',
//   },
//   outerContainer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#f2f2f2',
//     // paddingVertical: 10,
//   },
//   numberPad: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   numberKey: {
//     width: '30%',
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 5,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//   },
//   numberText: {
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   lastRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     paddingHorizontal: 10,
//     marginTop: 5,
//   },
//   emptyKey: {
//     width: '28%',
//     height: 60,
//   },
// });

// export default VerificationCode;



import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const VerificationCode = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const router = useRouter();

  const handleKeyPress = (key, index) => {
    const newCode = [...code];
    newCode[index] = key;
    setCode(newCode);

    // Automatically move to the next input if available
    if (key !== '' && index < code.length - 1) {
      inputRefs[index + 1].focus();
    }

    // Check if all fields are filled
    if (newCode.every((digit) => digit !== '')) {
      // Navigate to AccountSetup page if all inputs are filled
      router.push('../pages/AccountSetup');
    }
  };

  const handleDelete = () => {
    const newCode = [...code];
    const lastFilledIndex = newCode.findIndex((value) => value === '');
    const deleteIndex = lastFilledIndex === -1 ? newCode.length - 1 : lastFilledIndex - 1;

    if (deleteIndex >= 0) {
      newCode[deleteIndex] = '';
      setCode(newCode);
      // Focus on the last filled input after deletion
      if (deleteIndex < code.length - 1) {
        inputRefs[deleteIndex].focus();
      }
    }
  };

  const inputRefs = [];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('../auth/Login')} style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.topContent}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          Please type the verification code sent to prelookstudio@gmail.com
        </Text>

        <View style={styles.codeInputContainer}>
          {code.map((value, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              keyboardType="number-pad"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleKeyPress(text, index)}
              ref={(input) => (inputRefs[index] = input)}
            />
          ))}
        </View>

        <Text style={styles.resendText}>
          I don’t receive a code?{' '}
          <Text style={styles.resendLink} >Please resend</Text>
        </Text>
      </View>

      <View style={styles.outerContainer}>
        <View style={styles.numberPad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.numberKey}
              onPress={() => handleKeyPress(number.toString(), code.indexOf(''))}
            >
              <Text style={styles.numberText}>{number}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.lastRow}>
            <TouchableOpacity style={styles.emptyKey} />
            <TouchableOpacity style={styles.numberKey} onPress={() => handleKeyPress('0', code.indexOf(''))}>
              <Text style={styles.numberText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberKey} onPress={handleDelete}>
              <Ionicons name="backspace" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 2,
    width: '100%',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  backButtonContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  topContent: {
    alignItems: 'center',
    marginTop: '45%', // Adjusted spacing from the top
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    height: '40%',
    marginBottom: 20,
  },
  codeInput: {
    width: '20%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  resendText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
  resendLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#f2f2f2',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  numberKey: {
    width: '30%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  numberText: {
    fontSize: 20,
    fontWeight: '600',
  },
  lastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  emptyKey: {
    width: '28%',
    height: 60,
  },
});

export default VerificationCode;

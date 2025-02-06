// CustomSwitch.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomSwitch = ({ initialState = false, onToggle }) => {
  const [isEnabled, setIsEnabled] = useState(initialState);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    if (onToggle) {
      onToggle(!isEnabled); // Notify parent component about the toggle
    }
  };

  return (
    <View style={styles.container}>
      {/* Switch container */}
      <TouchableOpacity
        style={[styles.switch, isEnabled ? styles.switchOn : styles.switchOff]}
        onPress={toggleSwitch}
      >
        {/* ON and OFF text inside the switch */}
        <Text
          style={[styles.switchText, isEnabled ? styles.textOn : styles.textOff]}
        >
          {isEnabled ? 'ON' : 'OFF'}
        </Text>
        {/* Circle Thumb */}
        <View
          style={[
            styles.thumb,
            isEnabled ? styles.thumbOn : styles.thumbOff,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 83, // Adjust width
    height: 35, // Adjust height
    borderRadius: 25, // Make it rounded
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'row',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  switchText: {
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute', // Text inside switch
    top: '50%',
    transform: [{ translateY: -10 }], // Center text vertically
    color: '#fff', // Default white color for text
  },
  switchOn: {
    backgroundColor: '#00D0DD',
    // borderColor: '#007BFF',
  },
  switchOff: {
    // backgroundColor: '#f4f3f4',
    // borderColor: '#767577',
  },
  textOn: {
    color: '#fff',
  },
  textOff: {
    color: 'red',
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12, // Make the thumb circular
    backgroundColor: '#fff',
    transition: 'transform 0.3s ease', // Smooth transition for thumb movement
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4, // For Android shadow
  },
  thumbOn: {
    left: 55, // Position the thumb on the right side when ON
  },
  thumbOff: {
    left: 0, // Position the thumb on the left side when OFF
  },
});

export default CustomSwitch;
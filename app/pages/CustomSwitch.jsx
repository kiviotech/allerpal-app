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
    borderWidth: 1, // Add border
    borderColor: '#888', // Border color
  },
  switchText: {
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute', // Text inside switch
    top: '50%',
    transform: [{ translateY: -10 }], // Center text vertically
  },
  switchOn: {
    backgroundColor: '#00D0DD',
    borderColor: '#00A0AA', // Darker border when ON
  },
  switchOff: {
    backgroundColor: '#f4f3f4',
    borderColor: '#888', // Gray border when OFF
  },
  textOn: {
    color: '#fff',
  },
  textOff: {
    color: 'red',
    marginLeft:9,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12, // Make the thumb circular
    backgroundColor: '#fff',
    borderWidth: 1, // Add border to thumb
    borderColor: '#888', // Border color for thumb
  },
  thumbOn: {
    left: 55, // Position the thumb on the right side when ON
  },
  thumbOff: {
    left: 5, // Position the thumb on the left side when OFF
  },
});

export default CustomSwitch;

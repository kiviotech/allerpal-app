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
      <TouchableOpacity
        style={[styles.switch, isEnabled ? styles.switchOn : styles.switchOff]}
        onPress={toggleSwitch}
      >
        <Text
          style={[styles.switchText, isEnabled ? styles.textOn : styles.textOff]}
        >
          {isEnabled ? 'ON' : 'OFF'}
        </Text>
        
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
    width: 70,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#888',
  },
  switchText: {
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  switchOn: {
    backgroundColor: '#00D0DD',
    borderColor: '#00A0AA',
  },
  switchOff: {
    backgroundColor: '#f4f3f4',
    borderColor: '#888',
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
    width: 22,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#888',
  },
  thumbOn: {
    left: 44, // Position the thumb on the right side when ON
  },
  thumbOff: {
    left: 2, // Position the thumb on the left side when OFF
  },
});

export default CustomSwitch;

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import colors from '../../constants/colors'
import fonts from '../../constants/fonts';

const CustomButton = ({
  buttonStyle,
  onPress,
  textStyle,
  text = "Button",
  borderRadius // Remove the default value from here
}) => {
  const mergedStyle = {
    borderRadius: borderRadius ?? (buttonStyle?.borderRadius || 30), // Use buttonStyle borderRadius if provided, else use 30
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, mergedStyle]} // Combine default styles with custom styles
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 20, // Default padding
    justifyContent: 'center', // Default alignment
    alignItems: 'center', // Default alignment
    backgroundColor: colors.secondary,
    width: '100%'

  },
  text: {
    textAlign: 'center', // Default text alignment
    fontSize: 14,
    fontFamily: fonts.inter500,
    color: '#FFFFFF'
  }
})

export default CustomButton

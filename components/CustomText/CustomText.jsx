import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import colors from '../../constants/colors'
import fonts from '../../constants/fonts'

const CustomText = ({ title, textStyle }) => {
  return (
    <View>
      <Text style={styles.text}> {title}</Text>
    </View>
  )
}

export default CustomText
const styles = StyleSheet.create({
  text: {
    color: colors.loginPageTextColor,
    fontFamily: fonts.inter700,
    fontSize: 17,
    marginTop: 25
  }
})
import { View, Text, SafeAreaView, ScrollView,StyleSheet } from 'react-native'
import React from 'react'
import Post from "./Post"

import CommunityApp from './CommunityApp'
import Footer from './Footer'


const MyFeedPage = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
  
     
     <View>
        <Post />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
    
      <CommunityApp showFooter={false} />
    </ScrollView>
    <View>
    <Footer  />
    </View>
    
  </SafeAreaView>
  )
}

 const styles = StyleSheet.create ({
  safeContainer:{
    width:'100%',
    height:'100%'
  },
  

 })

export default MyFeedPage
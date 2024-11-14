
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommunityApp from './CommunityApp';
import { SafeAreaView } from 'react-native-web';
import { TouchableOpacity } from 'react-native';
import ViewCommunity from "./ViewCommunity"
import {useRouter} from "expo-router"

const Feed = () => {
    const router = useRouter()
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{marginLeft:10,display:'flex',flexDirection:'row'}}>
<TouchableOpacity onPress={()=>router.push('./ViewCommunity')}>
<Ionicons name="arrow-back" size={28} color="#333" />
</TouchableOpacity>
          <Text style={styles.title}>Communities Feed</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <CommunityApp showFooter={false} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feed;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Ensure the SafeAreaView takes up the full height of the screen
    backgroundColor: '#f5f5f5',
  },
  container: {
    flexDirection: 'row', // Header layout with icon and text
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    height: 50,
    width: '100%',
  },
  header: {
    flexDirection: 'row', // Align icon and text in a row
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  scrollContainer: {
    padding: 10, // Optional padding for the scrollable content
  },
});

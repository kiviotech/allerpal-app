

import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Poll from "./Poll"
import { useRouter } from 'expo-router';

const CommunityPost = () => {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people-circle" size={28} color="#333" />
        <Text style={styles.title}>Communities</Text>
      </View>
      <View style={styles.postContainer}>
        <View style={styles.postInputSection}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} // Placeholder profile image
            style={styles.profileImage}
          />
          <TextInput
            style={styles.input}
            placeholder="write your post here"
            placeholderTextColor="#aaa"
          />
          
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.iconRow}>
          <TouchableOpacity>
            <Ionicons name="image-outline" size={26} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="videocam-outline" size={26} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>router.push('./Poll')}>
            <Ionicons name="stats-chart-outline" size={26} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishButton}>
            <Text style={styles.publishButtonText}>Publish Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // 3D effect on Android
  },
  postInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//   },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  publishButton: {
    backgroundColor: '#00C9FF',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  horizontalLine:{
    height:1,
    backgroundColor:'#ddd'
  }
});

export default CommunityPost;

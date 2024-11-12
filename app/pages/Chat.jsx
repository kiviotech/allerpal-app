import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icon library
import ChatScreen from './ChatScreen';
import Footer from "./Footer"
import {useRouter} from 'expo-router'
const DATA = [
  { id: '1', name: 'Alyce Lambo', date: '10th Sept, 2024', message: 'Really convenient and the points system ....', image: 'https://source.unsplash.com/100x100/?face,person' },
  { id: '2', name: 'Alyce Lambo', date: '10th Sept, 2024', message: 'Really convenient and the points system ....', image: 'https://source.unsplash.com/100x100/?face,smile' },
  { id: '3', name: 'Alyce Lambo', date: '10th Sept, 2024', message: 'Really convenient and the points system ....', image: 'https://source.unsplash.com/100x100/?face,man' },
  { id: '4', name: 'Alyce Lambo', date: '10th Sept, 2024', message: 'Really convenient and the points system ....', image: 'https://source.unsplash.com/100x100/?face,woman' },
  { id: '5', name: 'Alyce Lambo', date: '10th Sept, 2024', message: 'Really convenient and the points system ....', image: 'https://source.unsplash.com/100x100/?face,people' },
];

const MessageItem = ({ name, date, message, image }) => (
  <View style={styles.messageContainer}>
    <Image
      source={{ uri: "https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg" }}
      style={styles.avatar}
    />
    <View style={styles.textContainer}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  </View>
);

const Chat = () => {
  const handleBackPress = () => {
    // Handle back button press
    console.log('Back button pressed');
  };
  const router = useRouter()

  return (
   <SafeAreaView style={styles.AreaContainer}>
     <View style={styles.container}>
      {/* Header with Back Arrow and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Message List */}
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push('./ChatScreen')}>
          <MessageItem
            name={item.name}
            date={item.date}
            message={item.message}
            image={item.image}
          />
        </TouchableOpacity>
        )}
      />
    </View>
   <View style={styles.footer}>
   <Footer />
   </View>
   </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    AreaContainer: {
        flex: 1,
        padding: 10,
        // marginTop: 20,
         backgroundColor: '#fff',
        width: "100%",
        minHeight: '80%'


    },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    backgroundColor:'lightgray'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  message: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  footer:{
    display:'flex',
    
    
  }

});

export default Chat;

import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const chats = [
  { id: 1, name: "John Doe", lastMessage: "Hey, how are you?", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Alice Smith", lastMessage: "Let's meet up!", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: 3, name: "Bob Johnson", lastMessage: "I'll call you later.", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Emma Wilson", lastMessage: "Just got home!", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
];

const Chat = () => {
  const router = useRouter();

  const handleChatPress = (chat) => {
    router.push({ pathname: "/pages/ChatScreen", 
      // params: { chatId: chat.id, name: chat.name, avatar: chat.avatar } 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    elevation: 2,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default Chat;

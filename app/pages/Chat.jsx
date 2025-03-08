import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "../../useAuthStore";
import { createNewInbox, fetchInboxByuserId, fetchInboxByuserResto } from "../../src/services/inboxServices";
// import Resto from "../../assets/Resto.png"

const chats = [
  { id: 1, name: "John Doe", lastMessage: "Hey, how are you?", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Alice Smith", lastMessage: "Let's meet up!", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: 3, name: "Bob Johnson", lastMessage: "I'll call you later.", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Emma Wilson", lastMessage: "Just got home!", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
];

const Chat = () => {
  const { user } = useAuthStore();
  const { restaurantId } = useLocalSearchParams();
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userId = user?.id

  useEffect(() => {
    const fetchInbox = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        if (restaurantId) {
          const inboxResponse = await fetchInboxByuserResto(userId, restaurantId);
          if (inboxResponse?.data?.length > 0) {
            setInbox(inboxResponse?.data);
            const chatId = inboxResponse?.data[0]?.documentId;
            if (chatId) {
              router.push({
                pathname: "/pages/ChatScreen",
                params: { chatId: chatId }
              });
            }
          } else {
            // If no inbox exists, create one
            const payload = {
              data: {
                user: userId,
                restaurant: restaurantId
              }
            }
            const newInbox = await createNewInbox(payload);
            if (newInbox?.data) {
              router.push({
                pathname: "/pages/ChatScreen",
                params: { chatId: newInbox.data.documentId }
              });
            }
          }
        } else {
          const userInbox = await fetchInboxByuserId(userId);
          setInbox(userInbox?.data || []);
        }
      } catch (error) {
        console.error("Error fetching inbox:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [userId, restaurantId]);

  const handleChatPress = (chat) => {
    router.push({
      pathname: "/pages/ChatScreen",
      params: { chatId: chat.documentId }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/pages/Home')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>
  
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : inbox.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Inbox is Empty</Text>
        </View>
      ) : (
        <FlatList
          data={inbox}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }} style={styles.avatar} />
              <View style={styles.chatInfo}>
                <Text style={styles.name}>{item?.restaurant?.name || "No restaurant name"}</Text>
                <Text style={styles.lastMessage}>
                  {item?.messages?.length > 0
                    ? item.messages[item.messages.length - 1].content
                    : "No messages yet"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  
});

export default Chat;

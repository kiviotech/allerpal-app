import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Rating } from "react-native-ratings";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Chat from "./Chat";
const messages = [
  {
    id: "1",
    type: "received",
    text: "Welcome to Lorem ipsum, how can we help you?",
    time: "10:15 AM",
  },
  { id: "2", type: "sent", text: "Lorem ipsum", time: "10:16 AM" },
  {
    id: "3",
    type: "sent",
    text: "A supportive space where practitioners and enthusiasts.",
    time: "10:17 AM",
  },
  {
    id: "4",
    type: "received",
    text: "Please rate chat support experience",
    time: "10:18 AM",
    ratingRequest: true,
  },
];

const ChatScreen = () => {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [rating, setRating] = useState(4);

  const renderMessage = ({ item }) => {
    if (item.ratingRequest) {
      return (
        <View style={styles.ratingContainer}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Rating
            startingValue={rating}
            imageSize={20}
            onFinishRating={setRating}
            style={styles.rating}
          />
        </View>
      );
    }
    return (
      <View
        style={[
          styles.messageContainer,
          item.type === "sent" ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <View style={styles.ArrowContainer}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => router.push("./Chat")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.header}>Lorem ipsum</Text>
      </View>

      {/* Chat messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Send message"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    paddingTop: 20, // Added padding to move content down
  },
  backArrow: {
    marginLeft: 15,
    marginTop: 10, // Add some space above the back arrow
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 15,
    color: "#000",
    marginTop: 10, // Move header down a bit
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80, // Space for the input area
  },
  messageContainer: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#00aced",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  timeText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  ratingContainer: {
    alignSelf: "flex-start",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  rating: {
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#00aced",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  ArrowContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

export default ChatScreen;

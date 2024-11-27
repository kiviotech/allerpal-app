import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";

const ChatScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", sender: "bot" },
  ]);
  const [userInput, setUserInput] = useState("");
  const flatListRef = useRef(null); // Ref for the FlatList

  const handleSendMessage = () => {
    if (userInput.trim()) {
      addMessage(userInput, "user");
      setUserInput("");
      setTimeout(() => generateAndAddResponse(), 300);
    }
  };

  const generateAndAddResponse = () => {
    const botResponse = "Thank you for chatting with us. We will inform the restaurant and get back to you after 24 hours.";
    addMessage(botResponse, "bot");
  };

  const addMessage = (text, sender) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender }]);
    // Scroll to the end of the chat
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Arrow and Title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/pages/Home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Support</Text>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef} // Attach ref to FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === "user"
                ? styles.userMessageContainer
                : styles.botMessageContainer,
            ]}
          >
            <Text
              style={
                item.sender === "user" ? styles.userMessage : styles.botMessage
              }
            >
              {item.text}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        } // Auto-scroll when new messages are added
      />

      {/* Input Field */}
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type a message..."
          />
          <Button title="Send" onPress={handleSendMessage} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#2196F3",
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE",
  },
  userMessage: {
    color: "#FFF",
  },
  botMessage: {
    color: "#000",
  },
  footer: {
    backgroundColor: "#FFF",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatScreen;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
// } from "react-native";
// import { Rating } from "react-native-ratings";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import Chat from "./Chat";
// const messages = [
//   {
//     id: "1",
//     type: "received",
//     text: "Welcome to Lorem ipsum, how can we help you?",
//     time: "10:15 AM",
//   },
//   { id: "2", type: "sent", text: "Lorem ipsum", time: "10:16 AM" },
//   {
//     id: "3",
//     type: "sent",
//     text: "A supportive space where practitioners and enthusiasts.",
//     time: "10:17 AM",
//   },
//   {
//     id: "4",
//     type: "received",
//     text: "Please rate chat support experience",
//     time: "10:18 AM",
//     ratingRequest: true,
//   },
// ];

// const ChatScreen = () => {
//   const router = useRouter();
//   const [inputText, setInputText] = useState("");
//   const [rating, setRating] = useState(4);

//   const renderMessage = ({ item }) => {
//     if (item.ratingRequest) {
//       return (
//         <View style={styles.ratingContainer}>
//           <Text style={styles.messageText}>{item.text}</Text>
//           <Rating
//             startingValue={rating}
//             imageSize={20}
//             onFinishRating={setRating}
//             style={styles.rating}
//           />
//         </View>
//       );
//     }
//     return (
//       <View
//         style={[
//           styles.messageContainer,
//           item.type === "sent" ? styles.sentMessage : styles.receivedMessage,
//         ]}
//       >
//         <Text style={styles.messageText}>{item.text}</Text>
//         <Text style={styles.timeText}>{item.time}</Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Back Arrow */}
//       <View style={styles.ArrowContainer}>
//         <TouchableOpacity
//           style={styles.backArrow}
//           onPress={() => router.push("./Chat")}
//         >
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>

//         {/* Header */}
//         <Text style={styles.header}>Lorem ipsum</Text>
//       </View>

//       {/* Chat messages */}
//       <FlatList
//         data={messages}
//         renderItem={renderMessage}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.chatContainer}
//       />

//       {/* Input area */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Send message"
//           value={inputText}
//           onChangeText={setInputText}
//         />
//         <TouchableOpacity style={styles.sendButton}>
//           <Text style={styles.sendButtonText}>➤</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "lightgray",
//     paddingTop: 20, // Added padding to move content down
//   },
//   backArrow: {
//     marginLeft: 15,
//     marginTop: 10, // Add some space above the back arrow
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     padding: 15,
//     color: "#000",
//     marginTop: 10, // Move header down a bit
//   },
//   chatContainer: {
//     paddingHorizontal: 10,
//     paddingBottom: 80, // Space for the input area
//   },
//   messageContainer: {
//     maxWidth: "70%",
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 5,
//   },
//   receivedMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: "#e0e0e0",
//   },
//   sentMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: "#00aced",
//   },
//   messageText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   timeText: {
//     fontSize: 12,
//     color: "#888",
//     marginTop: 5,
//     alignSelf: "flex-end",
//   },
//   ratingContainer: {
//     alignSelf: "flex-start",
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 10,
//   },
//   rating: {
//     marginTop: 5,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#ccc",
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     marginRight: 10,
//   },
//   sendButton: {
//     backgroundColor: "#00aced",
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 10,
//   },
//   sendButtonText: {
//     color: "#fff",
//     fontSize: 18,
//   },
//   ArrowContainer: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
// });

// export default ChatScreen;





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

// const SESSION_TIMEOUT = 2 * 60 * 1000; // 2 minutes in milliseconds

const ChatScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", sender: "bot" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false); // State to control input field
  const flatListRef = useRef(null); // Ref for the FlatList

  const handleSendMessage = () => {
    if (userInput.trim()) {
      addMessage(userInput, "user");
      setUserInput("");
      setTimeout(() => generateAndAddResponse(userInput.toLowerCase()), 300);
    }
  };

  const generateAndAddResponse = (userMessage) => {
    if (["hi", "hello", "hey"].includes(userMessage)) {
      botResponse = "Hello! How can I assist you today?";
    } else if (userMessage.includes("restaurant")) {
      botResponse =
        "Thank you for chatting with us. We will inform the restaurant and get back to you after 24 hours.";
        setIsInputDisabled(true)
    } else {
      botResponse = "Ask me about any restaurant"
    }
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
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
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
            editable={!isInputDisabled} // Disable input when isInputDisabled is true
          />
          <Button title="Send" onPress={handleSendMessage} 
            disabled={isInputDisabled} // Disable button when isInputDisabled is true
          />
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

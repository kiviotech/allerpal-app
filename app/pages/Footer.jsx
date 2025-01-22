// // // import React, { useState } from "react";
// // // import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// // // import { Ionicons } from "@expo/vector-icons";
// // // import { useRouter } from "expo-router";

// // // const Footer = () => {
// // //   const [activeTab, setActiveTab] = useState("Home");
// // //   const router = useRouter();

// // //   // Helper function to handle tab press
// // //   const handleTabPress = (tabName, route) => {
// // //     setActiveTab(tabName); // Update active tab
// // //     if (route) {
// // //       router.push(route); // Navigate only if a route is provided
// // //     }
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <View style={styles.footer}>
// // //         <TouchableOpacity
// // //           style={styles.footerItem}
// // //           onPress={() => handleTabPress("Home", "pages/Home")}
// // //         >
// // //           <Ionicons
// // //             name="home-outline"
// // //             size={24}
// // //             color={activeTab === "Home" ? "#00aced" : "#888"}
// // //           />
// // //           <Text
// // //             style={[
// // //               styles.footerText,
// // //               activeTab === "Home" && styles.activeFooterText,
// // //             ]}
// // //           >
// // //             Home
// // //           </Text>
// // //         </TouchableOpacity>

// // //         <TouchableOpacity
// // //           style={styles.footerItem}
// // //           onPress={() => handleTabPress("Search", "pages/Search")}
// // //         >
// // //           <Ionicons
// // //             name="search-outline"
// // //             size={24}
// // //             color={activeTab === "Search" ? "#00aced" : "#888"}
// // //           />
// // //           <Text
// // //             style={[
// // //               styles.footerText,
// // //               activeTab === "Search" && styles.activeFooterText,
// // //             ]}
// // //           >
// // //             Search
// // //           </Text>
// // //         </TouchableOpacity>

// // //         <TouchableOpacity
// // //           style={styles.footerItem}
// // //           onPress={() => handleTabPress("Community", "pages/Community")}
// // //         >
// // //           <Ionicons
// // //             name="people-outline"
// // //             size={24}
// // //             color={activeTab === "Community" ? "#00aced" : "#888"}
// // //           />
// // //           <Text
// // //             style={[
// // //               styles.footerText,
// // //               activeTab === "Community" && styles.activeFooterText,
// // //             ]}
// // //           >
// // //             Community
// // //           </Text>
// // //         </TouchableOpacity>

// // //         <TouchableOpacity
// // //           style={styles.footerItem}
// // //           onPress={() => handleTabPress("Chat", "pages/Chat")}
// // //         >
// // //           <Ionicons
// // //             name="chatbubble-outline"
// // //             size={24}
// // //             color={activeTab === "Chat" ? "#00aced" : "#888"}
// // //           />
// // //           <Text
// // //             style={[
// // //               styles.footerText,
// // //               activeTab === "Chat" && styles.activeFooterText,
// // //             ]}
// // //           >
// // //             Chat
// // //           </Text>
// // //         </TouchableOpacity>

// // //         <TouchableOpacity
// // //           style={styles.footerItem}
// // //           onPress={() => {
// // //             handleTabPress("Profile");
// // //             router.push("pages/Account");
// // //           }}
// // //         >
// // //           <Ionicons
// // //             name="person-outline"
// // //             size={24}
// // //             color={activeTab === "Profile" ? "#00aced" : "#888"}
// // //           />
// // //           <Text
// // //             style={[
// // //               styles.footerText,
// // //               activeTab === "Profile" && styles.activeFooterText,
// // //             ]}
// // //           >
// // //             Account
// // //           </Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: "#f5f5f5",
// // //     marginTop: 30,
// // //   },
// // //   footer: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-around",
// // //     backgroundColor: "#fff",
// // //     paddingVertical: 5,
// // //     borderTopWidth: 1,
// // //     borderTopColor: "#ddd",
// // //   },
// // //   footerItem: {
// // //     alignItems: "center",
// // //   },
// // //   footerText: {
// // //     fontSize: 12,
// // //     color: "#888",
// // //     marginTop: 5,
// // //   },
// // //   activeFooterText: {
// // //     color: "#00aced",
// // //   },
// // // });

// // // export default Footer;

// // import React from "react";
// // import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";
// // import { useRouter, usePathname } from "expo-router"; // Added usePathname to get the current route dynamically

// // const Footer = () => {
// //   const router = useRouter();
// //   const currentRoute = usePathname(); // Get the current active route

// //   // Helper function to handle tab press
// //   const handleTabPress = (route) => {
// //     if (route) {
// //       router.push(route); // Navigate to the specified route
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.footer}>
// //         {/* Home Tab */}
// //         <TouchableOpacity
// //           style={styles.footerItem}
// //           onPress={() => handleTabPress("pages/Home")}
// //         >
// //           <Ionicons
// //             name={currentRoute === "pages/Home" ? "home" : "home-outline"} // Highlight home icon if current route is Home
// //             size={24}
// //             color={currentRoute === "pages/Home" ? "#00aced" : "#888"} // Change icon color dynamically
// //           />
// //           <Text
// //             style={[
// //               styles.footerText,
// //               currentRoute === "pages/Home" && styles.activeFooterText, // Highlight text dynamically
// //             ]}
// //           >
// //             Home
// //           </Text>
// //         </TouchableOpacity>

// //         {/* Search Tab */}
// //         <TouchableOpacity
// //           style={styles.footerItem}
// //           onPress={() => handleTabPress("pages/Search")}
// //         >
// //           <Ionicons
// //             name={currentRoute === "pages/Search" ? "search" : "search-outline"} // Highlight search icon if current route is Search
// //             size={24}
// //             color={currentRoute === "pages/Search" ? "#00aced" : "#888"} // Change icon color dynamically
// //           />
// //           <Text
// //             style={[
// //               styles.footerText,
// //               currentRoute === "pages/Search" && styles.activeFooterText, // Highlight text dynamically
// //             ]}
// //           >
// //             Search
// //           </Text>
// //         </TouchableOpacity>

// //         {/* Community Tab */}
// //         <TouchableOpacity
// //           style={styles.footerItem}
// //           onPress={() => handleTabPress("pages/Community")}
// //         >
// //           <Ionicons
// //             name={
// //               currentRoute === "pages/Community" ? "people" : "people-outline"
// //             } // Highlight community icon if current route is Community
// //             size={24}
// //             color={currentRoute === "pages/Community" ? "#00aced" : "#888"} // Change icon color dynamically
// //           />
// //           <Text
// //             style={[
// //               styles.footerText,
// //               currentRoute === "pages/Community" && styles.activeFooterText, // Highlight text dynamically
// //             ]}
// //           >
// //             Community
// //           </Text>
// //         </TouchableOpacity>

// //         {/* Chat Tab */}
// //         <TouchableOpacity
// //           style={styles.footerItem}
// //           onPress={() => handleTabPress("pages/Chat")}
// //         >
// //           <Ionicons
// //             name={
// //               currentRoute === "pages/Chat"
// //                 ? "chatbubble"
// //                 : "chatbubble-outline"
// //             } // Highlight chat icon if current route is Chat
// //             size={24}
// //             color={currentRoute === "pages/Chat" ? "#00aced" : "#888"} // Change icon color dynamically
// //           />
// //           <Text
// //             style={[
// //               styles.footerText,
// //               currentRoute === "pages/Chat" && styles.activeFooterText, // Highlight text dynamically
// //             ]}
// //           >
// //             Chat
// //           </Text>
// //         </TouchableOpacity>

// //         {/* Profile Tab */}
// //         <TouchableOpacity
// //           style={styles.footerItem}
// //           onPress={() => handleTabPress("pages/Account")}
// //         >
// //           <Ionicons
// //             name={
// //               currentRoute === "pages/Account" ? "person" : "person-outline"
// //             } // Highlight profile icon if current route is Account
// //             size={24}
// //             color={currentRoute === "pages/Account" ? "#00aced" : "#888"} // Change icon color dynamically
// //           />
// //           <Text
// //             style={[
// //               styles.footerText,
// //               currentRoute === "pages/Account" && styles.activeFooterText, // Highlight text dynamically
// //             ]}
// //           >
// //             Account
// //           </Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#f5f5f5",
// //     marginTop: 30,
// //   },
// //   footer: {
// //     flexDirection: "row",
// //     justifyContent: "space-around",
// //     backgroundColor: "#fff",
// //     paddingVertical: 5,
// //     borderTopWidth: 1,
// //     borderTopColor: "#ddd",
// //   },
// //   footerItem: {
// //     alignItems: "center",
// //   },
// //   footerText: {
// //     fontSize: 12,
// //     color: "#888",
// //     marginTop: 5,
// //   },
// //   activeFooterText: {
// //     color: "#00aced",
// //   },
// // });

// // export default Footer;

// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// const Footer = () => {
//   const [activeTab, setActiveTab] = useState("Home");
//   const router = useRouter();

//   // Helper function to handle tab press
//   const handleTabPress = (tabName, route) => {
//     setActiveTab(tabName); // Update active tab
//     if (route) {
//       router.push(route); // Navigate only if a route is provided
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={styles.footerItem}
//           onPress={() => handleTabPress("Home", "pages/Home")}
//         >
//           <Ionicons
//             name="home-outline"
//             size={24}
//             color={activeTab === "Home" ? "#00aced" : "#888"}
//           />
//           <Text
//             style={[
//               styles.footerText,
//               activeTab === "Home" && styles.activeFooterText,
//             ]}
//           >
//             Home
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.footerItem}
//           onPress={() => handleTabPress("Search", "pages/Search")}
          
//         >
        
//           <Ionicons
//             name="search-outline"
//             size={24}
//             color={activeTab === "Search" ? "#00aced" : "#888"}
//           />
//           <Text
//             style={[
//               styles.footerText,
//               activeTab === "Search" && styles.activeFooterText,
//             ]}
//           >
//             Search
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.footerItem}
//           onPress={() => handleTabPress("Community", "pages/Community")}
//         >
//           <Ionicons
//             name="people-outline"
//             size={24}
//             color={activeTab === "Community" ? "#00aced" : "#888"}
//           />
//           <Text
//             style={[
//               styles.footerText,
//               activeTab === "Community" && styles.activeFooterText,
//             ]}
//           >
//             Community
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.footerItem}
//           onPress={() => handleTabPress("Chat", "pages/Chat")}
//         >
//           <Ionicons
//             name="chatbubble-outline"
//             size={24}
//             color={activeTab === "Chat" ? "#00aced" : "#888"}
//           />
//           <Text
//             style={[
//               styles.footerText,
//               activeTab === "Chat" && styles.activeFooterText,
//             ]}
//           >
//             Chat
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.footerItem}
//           onPress={() => {
//             handleTabPress("Profile");
//             router.push("pages/Account");
//           }}
//         >
//           <Ionicons
//             name="person-outline"
//             size={24}
//             color={activeTab === "Profile" ? "#00aced" : "#888"}
//           />
//           <Text
//             style={[
//               styles.footerText,
//               activeTab === "Profile" && styles.activeFooterText,
//             ]}
//           >
//             Account
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     marginTop: 30,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "#fff",
//     paddingVertical: 5,
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//   },
//   footerItem: {
//     alignItems: "center",
//   },
//   footerText: {
//     fontSize: 12,
//     color: "#888",
//     marginTop: 5,
//   },
//   activeFooterText: {
//     color: "#00aced",
//   },
// });

// export default Footer; 

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const Footer = () => {
  const router = useRouter();
  const currentRoute = usePathname(); // Get the current active route

  // Helper function to check if the tab is active
  const isActiveTab = (route) => currentRoute === route;

  // Helper function to handle tab press
  const handleTabPress = (route) => {
    if (route) {
      router.push(route); // Navigate to the specified route
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress("/pages/Home")}
        >
          <Ionicons
            name={isActiveTab("/pages/Home") ? "home" : "home-outline"}
            size={24}
            color={isActiveTab("/pages/Home") ? "#00aced" : "#888"}
          />
          <Text
            style={[
              styles.footerText,
              isActiveTab("/pages/Home") && styles.activeFooterText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Search Tab */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress("/pages/Search")}
        >
          <Ionicons
            name={isActiveTab("/pages/Search") ? "search" : "search-outline"}
            size={24}
            color={isActiveTab("/pages/Search") ? "#00aced" : "#888"}
          />
          <Text
            style={[
              styles.footerText,
              isActiveTab("/pages/Search") && styles.activeFooterText,
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>

        {/* Community Tab */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress("/pages/Blog")}
        >
          <Ionicons
            name={isActiveTab("/pages/Blog") ? "newspaper" : "newspaper-outline"}
            size={24}
            color={isActiveTab("/pages/Blog") ? "#00aced" : "#888"}
          />
          <Text
            style={[
              styles.footerText,
              isActiveTab("/pages/Blog") && styles.activeFooterText,
            ]}
          >
            Blog
          </Text>
        </TouchableOpacity>

        {/* Chat Tab */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress("/pages/Chat")}
        >
          <Ionicons
            name={
              isActiveTab("/pages/Chat") ? "chatbubble" : "chatbubble-outline"
            }
            size={24}
            color={isActiveTab("/pages/Chat") ? "#00aced" : "#888"}
          />
          <Text
            style={[
              styles.footerText,
              isActiveTab("/pages/Chat") && styles.activeFooterText,
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress("/pages/Account")}
        >
          <Ionicons
            name={isActiveTab("/pages/Account") ? "person" : "person-outline"}
            size={24}
            color={isActiveTab("/pages/Account") ? "#00aced" : "#888"}
          />
          <Text
            style={[
              styles.footerText,
              isActiveTab("/pages/Account") && styles.activeFooterText,
            ]}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  activeFooterText: {
    color: "#00aced",
  },
});

export default Footer;

import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { logout } from "../../src/utils/auth";
import useAllergyStore from "../../src/stores/allergyStore";
import { deleteToken } from "../../src/utils/storage";

const { width } = Dimensions.get("window");

const Sidebar = ({ isVisible, onClose }) => {
    const router = useRouter();
    const currentRoute = usePathname();
    const slideAnim = useRef(new Animated.Value(width)).current; // Start off-screen
    const isActiveTab = (route) => currentRoute === route;
    const [isModalVisible, setModalVisible] = useState(false); // Combined modal state
    const clearAllergies = useAllergyStore((state) => state.clearAllergies);
    const [modalContent, setModalContent] = useState({
        message: "",
        isSignOut: false,
    });

    const handleTabPress = (route) => {
        if (route) {
            router.push(route); // Navigate to the specified route
        }
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isVisible ? width * 0.55 : width, // Sidebar width set to 50%
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isVisible]);

    const showModal = (message, isSignOut = false) => {
        setModalContent({ message, isSignOut });
        setModalVisible(true);
    };

    const handleSignOut = () => {
        setModalVisible(false);
        router.replace("auth/Login");
        logout();
        clearAllergies();
        deleteToken();
    };

    return (
        <>
            {/* Close Sidebar when clicking outside */}
            {isVisible && <TouchableOpacity style={styles.overlay} onPress={onClose} />}

            {/* Sidebar */}
            <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
                <View style={styles.menu}>
                    <View style={styles.menuHeader}>
                        <Text style={styles.menuTitle}>Menu</Text>
                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.menuItem} onPress={() => handleTabPress("/pages/Home")}>
                        <Ionicons
                            name={isActiveTab("/pages/Home") ? "home" : "home-outline"}
                            size={24}
                            color={isActiveTab("/pages/Home") ? "#00aced" : "#888"}
                        />
                        <Text style={[styles.menuText, isActiveTab("/pages/Home") && styles.activeFooterText,]}>
                            Home
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => handleTabPress("/pages/Blog")}>
                        <Ionicons
                            name={isActiveTab("/pages/Blog") ? "newspaper" : "newspaper-outline"}
                            size={24}
                            color={isActiveTab("/pages/Blog") ? "#00aced" : "#888"}
                        />
                        <Text style={[styles.menuText, isActiveTab("/pages/Blog") && styles.activeFooterText,]}>
                            Blog
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => handleTabPress("/pages/Chat")}>
                        <Ionicons
                            name={isActiveTab("/pages/Chat") ? "chatbubble" : "chatbubble-outline"}
                            size={24}
                            color={isActiveTab("/pages/Chat") ? "#00aced" : "#888"}
                        />
                        <Text style={[styles.menuText, isActiveTab("/pages/Chat") && styles.activeFooterText,]}>
                            Inbox
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => handleTabPress("/pages/Account")}>
                        <Ionicons
                            name={isActiveTab("/pages/Account") ? "person" : "person-outline"}
                            size={24}
                            color={isActiveTab("/pages/Account") ? "#00aced" : "#888"}
                        />
                        <Text style={[styles.menuText, isActiveTab("/pages/Account") && styles.activeFooterText,]}>
                            Account
                        </Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="heart-outline" size={20} color="black" />
                        <Text style={styles.menuText}>Favorites</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="notifications-outline" size={20} color="black" />
                        <Text style={styles.menuText}>Notifications</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={styles.logoutContainer}>
                    <TouchableOpacity
                        style={styles.signOutButton}
                        onPress={() =>
                            showModal(
                                "Are you sure you want to logout?",
                                true // Pass `isSignOut` as true
                            )
                        }
                    >
                        <Text style={styles.signOutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setModalVisible(false)} // Close modal on back press
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{modalContent.title}</Text>
                            <Text style={styles.modalText}>{modalContent.message}</Text>
                            <View style={styles.buttonContainer}>
                                {modalContent.isSignOut && (
                                    <TouchableOpacity
                                        style={styles.signOutButton}
                                        onPress={handleSignOut}
                                    >
                                        <Text style={styles.signOutText}>Confirm</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>
                                        {modalContent.isSignOut ? "Cancel" : "Close"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </Animated.View>
        </>
    );
};

export default Sidebar;

const styles = StyleSheet.create({
    sidebar: {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: "45%", // Sidebar width set to 50%
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: -2, height: 0 },
        shadowRadius: 10,
        zIndex: 10,
    },
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0, // Covers the remaining screen
        // backgroundColor: "rgba(0,0,0,0.5)", // Dark background for outside area
    },
    menu: {
        flex: 1,
        padding: 20,
        marginTop: 25,
    },
    menuHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: "bold",
        // marginBottom: 20,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    menuText: {
        fontSize: 16,
        marginLeft: 10,
    },
    activeFooterText: {
        color: "#00aced",
    },
    logoutContainer: {
        padding: 30
    },
    signOutButton: {
        // marginBottom: 50,
        paddingVertical: 10,
        paddingHorizontal: 5,
        alignItems: "center",
        borderRadius: 10,
        shadowColor: "#00CFFF",
        shadowRadius: 8,
        elevation: 5,
    },
    signOutText: {
        color: "#00CFFF",
        fontSize: 20,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
    },
    buttonContainer: {
        width: 'auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 50,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#00CFFF",
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});
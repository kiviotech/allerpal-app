import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import useAuthStore from "../../useAuthStore"; // Corrected import path
import apiClient from "../../src/api/apiClient";

const ChangePassword = () => {
    const router = useRouter();
    const { jwt } = useAuthStore(state => state); // Access the jwt from the store
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const handlePasswordValidation = (password) => {
        setNewPassword(password);

        // Password validation
        if (/\s/.test(password)) {
            setPasswordError("Password should not contain spaces.");
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one uppercase letter.");
        // } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        //     setPasswordError("Password must contain at least one special character.");
        } else if (!/\d/.test(password)) {
            setPasswordError("Password must contain at least one number.");
        } else {
            setPasswordError(""); // Clear error message if validation passes
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorMessage("All fields are required.");
            return;
        }
        if (passwordError) {
            setErrorMessage("Please fix the password validation issues.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("New password and confirmation do not match.");
            return;
        }

        try {
            const response = await apiClient.post(
                "/auth/change-password",
                {
                    currentPassword,
                    password: newPassword,
                    passwordConfirmation: confirmPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            if (response.status === 200) {
                Alert.alert("Success", "Password changed successfully!");
                router.push("./Account");
            } else {
                alert(response.data.error?.message || "Failed to update password.");
            }
        } catch (error) {
            console.error("Password change error:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.message || "Failed to change password. Please try again.");
        }
    };

    const openConfirmationPopup = () => {
        setIsModalVisible(true);
    };

    const closeConfirmationPopup = () => {
        setIsModalVisible(false);
    };

    const confirmPasswordChange = () => {
        closeConfirmationPopup();
        handlePasswordChange();
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileArrow}>
                <TouchableOpacity onPress={() => router.push("./Account")}>
                    <Icon name="arrow-back-outline" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Change Password</Text>
            </View>

            <View style={styles.mainContainer}>
                {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

                {/* Current Password Input */}
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.label}>Current Password</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Current Password"
                            secureTextEntry={!isCurrentPasswordVisible}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}
                            style={styles.eyeIcon}
                        >
                            <Icon
                                name={isCurrentPasswordVisible ? "eye" : "eye-off"}
                                size={20}
                                color="#B3B3B3"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* New Password Input */}
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="New Password"
                            secureTextEntry={!isNewPasswordVisible}
                            value={newPassword}
                            onChangeText={handlePasswordValidation}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                        >
                            <Icon
                                name={isNewPasswordVisible ? "eye" : "eye-off"}
                                size={20}
                                color="#B3B3B3"
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                {/* Confirm Password Input */}
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm New Password"
                            secureTextEntry={!isConfirmPasswordVisible}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        >
                            <Icon
                                name={isConfirmPasswordVisible ? "eye" : "eye-off"}
                                size={20}
                                color="#B3B3B3"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Change Password Button */}
                <TouchableOpacity style={styles.button} onPress={openConfirmationPopup}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </View>

            {/* Confirmation Popup */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeConfirmationPopup}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Are you sure?</Text>
                        <Text style={styles.modalMessage}>Do you really want to change your password?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={closeConfirmationPopup}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={confirmPasswordChange}>
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    profileArrow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    mainContainer: {
        flex: 1,
        justifyContent: "center",
    },
    label: {
        fontSize: 14,
        color: '#777',
    },
    errorMessage: {
        color: 'red',
    },
    inputContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        padding: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        backgroundColor: "#00CFFF",
        width: "100%",
        padding: 15,
        borderRadius: 25,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "gray",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        marginRight: 10,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: "cyan",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "white",
    },
    confirmButtonText: {
        color: "white",
    },
});

export default ChangePassword;

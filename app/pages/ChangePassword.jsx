import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Use Ionicons for consistency
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

    const [validation, setValidation] = useState({
        minLength: false,
        hasNumber: false,
        noSpaces: true,
        hasUpperLower: false,
    });

    const handlePasswordChange = async () => {
        // Validate passwords
        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorMessage("All fields are required.");
            return;
        }
        if (currentPassword !== user.password) { // Check if current password matches the stored user password
            setErrorMessage("Current password is incorrect.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("New password and confirmation do not match.");
            return;
        }

        if (
            newPassword === confirmPassword &&
            validation.minLength &&
            validation.hasNumber &&
            validation.noSpaces &&
            validation.hasUpperLower
        ) {

            console.log('token', jwt, currentPassword, newPassword, confirmPassword)
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
                            Authorization: `Bearer ${jwt}`
                        },
                    }
                );
                if (response.status === 200) {
                    Alert.alert("Success", "Password changed successfully!");
                    router.push("./Account"); // Navigate back to account page
                } else {
                    alert(response.data.error?.message || "Failed to update password.");
                }
            } catch (error) {
                console.error("Password change error:", error.response?.data || error.message);
                Alert.alert("Error", error.response?.data?.message || "Failed to change password. Please try again.");
            }
        } else {
            alert("Please ensure all requirements are met.");
            Alert.alert("Please ensure all requirements are met.");
        }
    };

    // Optional: Handle password validation during input
    const handlePasswordValidation = (password) => {
        setNewPassword(password);
        setValidation({
            minLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            noSpaces: !/\s/.test(password),
            hasUpperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
        });
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
                                name={isCurrentPasswordVisible ? "eye-slash" : "eye"}
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
                            onChangeText={handlePasswordValidation} // Validates as user types
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                        >
                            <Icon
                                name={isNewPasswordVisible ? "eye-slash" : "eye"}
                                size={20}
                                color="#B3B3B3"
                            />
                        </TouchableOpacity>
                    </View>
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
                                name={isConfirmPasswordVisible ? "eye-slash" : "eye"}
                                size={20}
                                color="#B3B3B3"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Change Password Button */}
                <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </View>
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
        backgroundColor: "#00cccc",
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
});

export default ChangePassword;

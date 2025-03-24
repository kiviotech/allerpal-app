import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { resetPassword } from "../../src/utils/auth";
import { useToast } from "../ToastContext";

const CreateNewPassword = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { showToast } = useToast();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resetCode, setResetCode] = useState("");

    // Extract code from URL params when component mounts
    useEffect(() => {
        if (params?.code) {
            // Remove any quotes that might be in the code parameter
            let code = params.code;
            code = code.replace(/["']/g, '');
            console.log("Reset code from URL:", code);
            setResetCode(code);
        } else {
            // If no code is provided, show error and redirect
            showToast("Invalid or missing reset code", "error");
            setTimeout(() => {
                router.replace("/auth/Login");
            }, 2000);
        }
    }, [params]);

    const handlePasswordValidation = (password) => {
        setNewPassword(password);

        // Password validation
        if (/\s/.test(password)) {
            setPasswordError("Password should not contain spaces");
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one uppercase letter");
        } else if (!/\d/.test(password)) {
            setPasswordError("Password must contain at least one number");
        } else {
            setPasswordError(""); // Clear error message if validation passes
        }
    };

    const handleResetPassword = async () => {
        // Check if passwords are valid
        if (!newPassword || !confirmPassword) {
            setErrorMessage("All fields are required");
            return;
        }
        
        if (passwordError) {
            setErrorMessage("Please fix the password validation issues");
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setIsLoading(true);
        
        // Prepare the payload for the reset password function
        const data = {
            code: resetCode,
            password: newPassword,
            passwordConfirm: confirmPassword,
        };
        
        // Debug log the data
        console.log("Password reset data:", data);
        
        try {
            // Use the auth utility function instead of direct API call
            await resetPassword(data);
            
            setIsLoading(false);
            
            // Show success toast
            showToast("Password reset successful!", "success");
            
            // Navigate to success screen
            router.replace("/auth/passwordChangedNotification");
        } catch (error) {
            setIsLoading(false);
            console.error("Password reset error:", error.response?.data || error.message);
            
            // Show more detailed error message from the response
            let errorMsg = "Failed to reset password. Please try again.";
            
            if (error.response?.data?.error) {
                const apiError = error.response.data.error;
                errorMsg = apiError.message || errorMsg;
                
                // Handle specific error cases
                if (apiError.message === "Incorrect code provided") {
                    errorMsg = "The password reset link has expired or is invalid. Please request a new one.";
                }
            }
            
            setErrorMessage(errorMsg);
            showToast(errorMsg, "error");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace("/auth/Login")} style={styles.backButton}>
                    <Icon name="arrow-back-outline" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Reset Password</Text>
            </View>

            <View style={styles.mainContainer}>
                <Text style={styles.subtitle}>Create a new password for your account</Text>
                
                {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

                {/* New Password Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new password"
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
                    {passwordError ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm new password"
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

                {/* Reset Password Button */}
                <TouchableOpacity 
                    style={[styles.button, isLoading && styles.buttonDisabled]} 
                    onPress={handleResetPassword}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>Reset Password</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Toast will be rendered by the ToastContext */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 30,
        textAlign: "center",
    },
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        paddingBottom: 50,
    },
    inputSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#777',
        marginBottom: 8,
    },
    errorMessage: {
        color: 'red',
        marginTop: 5,
        fontSize: 12,
    },
    inputContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        padding: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        backgroundColor: "#00CFFF",
        width: "100%",
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    buttonDisabled: {
        backgroundColor: "#7AD7F0",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CreateNewPassword;

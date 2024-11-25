import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const ChangePassword = () => {
    const router = useRouter()
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match!");
            return;
        }

        // Handle password update logic here
        alert("Password changed successfully!");
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileArrow}>
                <TouchableOpacity onPress={() => router.push('./Account')}>
                    <Icon name="arrow-back-outline" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Change Password</Text>
            </View>

            <View style={styles.mainContainer}>
                {/* Current Password Input */}
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.label}>Current Password</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Current Password"
                            secureTextEntry={!showPassword.current}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                        >
                            <Text>{showPassword.current ? "" : "👁️"}</Text>
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
                            secureTextEntry={!showPassword.new}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                        >
                            <Text>{showPassword.new ? "" : "👁️"}</Text>
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
                            secureTextEntry={!showPassword.confirm}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                        >
                            <Text>{showPassword.confirm ? "" : "👁️"}</Text>
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
        marginTop: 10
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

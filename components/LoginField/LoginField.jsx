import { View, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import colors from '../../constants/colors';

const LoginField = ({ value = '', placeholder, handleChangeText, secureTextEntry = false, keyboardType = "default" }) => {
    const [showSecurityPassword, setShowSecurityPassword] = useState(false);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor='#006E75'
                value={value}
                onChangeText={handleChangeText}
                secureTextEntry={secureTextEntry && !showSecurityPassword} // Ensure secureTextEntry is applied only when required
                keyboardType={keyboardType}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    input: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        textAlign: 'center',
        paddingVertical: 19,
        elevation: 5, // Adds shadow
        fontSize: 15,
        fontFamily: 'Inter_400Regular'
    },
});

export default LoginField;

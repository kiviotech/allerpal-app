import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomButton from '../../components/CustomButton';
import LoginField from '../../components/LoginField';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import UserImageCommon from '../../components/UserImage/UserImageCommon';
import CustomCheckbox from '../../components/customCheckbox/CustomCheckbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import fonts from '../../constants/fonts';

const Signup = () => {
    const navigation = useNavigation();
    const [form, setForm] = useState({
        name: '',
        email: '',
    });

    const [errors, setErrors] = useState({
        name: null,
        email: null,
        profileType: null,
    });

    const router = useRouter();

    const [selectedProfileType, setSelectedProfileType] = useState(null); // State for profile type selection
    const [isNextButtonPressed, setIsNextButtonPressed] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false); // To track if form is complete

    const buttons = [
        { id: 1, label: 'Children' },
        { id: 2, label: 'Partner' },
        { id: 3, label: 'Friend' },
        { id: 4, label: 'Family' },
    ];
    const [selectedButton, setSelectedButton] = useState(null);

    const handleProfileTypeChange = (type) => {
        setSelectedProfileType(type); // Set the selected profile type
        setSelectedButton(null); // Reset relation buttons
    };

    const handleButtonPress = (id) => {
        setSelectedButton(id); // Set the selected button for relation
    };

    const validateEmail = (email) => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name) {
            newErrors.name = "Name is required";
        }

        if (!form.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!selectedProfileType) {
            newErrors.profileType = "Please select a profile type";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const signupNextScreen = () => {
        if (validateForm()) {
            // Directly navigate to allergyInformation page if profile type is "myself"
            if (selectedProfileType === 'myself') {
                router.push({
                    pathname: '/allergyInformation',
                    params: { name: form.name, email: form.email }
                });


            } else {
                setIsNextButtonPressed(true);
            }
        }
    };

    useEffect(() => {
        // Check if name, email, and selectedProfileType are filled
        if (form.name && form.email && selectedProfileType && validateEmail(form.email)) {
            setIsFormComplete(true);
        } else {
            setIsFormComplete(false);
        }
    }, [form, selectedProfileType]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={styles.container}>
                    <UserImageCommon shapeWidth={250} shapeHeight={250} />

                    {!isNextButtonPressed ? (
                        <View style={styles.content}>
                            <Text style={styles.header}>Sign Up</Text>
                            <View style={styles.inputContainer}>
                                <LoginField
                                    placeholder="Name"
                                    value={form.name}
                                    handleChangeText={(e) => setForm({ ...form, name: e })}
                                    keyboardType='text'
                                    style={styles.loginField}
                                />
                                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                                <View style={styles.passwordContainer}>
                                    <LoginField
                                        placeholder="Email Id"
                                        value={form.email}
                                        handleChangeText={(e) => setForm({ ...form, email: e })}
                                        keyboardType='email-address'
                                        style={styles.loginField}
                                    />
                                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                                </View>
                            </View>

                            {/* Profile Type Selection */}
                            <View style={styles.buttonContainer}>
                                <CustomCheckbox
                                    isChecked={selectedProfileType === 'myself'}
                                    onPress={() => handleProfileTypeChange('myself')}
                                    style={{ width: '15%' }}
                                />
                                <CustomButton
                                    buttonStyle={{ fontSize: 13, width: '85%' }}
                                    text="Creating Profile for Myself"
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <CustomCheckbox
                                    isChecked={selectedProfileType === 'someoneElse'}
                                    onPress={() => handleProfileTypeChange('someoneElse')}
                                    style={{ width: '15%' }}
                                />
                                <CustomButton
                                    buttonStyle={{ fontSize: 13, width: '85%' }}
                                    text="Creating Profile for Someone Else"
                                />
                            </View>
                            {errors.profileType && <Text style={styles.errorText}>{errors.profileType}</Text>}

                            <View style={styles.buttonContainer}>
                                <CustomButton
                                    buttonStyle={{ fontSize: 13, backgroundColor: isFormComplete ? colors.primary : colors.disabledButton }}
                                    text="Next"
                                    onPress={signupNextScreen}
                                    disabled={!isFormComplete} // Disable the button if form is incomplete
                                />
                            </View>
                        </View>
                    ) : selectedProfileType === 'someoneElse' ? ( // Only show relation if "Someone Else" is selected
                        <View style={styles.content}>
                            <View style={styles.buttonContainer}>
                                <CustomButton
                                    buttonStyle={{
                                        fontSize: 13,
                                        backgroundColor: colors.secondary,
                                        width: '100%'
                                    }}
                                    text="Relation with the user"
                                />
                            </View>
                            <View>
                                {buttons.map((button) => (
                                    <View key={button.id} style={styles.buttonContainer}>
                                        <CustomButton
                                            buttonStyle={{
                                                fontSize: 13,
                                                backgroundColor: selectedButton === button.id ? colors.selectedColor : colors.primary,
                                            }}
                                            textStyle={{ color: selectedButton === button.id ? colors.background : colors.loginPageTextColor, fontFamily: fonts.inter400 }}
                                            text={button.label}
                                            onPress={() => handleButtonPress(button.id)}
                                        />
                                    </View>
                                ))}
                            </View>
                            <View style={styles.buttonContainer}>
                                <CustomButton
                                    buttonStyle={{ fontSize: 13, backgroundColor: colors.secondary }}
                                    text="Done"
                                    onPress={() => navigation.navigate('(pages)/allergyInformation')}
                                />
                            </View>
                        </View>
                    ) : null}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        maxWidth: 400,
        paddingHorizontal: 16,
        padding: 15,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
    },
    header: {
        marginBottom: 20,
        color: '#006E75',
        fontSize: 15,
        fontFamily: fonts.inter400,
        textAlign: 'center',
    },
    passwordContainer: {
        marginTop: 20,
    },
    buttonContainer: {
        marginTop: 20,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});

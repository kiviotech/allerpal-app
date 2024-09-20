import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import LoginField from '../../components/LoginField';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import UserImageCommon from '../../components/UserImage/UserImageCommon';
import CustomCheckbox from '../../components/customCheckbox/CustomCheckbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // Import the hook
import fonts from '../../constants/fonts';

const Signup = () => {
    const navigation = useNavigation();
    const [form, setForm] = useState({
        name: '',
        email: '',
    });

    const router = useRouter();

    const [isCheckedFirst, setIsCheckedFirst] = useState(false);
    const [isCheckedSecond, setIsCheckedSecond] = useState(false);

    const handleCheckboxPress = (checkbox) => {
        checkbox === 'first' ? setIsCheckedFirst(!isCheckedFirst) : setIsCheckedSecond(!isCheckedSecond);
    };

    const [isNextButtonPressed, setIsNextButtonPressed] = useState(false);
    const signupNextScreen = () => {
        setIsNextButtonPressed(true);
    };

    const buttons = [
        { id: 1, label: 'Children' },
        { id: 2, label: 'Partner' },
        { id: 3, label: 'Friend' },
        { id: 4, label: 'Family' },
    ];
    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonPress = (id) => {
        setSelectedButton(id); // Set the selected button
    };

    const gotoMyAllergyInfoPage = async () => {
        try {
            router.replace('/allergyInformation');
        } catch (error) {
            console.error('Error', error.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={styles.container}>
                    <UserImageCommon shapeWidth={250} shapeHeight={250} />

                    {isNextButtonPressed === false ? (
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
                                <View style={styles.passwordContainer}>
                                    <LoginField
                                        placeholder="Email Id"
                                        value={form.email}
                                        handleChangeText={(e) => setForm({ ...form, email: e })}
                                        keyboardType='email-address'
                                        style={styles.loginField}
                                    />
                                </View>
                            </View>
                            <View style={styles.buttonContainer}>
                                <CustomCheckbox
                                    isChecked={isCheckedFirst}
                                    onPress={() => handleCheckboxPress('first')}
                                    style={{ width: '15%' }}
                                />
                                <CustomButton
                                    buttonStyle={{ fontSize: 13, width: '85%' }}
                                    text="Creating Profile for Myself"
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <CustomCheckbox
                                    isChecked={isCheckedSecond}
                                    onPress={() => handleCheckboxPress('second')}
                                    style={{ width: '15%' }}
                                />
                                <CustomButton
                                    buttonStyle={{ fontSize: 13, width: '85%' }}
                                    text="Creating Profile for Someone Else"
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <CustomButton
                                    buttonStyle={{ fontSize: 13 }}
                                    text="Next"
                                    onPress={signupNextScreen}
                                />
                            </View>
                        </View>
                    ) : (
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
                    )}
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
});
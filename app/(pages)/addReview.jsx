import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import icons from '../../constants/icons';
import CustomButton from '../../components/CustomButton';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

const addReview = () => {
    const [text, setText] = useState('');

    return (

        <SafeAreaView style={styles.safeArea}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.postContainer}>
                    <Image
                        source={icons.review}
                        style={styles.postImage}
                    />

                    <TextInput
                        placeholder="Text"
                        value={text}
                        onChangeText={(newText) => setText(newText)}
                        style={[styles.loginField, { textAlign: 'left' }]}
                    />

                    <Text style={[styles.postDescription]}>
                        Post Publically
                    </Text>
                    <CustomButton a
                        buttonStyle={{ fontSize: 14 }}
                        text='Post'

                    />
                    <Text style={[styles.postDescription, { textAlign: 'center', paddingTop: 15 }]}>
                        Cencel
                    </Text>
                </View>


            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollViewContent: {
        padding: 15
    },

    postContainer: {
        backgroundColor: colors.white,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        paddingTop: 10
    },

    loginField: {
        marginTop: 15,
        padding: 15,
        backgroundColor: colors.primary,
        borderRadius: 15,
        color: colors.loginPageTextColor,
        fontSize: 14,
        fontFamily: fonts.inter400
    },

    postImage: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 15
    },

    postDescription: {
        paddingTop: 20,
        paddingBottom: 20,
        fontFamily: fonts.inter400,
        fontSize: 15,
        color: colors.loginPageTextColor,
    },
});

export default addReview;

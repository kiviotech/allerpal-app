import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import icons from '../../constants/icons';
import fonts from '../../constants/fonts';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>Hello, Georgia</Text>
            </View>
            <Image
                source={icons.user}
                style={styles.profileImage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.whiteColor,
        paddingRight: 10,
        position: 'relative',
    },
    greetingContainer: {
        backgroundColor: colors.secondary,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 170,
    },

    greetingText: {
        fontSize: 16,
        fontFamily: fonts.inter600,
        color: colors.whiteColor,
        marginTop: -5,
        marginLeft: -5
    },
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 20,
    }
});

export default Header;

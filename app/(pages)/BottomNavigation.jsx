import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import { useNavigation } from '@react-navigation/native'; // Import the hook
const BottomNavigation = () => {
    const navigation = useNavigation(); // Use the hook to get navigation object
    return (
        <View style={styles.navContainer}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('(pages)/home')}>
                <Text style={styles.navButtonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('(pages)/Community')}>
                <Text style={styles.navButtonText}>Community</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('(pages)/Support')}>
                <Text style={styles.navButtonText}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('(pages)/KnowledgeCenter')}>
                <Text style={styles.navButtonText}>Blogs</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: colors.secondary,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
    },
    navButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    navButtonText: {
        color: colors.whiteColor,
        fontSize: 14,
        fontFamily: fonts.inter500,
        borderColor: colors.whiteColor
    },
});

export default BottomNavigation;

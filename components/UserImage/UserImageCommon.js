import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import icons from '../../constants/icons';

const UserImageCommon = () => {
    return (
        <View style={styles.container}>
            <View style={styles.backgroundShape} />
            <Image source={icons.user} style={styles.userImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundShape: {
        position: 'absolute',
        width: '100%',
        height: 200,
        backgroundColor: '#00CFE8',
        borderBottomRightRadius: 180,
        top: -50,
    },
    userImage: {
        width: 200,
        height: 200,
        borderColor: '#fff',
        marginTop: 30
    },
});

export default UserImageCommon;

import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

const Search = () => {
    return (
        <View>
            <TextInput placeholderTextColor={colors.whiteColor} style={styles.searcBox} placeholder='search'></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    searcBox: {
        backgroundColor: colors.secondary,
        padding: 15,
        borderRadius: 15,
        width: '100%',
        color: colors.whiteColor, fontSize: 14,
        fontFamily: fonts.inter400
    }
});

export default Search;

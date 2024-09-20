import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';


const RecommendedDish = ({ data }) => {

    return (
        <View style={styles.container}>

            <View style={styles.dishesContainer}>
                {data.map((item, index) => (
                    <View style={styles.cardContainer} key={index}>
                        <Image source={item.img} style={styles.dishImage} />
                        <Text style={styles.dishName}>{item.dishName}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    dishesContainer: {
        flexDirection: 'row',
    },
    cardContainer: {
        width: 79,
        minHeight: 110,
        height: 'auto',
        backgroundColor: colors.background,
        borderRadius: 30,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        marginRight: 10,
        marginLeft: 5,
        marginBottom: 10
    },
    dishImage: {
        width: 79,
        height: 79,
        borderRadius: 30,
        position: 'absolute',
        top: -10,
    },
    dishName: {
        fontSize: 9,
        color: colors.loginPageTextColor,
        fontFamily: fonts.inter700,

        marginTop: 70,
        padding: 10,
        lineHeight: 12,
    },
});

export default RecommendedDish;

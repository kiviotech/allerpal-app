import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import icons from '../../constants/icons';


const RestaurantReviews = () => {
    const reviews = [
        {
            userImg: icons.user,
            name: 'Olivia Collins',
            date: 'Mar 5, 2024',
            restroimg: icons.restoReview,
            reviewsText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco lab'
        },
        {
            userImg: icons.user,
            name: 'Olivia Collins',
            date: 'Mar 5, 2024',
            restroimg: icons.resto1,
            reviewsText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco lab'
        },

    ]

    return (
        <View style={{ paddingBottom: 100 }}>
            {reviews.map((review, index) => (
                <View style={styles.reviewerUserContainer} key={index}>
                    <View style={styles.reviewerUserDetails}>
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                            <Image style={{ width: 26, height: 26 }} source={review.userImg} />
                            <Text style={styles.common}>{review.name}</Text>
                        </View>
                        <View>
                            <Text style={styles.common}>{review.date}</Text>
                        </View>

                    </View>

                    <Image style={{ width: 'auto', borderRadius: 20 }} source={review.restroimg} />
                    <Text style={[styles.common, { fontFamily: fonts.inter400, paddingTop: 15, }]}>{review.reviewsText}</Text>

                </View>
            ))}
        </View>
    )
};

const styles = StyleSheet.create({

    reviewerUserContainer: {
        paddingBottom: 10,
        flex: 1
    },
    reviewerUserDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 10
    },
    common: {
        color: colors.loginPageTextColor,
        fontFamily: fonts.inter600,
        fontSize: 15
    },

});

export default RestaurantReviews;

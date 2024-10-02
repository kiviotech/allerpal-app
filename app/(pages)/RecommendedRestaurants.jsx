import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import icons from '../../constants/icons';
import { useNavigation } from '@react-navigation/native';
const RecommendedRestaurantsCard = () => {
    const navigation = useNavigation();
    const recommendedRestaurants = [
      {
        dishName: "Spice Junction",
        img: icons.resto1,
        rating: 4.5,
        reviews: 60,
      },
      {
        dishName: "	Tandoori Delight",
        img: icons.resto1,
        rating: 4.2,
        reviews: 60,
      },
    ];
    return (
        <View style={styles.container}>

            <View style={styles.mainContainer}>
                {recommendedRestaurants.map((item, index) => (
                    <View style={styles.cardContainer} key={index}>
                        <ImageBackground
                            source={item.img}
                            style={styles.imageBackground}
                            imageStyle={styles.image}
                        >
                            <View style={styles.infoContainer}>
                                <Text style={styles.restaurantName}>{item.dishName}</Text>
                                <View style={styles.ratingContainer}>
                                    <Text style={styles.rating}>{'⭐'.repeat(Math.round(item.rating))}</Text>
                                    <Text style={styles.reviews}>{`${item.reviews} reviews`}</Text>
                                </View>

                            </View>
                        </ImageBackground>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                navigation.navigate('(pages)/RestaurantScreen'); // Navigate to Login screen
                            }}>
                                <Text style={styles.buttonText}>View Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Book Table</Text>
                            </TouchableOpacity>
                        </View>
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
    mainContainer: {
        flexDirection: 'row',
    },
    cardContainer: {
        width: 276,
        height: 220,
        backgroundColor: colors.background,
        borderRadius: 15,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        flexShrink: 0,
        marginRight: 15,
        paddingBottom: 10,
        marginLeft: 5,
        marginTop: -8,
        marginBottom: 10
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    image: {
        borderRadius: 15,
    },
    infoContainer: {
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.10)', // semi-transparent background
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    restaurantName: {
        fontSize: 16,
        fontFamily: fonts.inter600,
        color: colors.whiteColor,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    rating: {
        fontSize: 14,
        color: colors.whiteColor,
    },
    reviews: {
        fontSize: 12,
        color: colors.whiteColor,
        marginLeft: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        backgroundColor: colors.secondary,
        borderRadius: 20,
        paddingVertical: 10,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 12,
        fontFamily: fonts.inter600,
        color: '#FFF',
    },
});

export default RecommendedRestaurantsCard;

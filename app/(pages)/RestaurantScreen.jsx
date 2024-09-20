import React from 'react';
import { ScrollView, StyleSheet, View, Text, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import icons from '../../constants/icons';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../../components/CustomButton';
import RestaurantReviews from './RestaurantReviews';
import CustomText from '../../components/CustomText/CustomText';

const RestaurantScreen = () => {

    const restoDetails = {
        name: 'No5 Dining & Lounge',
        rating: 4,
        reviews: '1000',
        location: '3 miles . 5 Tottenham Ln'
    }

    const foodCard = [
        {
            name: 'Poke Nui',
            price: 20.30,
            img: icons.restoFood1
        },
        {
            name: 'Smoke Veggie Bowl',
            price: 20.30,
            img: icons.restoFood2
        },
        {
            name: 'Vegetable Bowl',
            price: 20.30,
            img: icons.restoFood3
        },
        {
            name: 'BBQ Chicken',
            price: 20.30,
            img: icons.restoFood4
        },
        {
            name: 'Vegetable Bowl',
            price: 20.30,
            img: icons.restoFood3
        },
        {
            name: 'BBQ Chicken',
            price: 20.30,
            img: icons.restoFood4
        },
        {
            name: 'Vegetable Bowl',
            price: 20.30,
            img: icons.restoFood3
        },
        {
            name: 'BBQ Chicken',
            price: 20.30,
            img: icons.restoFood4
        },
        {
            name: 'Vegetable Bowl',
            price: 20.30,
            img: icons.restoFood3
        },
        {
            name: 'BBQ Chicken',
            price: 20.30,
            img: icons.restoFood4
        },
    ]


    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>
                    <ImageBackground
                        source={icons.resturantBanner}
                        style={styles.imageBackground}
                        imageStyle={styles.image}
                    >
                        <View style={styles.infoContainer}>
                            <Text style={styles.restaurantName}>{restoDetails.name}</Text>
                            <View style={styles.ratingContainer}>
                                {Array.from({ length: restoDetails.rating }).map((_, index) => (
                                    <Image key={index} style={styles.rating} source={icons.star} />
                                ))}

                                <Text style={styles.reviews}>{`${restoDetails.reviews} reviews`}</Text>
                            </View>

                            <View style={styles.ratingContainer}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome name="user" size={10} color="white" />
                                </View>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <View key={index} style={styles.dotContainer}></View>
                                ))}

                                <Text style={styles.reviews}>{restoDetails.location}</Text>
                            </View>
                        </View>
                    </ImageBackground>

                    <View style={styles.contactUsContainer}>
                        <View style={styles.contactIcon}>
                            <FontAwesome name="phone" size={15} color="white" />
                        </View>
                        <View style={styles.contactIcon}>
                            <FontAwesome name="globe" size={15} color="white" />
                        </View>
                        <View style={styles.contactIcon}>
                            <FontAwesome name="map-marker" size={15} color="white" />
                        </View>
                    </View>
                    <View style={styles.filterByButtons}>

                        <CustomButton
                            buttonStyle={{ fontSize: 13, width: 140, padding: 14 }}
                            text='Allergen Menu'
                        />
                        <CustomButton
                            buttonStyle={{ fontSize: 13, width: 140, padding: 14 }}
                            text='Normal Menu'
                        />


                    </View>

                    <View style={styles.foodCardContainer}>
                        {foodCard.map((item, index) => {
                            const isOddRow = Math.floor(index / 2) % 2 !== 0;
                            const cardHeight = (index % 2 === 0) ? (isOddRow ? 191 : 252) : (isOddRow ? 252 : 191);

                            return (
                                <View
                                    style={[
                                        styles.foodCard,
                                        { height: cardHeight },
                                        cardHeight === 252 && index !== 0 && { marginTop: -30 }, // Apply marginTop: -30 if height is 252
                                        index === 1 && { height: 220 },

                                    ]}
                                    key={index}
                                >
                                    <Image
                                        source={item.img}
                                        style={styles.foodImage}
                                    />
                                    <View style={styles.textContainer}>
                                        <Text style={styles.title}>{item.name}</Text>
                                        <Text style={[styles.title, styles.price]}>{`$${item.price.toFixed(2)}`}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>


                    {/* reviews */}

                    <CustomText title={'Reviews'} />
                    <RestaurantReviews />
                </View>
            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.whiteColor,
    },
    container: {
        flex: 1,
        padding: 10,
    },
    imageBackground: {
        justifyContent: 'flex-end',
        width: '100%',
        height: 260,
    },
    image: {
        borderRadius: 15,
    },
    infoContainer: {
        padding: 10,
        paddingBottom: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.10)', // semi-transparent background
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        borderRadius: 15,
    },
    restaurantName: {
        fontSize: 16,
        fontFamily: fonts.inter600,
        color: colors.whiteColor,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center'
    },
    iconContainer: {
        width: 20,
        height: 20,
        backgroundColor: 'black',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rating: {
        marginRight: 5
    },
    reviews: {
        fontSize: 12,
        color: colors.whiteColor,
        marginLeft: 5,
    },
    dotContainer: {
        width: 6,
        height: 6,
        backgroundColor: colors.primary,
        borderRadius: 5,
        marginRight: 2
    },
    contactUsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    contactIcon: {
        width: 30,
        height: 30,
        backgroundColor: colors.secondary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },

    filterByButtons: {
        flexDirection: 'row',
        paddingTop: 10,
        gap: 10
    },

    foodCardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginTop: 15
    },
    foodCard: {
        width: '48%',
        backgroundColor: colors.background,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        shadowColor: colors.blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
        height: 500,
        marginBottom: 15,
        borderRadius: 30
    },

    foodImage: {
        width: '100%',
        height: '70%', // 70% of the card height
        borderRadius: 10,
        objectFit: 'fill',

    },
    textContainer: {
        paddingLeft: 10,
        height: '30%', // 30% of the card height

        paddingTop: 10
    },
    title: {
        fontSize: 13,
        fontFamily: fonts.inter500,
        color: colors.loginPageTextColor
    },
    price: {
        marginTop: 5,
    },
});

export default RestaurantScreen;

import React, { useState, useEffect } from 'react';
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
import { Linking, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getRestaurantById } from '../../src/api/repositories/restaurantRepository';

// Mock API response for the restaurant details
const mockApiResponse = {
    restaurant: {
        name: 'No5 Dining & Lounge',
        rating: 4,
        reviews: '1000',
        location: '3 miles . 5 Tottenham Ln'
    },
    menus: [
        {
            name: 'Poke Nui',
            price: 20.30,
            img: icons.restoFood1,
            type: 'allergen'
        },

        {
            name: 'Smoke Veggie Bowl',
            price: 20.30,
            img: icons.restoFood2,
            type: 'normal'
        },
        {
            name: 'Vegetable Bowl',
            price: 20.30,
            img: icons.restoFood3,
            type: 'allergen'
        },
        {
            name: 'BBQ Chicken',
            price: 20.30,
            img: icons.restoFood4,
            type: 'normal'
        },
        {
            name: 'Grilled Tofu Bowl',
            price: 18.50,
            img: icons.restoFood3,
            type: 'normal'
        },
        {
            name: 'Spicy Wings',
            price: 22.10,
            img: icons.restoFood4,
            type: 'allergen'
        }
    ]
};

const reviews = [
    {
        id: 1,
        user: 'Olivia Collins',
        date: 'Mar 5, 2024',
        avatar: icons.userAvatar, // You can replace this with the actual user avatar URL
        reviewText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        id: 2,
        user: 'John Doe',
        date: 'Mar 10, 2024',
        avatar: icons.userAvatar, // You can replace this with the actual user avatar URL
        reviewText: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
    // Add more reviews if needed
];


const RestaurantScreen = () => {
    
    const { id } = useLocalSearchParams();

    useEffect(() => {
        const fetchRestaurantByID = async () => {
            try {
                const restaurantData = await getRestaurantById(id);
                setRestaurantDetails(restaurantData.data.data); // Assuming response.data.data contains the array of restaurants
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            }
        };

        fetchRestaurantByID();
    }, []);


    console.log("resturant id",id)
    const [menuType, setMenuType] = useState('normal'); // State for selected menu type (normal/allergen)
    const [restaurantDetails, setRestaurantDetails] = useState({});
    const [filteredMenu, setFilteredMenu] = useState([]);

    const handlePressPhone = () => {
        const phoneNumber = `tel:${restaurantDetails.contact_number}`;
        Linking.openURL(phoneNumber).catch(err => console.error('Error dialing phone', err));
    };
    
    const handlePressWebsite = () => {
        const websiteUrl = restaurantDetails.website_url;
        Linking.openURL(websiteUrl).catch(err => console.error('Error opening website', err));
    };
    
    const handlePressLocation = () => {
        const { latitude, longitude } = restaurantDetails.location;
        const locationUrl = `geo:${latitude},${longitude}`;
        Linking.openURL(locationUrl).catch(err => console.error('Error opening maps', err));
    };
    // Function to mock API call and filter menus based on menuType
    const fetchRestaurantDetails = () => {
        const { restaurant, menus } = mockApiResponse;
        setRestaurantDetails(restaurant);
        // Filter the menu based on the selected type when the component mounts
        const initialMenu = menus.filter(menu => menu.type === menuType);
        setFilteredMenu(initialMenu);
    };

    // Function to handle menu type change and filter menus accordingly
    const handleMenuChange = (type) => {
        setMenuType(type);
        const filtered = mockApiResponse.menus.filter(menu => menu.type === type);
        setFilteredMenu(filtered);
    };

    // Initial API fetch simulation
    useEffect(() => {
        fetchRestaurantDetails();
    }, []);

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
                            <Text style={styles.restaurantName}>{restaurantDetails.name}</Text>
                            <View style={styles.ratingContainer}>
                                {Array.from({ length: restaurantDetails.rating }).map((_, index) => (
                                    <Image key={index} style={styles.rating} source={icons.star} />
                                ))}
                                <Text style={styles.reviews}>{`${restaurantDetails.reviews} reviews`}</Text>
                            </View>

                            <View style={styles.ratingContainer}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome name="user" size={10} color="white" />
                                </View>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <View key={index} style={styles.dotContainer}></View>
                                ))}

                                <Text style={styles.reviews}>{restaurantDetails.location}</Text>
                            </View>
                        </View>
                    </ImageBackground>

                    {/* Contact Section */}
                    <View style={styles.contactUsContainer}>
    <TouchableOpacity style={styles.contactIcon} onPress={handlePressPhone}>
        <FontAwesome name="phone" size={15} color="white" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.contactIcon} onPress={handlePressWebsite}>
        <FontAwesome name="globe" size={15} color="white" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.contactIcon} onPress={handlePressLocation}>
        <FontAwesome name="map-marker" size={15} color="white" />
    </TouchableOpacity>
</View>

                    {/* Filter Menu Buttons */}
                    <View style={styles.filterByButtons}>
                        <CustomButton
                            buttonStyle={{ fontSize: 13, width: 140, padding: 14 }}
                            text='Allergen Menu'
                            onPress={() => handleMenuChange('allergen')}
                        />
                        <CustomButton
                            buttonStyle={{ fontSize: 13, width: 140, padding: 14 }}
                            text='Normal Menu'
                            onPress={() => handleMenuChange('normal')}
                        />
                    </View>

                    {/* Food Cards */}
                    <View style={styles.foodCardContainer}>
                        {filteredMenu.map((item, index) => {
                            const isOddRow = Math.floor(index / 2) % 2 !== 0;
                            const cardHeight = (index % 2 === 0) ? (isOddRow ? 191 : 252) : (isOddRow ? 252 : 191);

                            return (
                                <View
                                    style={[
                                        styles.foodCard,
                                        { height: cardHeight },
                                        cardHeight === 252 && index !== 0 && { marginTop: -30 },
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

                    {/* Reviews Section */}
                    <CustomText title={'Reviews'} />
                    <RestaurantReviews />
                    
                </View>
            </ScrollView>
            <BottomNavigation />
        </SafeAreaView>
    );
};

// Styles
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
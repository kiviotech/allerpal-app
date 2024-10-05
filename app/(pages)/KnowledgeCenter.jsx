import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import colors from '../../constants/colors';
import Search from '../../components/Search';
import fonts from '../../constants/fonts';
import CustomText from '../../components/CustomText/CustomText';
import icons from '../../constants/icons';
import CustomButton from '../../components/CustomButton';
import RecommendedDish from './RecommendedDish';

const KnowledgeCenter = () => {

    // State to store recommended blogs, recently posted, and allergens
    const [recommendedBlogs, setRecommendedBlogs] = useState([]);
    const [recentlyPosted, setRecentlyPosted] = useState([]);
    const [recommendedDishes, setRecommendedDishes] = useState([]);

    // Mock API to simulate dynamic data fetching
    useEffect(() => {
        // Mock Recommended Blogs API
        const fetchRecommendedBlogs = () => {
            const blogs = [
                { img: icons.khowledgeBanner, name: 'Blog 1: Allergies in the UK' },
                { img: icons.khowledgeBanner, name: 'Blog 2: Food Allergens You Should Know' },
            ];
            setRecommendedBlogs(blogs);
        };

        // Mock Recently Posted API
        const fetchRecentlyPosted = () => {
            const posts = [
                { img: icons.knowledegeP, name: 'Post 1: Hello' },
                { img: icons.knowledegeP, name: 'Post 2: How to Manage Allergies' },
            ];
            setRecentlyPosted(posts);
        };

        // Mock Recommended Dishes API (UK Allergens)
        const fetchRecommendedDishes = () => {
            const dishes = [
                { dishName: 'Peanuts', img: icons.dish1 },
                { dishName: 'Tree nuts', img: icons.dish2 },
                { dishName: 'Milk', img: icons.dish3 },
                { dishName: 'Eggs', img: icons.dish1 },
                { dishName: 'Fish', img: icons.dish2 },
                { dishName: 'Shellfish', img: icons.dish3 },
            ];
            setRecommendedDishes(dishes);
        };

        // Call the mock APIs
        fetchRecommendedBlogs();
        fetchRecentlyPosted();
        fetchRecommendedDishes();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>

                {/* Recommended Blogs Section */}
                <CustomText title={'Recommended blogs for you'} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}>
                    {recommendedBlogs.map((item, index) => (
                        <ImageBackground
                            source={item.img}
                            style={styles.imageBackground}
                            imageStyle={styles.image}
                            key={index}
                        >
                            <View style={styles.infoContainer}>
                                <Text style={styles.restaurantName}>{item.name}</Text>
                                <View style={styles.ratingContainer}>
                                    <CustomButton
                                        buttonStyle={{ fontSize: 13, width: 120, padding: 12 }}
                                        text='Allergen 1'
                                    />
                                    <CustomButton
                                        buttonStyle={{ fontSize: 13, width: 120, marginLeft: 10, padding: 12 }}
                                        text='Allergen 2'
                                    />
                                </View>
                            </View>
                        </ImageBackground>
                    ))}
                </ScrollView>

                {/* Read About Section */}
                <CustomText title={'Read about'} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 25 }}>
                    <RecommendedDish data={recommendedDishes} />
                </ScrollView>

                {/* Recently Posted Section */}
                <CustomText title={'Recently posted'} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ marginBottom: 10 }}>
                    {recentlyPosted.map((item, index) => (
                        <ImageBackground
                            source={item.img}
                            style={styles.imageBackground}
                            imageStyle={styles.image}
                            key={index}
                        >
                            <View style={styles.infoContainer}>
                                <Text style={styles.restaurantName}>{item.name}</Text>
                                <View style={styles.ratingContainer}>
                                    <CustomButton
                                        buttonStyle={{ fontSize: 13, width: 120, padding: 12 }}
                                        text='Allergen 1'
                                    />
                                    <CustomButton
                                        buttonStyle={{ fontSize: 13, width: 120, marginLeft: 10, padding: 12 }}
                                        text='Allergen 2'
                                    />
                                </View>
                            </View>
                        </ImageBackground>
                    ))}
                </ScrollView>

                {/* Other blogs */}
                <Search style={{ marginTop: 10 }} />

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
        paddingLeft: 15,
        paddingRight: 15,
    },

    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        height: 160,
        marginRight: 10,
        width: 276,
        marginTop: 15,
    },
    image: {
        borderRadius: 15,
        objectFit: 'cover',
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
        alignItems: 'center',
        marginTop: 5,
    },
});

export default KnowledgeCenter;
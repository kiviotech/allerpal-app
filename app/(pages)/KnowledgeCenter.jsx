import React from 'react';
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

    const Recommendedblogs = [
        {
            img: icons.khowledgeBanner,
            name: 'Lorem ipsum',
        },
        {
            img: icons.khowledgeBanner,
            name: 'Lorem ipsum',
        }
    ];

    const recentlyPosted = [
        {
            img: icons.knowledegeP,
            name: 'Lorem ipsum',
        },
        {
            img: icons.knowledegeP,
            name: 'Lorem ipsum',
        }
    ];


    const recommendedDishes = [
        { dishName: 'Allergen 1', img: icons.dish1 },
        { dishName: 'Allergen 1', img: icons.dish2 },
        { dishName: 'Allergen 1', img: icons.dish1 },
        { dishName: 'Allergen 1', img: icons.dish2 },
        { dishName: 'Allergen 1', img: icons.dish3 },
        { dishName: 'Allergen 1', img: icons.dish2 },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <CustomText title={'Recommended blogs for you'} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}>
                    {Recommendedblogs.map((item, index) => (
                        <ImageBackground
                            source={item.img}
                            style={styles.imageBackground}
                            imageStyle={styles.image} key={index}
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

                {/* read about */}

                <CustomText title={'Read about'} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 25 }}>
                    <RecommendedDish data={recommendedDishes} />
                </ScrollView>

                {/* Recently posted */}
                <CustomText title={'Recently posted'} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ marginBottom: 10 }}>
                    {recentlyPosted.map((item, index) => (
                        <ImageBackground
                            source={item.img}
                            style={styles.imageBackground}
                            imageStyle={styles.image} key={index}
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
        marginTop: 15
    },
    image: {
        borderRadius: 15,
        objectFit: 'cover'
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

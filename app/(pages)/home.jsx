import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import colors from '../../constants/colors';
import Search from '../../components/Search';
import fonts from '../../constants/fonts';
import CustomText from '../../components/CustomText/CustomText';
import RecommendedRestaurants from './RecommendedRestaurants';
import RecommendedDish from './RecommendedDish';
import icons from '../../constants/icons';

const Home = () => {
    const filterArr = [
        'Filters', 'Nearest', 'Book Table', 'Open Now', 'Veg', 'Non-Veg'
    ];
    const recommendedDishes = [
        { dishName: 'Vegan King Poke', img: icons.dish1 },
        { dishName: 'Vegan King Poke', img: icons.dish2 },
        { dishName: 'Vegan King Poke', img: icons.dish1 },
        { dishName: 'Vegan King Poke', img: icons.dish2 },
        { dishName: 'Vegan King Poke', img: icons.dish3 },
        { dishName: 'Vegan King Poke', img: icons.dish2 },
    ];
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Header />
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Search />
                    {/* Filter section container */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterContainer}>
                        {filterArr.map((item, index) => (
                            <View style={styles.filterButton} key={index}>
                                <Text style={styles.filterText}>{item}</Text>
                            </View>
                        ))}
                    </ScrollView>
                    {/* Filter section container end here */}

                    {/* Recommended Dishes section container */}
                    <CustomText title={'Recommended dishes for you'} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterContainer}>
                        <RecommendedDish data={recommendedDishes} />
                    </ScrollView>
                    {/* Recommended Dishes section end here */}

                    {/* Recommended Restaurants section start here */}
                    <View style={{ marginTop: -10 }}>
                        <CustomText title={'Recommended Restaurants for you'} />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filterContainer}>
                            <RecommendedRestaurants />
                        </ScrollView>
                    </View>
                    {/* Favorites section start here */}
                    <View style={{ marginTop: -10, marginBottom: 80 }}>
                        <CustomText title={'Favorites Restaurants for you'} />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filterContainer}>
                            <RecommendedRestaurants />
                        </ScrollView>
                    </View>
                </ScrollView>

            </View>
            <BottomNavigation />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
    },
    scrollViewContent: {
        paddingTop: 20,
        paddingLeft: 15,
        paddingRight: 15,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        marginTop: 10,
    },
    filterButton: {
        marginRight: 10,
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 30,
        width: 100,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    filterText: {
        fontFamily: fonts.inter400,
        fontSize: 12,
        color: colors.secondary,
    }
});

export default Home;

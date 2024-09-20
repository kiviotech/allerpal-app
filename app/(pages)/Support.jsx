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

const Support = () => {

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

            <Header />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Search />

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
        paddingTop: 20,
        paddingLeft: 15,
        paddingRight: 15,
    },
});

export default Support;

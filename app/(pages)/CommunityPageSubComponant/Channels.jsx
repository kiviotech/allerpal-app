
import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import icons from '../../../constants/icons';
import Search from '../../../components/Search';
const Channels = () => {
    const community = [
        { name: 'Eddie', img: icons.user, date: 'Mar 27, 2024' },
        { name: 'Keri Shaw', img: icons.dish2, date: 'Feb 15, 2024' },
        { name: 'Roman Hall', img: icons.dish1, date: 'Feb 19, 2024' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={[styles.searchContainer, { paddingTop: 10 }]}>
                    <View style={{ width: '80%' }}>
                        <Search />
                    </View>

                    <Text style={styles.exploreText}>Explore</Text>
                </View>
                <View style={styles.connectionList}>
                    {community.map((item, index) => (
                        <View key={index} style={styles.connectionItem}>
                            <Image source={item.img} style={styles.avatar} />
                            <View style={styles.connectionText}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.text}>Text</Text>
                            </View>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,

    },
    exploreText: {
        marginLeft: 10,
        color: colors.loginPageTextColor,
        fontFamily: fonts.primary,
        fontSize: 16,
    },

    connectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,

    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 25,
        marginRight: 15,
    },
    connectionText: {
        flex: 1,
    },
    name: {
        fontFamily: fonts.inter600,
        fontSize: 15,
        color: colors.loginPageTextColor,
    },
    text: {
        fontFamily: fonts.inter400,
        fontSize: 12,
        color: colors.secondary,
        paddingTop: 5
    },
    date: {
        fontFamily: fonts.inter600,
        fontSize: 15,
        color: colors.loginPageTextColor,
        marginTop: -5
    },
});

export default Channels;

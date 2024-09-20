import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import Search from '../../../components/Search';
import icons from '../../../constants/icons';

const Feed = () => {

    const feedArr = [
        {
            userName: 'Nancy',
            date: 'Mar 26, 2024',
            img: icons.feed,
            name: 'The Palm Court',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco lab'
        },
        {
            userName: 'Julia ',
            date: 'Mar 19, 2024',
            img: icons.feed,
            name: 'The Swan',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco lab'
        }
    ];
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.searchContainer}>
                    <View style={{ width: '80%' }}>
                        <Search />
                    </View>
                    <Text style={styles.exploreText}>Explore</Text>
                </View>

                {feedArr.map((item, index) => (
                    <View style={styles.postContainer} key={index}>
                        <View style={styles.headerContainer}>
                            <View style={styles.headerContainer}>
                                <Image
                                    source={icons.user}
                                    style={styles.profileImage}
                                />
                                <Text style={styles.userName}>{item.userName}</Text>
                            </View>

                            <Text style={styles.postedDate}>Posted Publicly</Text>
                            <Text style={styles.postDate}>{item.date}</Text>
                        </View>

                        <Image
                            source={icons.feed}
                            style={styles.postImage}
                        />


                        <Text style={styles.postTitle}>{item.name}</Text>

                        <Text style={styles.postDescription}>
                            {item.desc}
                        </Text>
                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingTop: 20
    },
    exploreText: {
        marginLeft: 10,
        color: colors.loginPageTextColor,
        fontFamily: fonts.primary,
        fontSize: 16,
    },
    postContainer: {
        backgroundColor: colors.white,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        paddingTop: 10
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 20,
        marginRight: 10,
    },
    headerTextContainer: {
        flex: 1,
    },
    userName: {
        fontFamily: fonts.inter600,
        fontSize: 15,
        color: colors.loginPageTextColor,
    },
    postedDate: {
        fontFamily: fonts.inter400,
        fontSize: 12,
        fontStyle: 'italic',
        color: colors.loginPageTextColor,
    },
    postDate: {
        fontFamily: fonts.secondary,
        fontSize: 15,
        color: colors.loginPageTextColor,
    },
    postImage: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 15
    },
    postTitle: {
        fontFamily: fonts.inter700,
        fontSize: 20,
        color: colors.loginPageTextColor,
        marginBottom: 5,
    },
    postDescription: {
        fontFamily: fonts.inter400,
        fontSize: 15,
        color: colors.loginPageTextColor,
    },
});

export default Feed;

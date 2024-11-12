import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import Footer from "./Footer"
const data = [
    {
        id: '1',
        name: 'Alyce Lambo',
        date: '25/06/2020',
        rating: 4.5,
        profilePic: 'https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg', // Placeholder profile image
        images: [
            'https://via.placeholder.com/100x80',
            'https://via.placeholder.com/100x80',
            'https://via.placeholder.com/100x80',
        ],
        review: 'Really convenient and the points system helps benefit loyalty. Some mild glitches here and there, but nothing too egregious. Obviously needs to roll out to more remote.',
    },
    {
        id: '2',
        name: 'John Doe',
        date: '12/07/2021',
        rating: 4.0,
        profilePic: 'https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg',
        images: [
            'https://via.placeholder.com/100x80',
            'https://via.placeholder.com/100x80',
        ],
        review: 'Great service with minor issues. Would definitely recommend!',
    },
    {
        id: '3',
        name: 'Jane Smith',
        date: '05/08/2021',
        rating: 4.8,
        profilePic: 'https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg',
        images: [
            'https://via.placeholder.com/100x80',
            'https://via.placeholder.com/100x80',
            'https://via.placeholder.com/100x80',
        ],
        review: 'Fantastic experience! Everything went smoothly, and the points system is very rewarding.',
    },
];

const ReviewCards = () => {
    const renderItem = ({ item }) => (
        <SafeAreaView style={styles.AreaContainer}>
            <View style={styles.Container}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <View style={styles.profileContainer}>
                            <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                            </View>
                        </View>
                        <View style={styles.headerText}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={item.images}
                        horizontal
                        renderItem={({ item: image }) => <Image source={{ uri: image }} style={styles.reviewImage} />}
                        keyExtractor={(image, index) => index.toString()}
                        style={styles.imageCarousel}
                        showsHorizontalScrollIndicator={false}
                    />
                    <Text style={styles.review}>{item.review}</Text>
                </View>
            </View>
            <Footer/>
        </SafeAreaView>
    );

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            contentContainerStyle={{ paddingHorizontal: 10 }}
        />
    );
};

const styles = StyleSheet.create({

    AreaContainer: {
        flex: 1,
        padding: 10,
        marginTop: 20,
         backgroundColor: '#F9F9F9',
        width: "100%"

    },

    Container:{

        backgroundColor:"#F9F9F9",
        display:'flex',
        // gap:20
        

    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 15,
        width: Dimensions.get('window').width * 0.8,
        marginHorizontal: 10,
        // shadowColor: '#000',
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        // shadowOffset: { width: 0, height: 2 },
        // borderWidth: 1,
        height: 450,
       

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileContainer: {
        position: 'relative',
        marginRight: 10,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 20,
    },
    ratingBadge: {
        position: 'absolute',
        bottom: -0,
        right: -5,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    date: {
        fontSize: 12,
        color: '#777',
    },
    imageCarousel: {
        marginVertical: 10,
    },
    reviewImage: {
        width: 100,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    review: {
        fontSize: 14,
        color: '#555',
    },
});

export default ReviewCards;

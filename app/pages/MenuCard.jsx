import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const MenuCard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://media.istockphoto.com/id/1442417585/photo/person-getting-a-piece-of-cheesy-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=k60TjxKIOIxJpd4F4yLMVjsniB4W1BpEV4Mi_nb4uJU=' }} // Replace with your image URL
                        style={styles.image}
                    />
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>4.5</Text>
                        <Text style={styles.star}>★</Text>
                        <Text style={styles.ratingCount}>(25+)</Text>
                    </View>
                    <TouchableOpacity style={styles.favoriteButton}>
                        <Text style={styles.heartIcon}>💙</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>Salmon Salad</Text>
                        <Text style={styles.price}>$5.50</Text>
                    </View>
                    <Text style={styles.allergens}>Allergens: GLUTEN, MILK, ONION +5 more</Text>
                    <Text style={styles.orderedBefore}>✓ Ordered before</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        padding: 20,
        backgroundColor: '#F9F9F9',

    },
    cardContainer: {
        flexDirection: 'row',
        // padding: 15,
        borderRadius: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        // height:105,

    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 15,
        overflow: 'hidden',
        marginRight: 15,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    ratingContainer: {
        position: 'absolute',
        bottom: 5,
        left: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    star: {
        color: 'gold',
        fontSize: 12,
        marginHorizontal: 2,
    },
    ratingCount: {
        color: '#000',
        fontSize: 12,
    },
    favoriteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    heartIcon: {
        fontSize: 20,
        color: 'skyblue', // Adjust color to match your theme
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'teal',
        right: 5
    },
    allergens: {
        fontSize: 9,
        color: 'grey',
        marginTop: 5,
    },
    orderedBefore: {
        fontSize: 14,
        color: 'teal',
        marginTop: 4,
    },
});

export default MenuCard;





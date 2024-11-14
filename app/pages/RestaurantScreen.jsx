import React from 'react';
import { View, Text, Image, TouchableOpacity, Switch, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import MenuCard from './MenuCard';
import Footer from './Footer'
import ReviewsSection from './ReviewsSection';
import { useRouter } from 'expo-router';
import ReviewCards from './ReviewCards';
import { useLocalSearchParams } from 'expo-router';


export default function () {
   const router =useRouter()

const { id, name, rating, categories ,image,documentId} = useLocalSearchParams();
// console.log(name)
// console.log(id)
// console.log(rating)
// console.log(documentId)

    const [isAllergenOn, setIsAllergenOn] = React.useState(false);

    return (
        <SafeAreaView style={styles.AreaContainer}>
            <ScrollView>
                <View style={styles.container}>
                    {/* Header Icons */}
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={()=> router.push('./Home')}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <FontAwesome name="heart" size={24} color="#1e90ff" />
                        </TouchableOpacity>
                    </View>

                    {/* Image Section */}
                    <Image
                        source={{ uri: image }}
                        style={styles.image}
                    />

                    {/* Restaurant Details */}
                    <View style={styles.detailsContainer}>
                        {/* Restaurant Name and Icons */}
                        <View style={styles.titleRow}>
                            <Text style={styles.restaurantName}>{name}</Text>
                            <View style={styles.iconRow}>
                                <TouchableOpacity style={styles.iconButton}>
                                    <FontAwesome name="phone" size={20} color="#ff6347" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.iconButton, styles.mapIcon]}>
                                    <FontAwesome name="map-marker" size={20} color="#ff6347" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Rating and Reviews */}
                        <View style={styles.ratingRow}>
                            <FontAwesome name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{rating} </Text>
                            <Text style={styles.reviewText}>(30+)</Text>
                            <TouchableOpacity>
                                <Text style={styles.reviewLink}>See Reviews</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.categories}>
            {Array.isArray(categories) &&
              categories.map((category, index) => (
                <Text key={index} style={styles.category}>{category}</Text>
              ))}
          </View>

                        {/* Distance and Address */}
                        <Text style={styles.addressText}>
                            <FontAwesome name="walking" size={14} color="#ff6347" /> 30 mins (1 km) . 5 Tottenham Ln
                        </Text>

                        {/* Contact Button */}
                        <TouchableOpacity style={styles.contactButton}>
                            <Text style={styles.contactButtonText}>Contact Restaurant</Text>
                        </TouchableOpacity>

                        {/* Allergen Toggle */}
                        <View style={styles.allergenContainer}>
                            <Text style={styles.allergenText}>Your Allergens</Text>
                            <Switch
                                value={isAllergenOn}
                                onValueChange={setIsAllergenOn}
                                thumbColor={isAllergenOn ? "#ff6347" : "#f4f3f4"}
                                trackColor={{ false: "#767577", true: "#ffdbc1" }}
                            />
                        </View>
                    </View>
                </View>
                <View>
                    <MenuCard />
                </View>

                <View style={styles.Review}>
                    <ReviewsSection   restaurantId={documentId} />
                </View>
                <View>
                    <ReviewCards/>
                </View>

            </ScrollView>
           <View>
            <Footer/>
           </View>
        </SafeAreaView>
    );
}




const styles = StyleSheet.create({
   

    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
      },
      category: {
        fontSize: 12,
        color: '#555',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#eee',
        borderRadius: 15,
        marginRight: 4,
        marginBottom: 4,
      },

    AreaContainer: {
        flex: 1,
        padding: 10,
        // marginTop: 20,
        //  backgroundColor: '#fff',
        width: "100%"

    },
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    image: {
        width: '90%',
        height: 200,
        borderRadius: 10,
        left: 18
    },
    detailsContainer: {
        padding: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    restaurantName: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    iconRow: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 8,
    },
    mapIcon: {
        marginLeft: 16, // Extra space between phone and map marker icons
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    ratingText: {
        fontSize: 16,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 16,
        color: '#888',
        marginLeft: 4,
    },
    reviewLink: {
        color: '#00D0DD',
        marginLeft: 8,
        textDecorationLine: 'underline',
    },
    addressText: {
        fontSize: 16,
        color: '#000000',
        marginVertical: 8,
    },
    contactButton: {
        backgroundColor: '#00D0DD',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 8,
        height: 50,
        width: 120
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        alignItems: "center",
        top: 5
    },
    allergenContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 16,
    },
    allergenText: {
        fontSize: 16,
        color: '#000000',
    },



});

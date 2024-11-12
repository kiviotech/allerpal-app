import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Icon } from 'react-native-elements';


const CommunityScreen = () => {
    const [activeTab, setActiveTab] = useState('About community');

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    return (
       <SafeAreaView style={styles.AreaContainer}>
         <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    {/* <Text>{'< Back'}</Text> */}

                    <Icon name="arrow-back" size={24} color="#2D3748" />
                </TouchableOpacity>
                <Text style={styles.title}>Lorem Ipsum</Text>
            </View>

            {/* Community Card */}
            <View style={styles.communityCard}>
                <Image source={{ uri: 'YOUR_IMAGE_URL' }} style={styles.communityImage} />
                <View style={styles.overlay}>
                    <Text style={styles.communityTitle}>Lorem Ipsum</Text>
                    <Text style={styles.communityRating}>⭐ 4.3 (10K+ members)</Text>
                    <Text style={styles.communityDescription}>
                        "Reiki healing channels universal energy, restoring balance and promoting holistic well-being."
                    </Text>
                    <TouchableOpacity style={styles.joinButton}>
                        <Text style={styles.joinButtonText}>Join Community</Text>
                        
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {['About community', 'Feed', 'Lorem', 'Lorem ipsum'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => handleTabPress(tab)}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Description Section */}
            <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Welcome to Lorem Ipsum Community 👋</Text>
                <Text style={styles.sectionDescription}>
                    A supportive space where practitioners and enthusiasts come together to explore the transformative power of Reiki...
                </Text>

                {/* Grid of Images */}
                <View style={styles.imageGrid}>
                    <Image source={{ uri: 'https://plus.unsplash.com/premium_photo-1661407350987-9e9319ac11e6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFzc2FnZXxlbnwwfHwwfHx8MA%3D%3D' }} style={styles.gridImage} />
                    <Image source={{ uri: 'https://plus.unsplash.com/premium_photo-1661407350987-9e9319ac11e6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFzc2FnZXxlbnwwfHwwfHx8MA%3D%3D' }} style={styles.gridImage} />
                    <Image source={{ uri: 'https://plus.unsplash.com/premium_photo-1661407350987-9e9319ac11e6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFzc2FnZXxlbnwwfHwwfHx8MA%3D%3D' }} style={styles.gridImage} />
                    <Image source={{ uri: 'https://plus.unsplash.com/premium_photo-1661407350987-9e9319ac11e6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFzc2FnZXxlbnwwfHwwfHx8MA%3D%3D' }} style={styles.gridImage} />
                </View>
            </View>
        </ScrollView>
       </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    AreaContainer: {
        flex: 1,
        padding: 10,
        // marginTop: 20,
        //  backgroundColor: '#fff',
        width: "100%"

    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16
    },
    backButton: {
        marginRight: 10,
        marginLeft:-18
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color:"#2D3748"
    },
    communityCard: {
        position: 'relative',
        height: 200,
        marginBottom: 16
    },
    communityImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 16,
        justifyContent: 'center',
        borderRadius: 10,
    },
    communityTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    communityRating: {
        color: '#fff',
        marginTop: 4
    },
    communityDescription: {
        color: '#fff',

        marginTop: 8
    },
    joinButton: {
        marginTop: 12,
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        height:50,
        width:150,
        borderWidth:1,
        borderColor:"#00D0DD"
    },
    joinButtonText: {
        color: '#00D0DD',
        fontWeight: 'bold',
        fontSize:15,
        left:5,
        top:5
    },
    forwardIcon: { marginLeft: 4 }, // Optional: Adjust spacing if needed
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    tab: {
        paddingBottom: 8
    },
    tabText: {
        fontSize: 16,
        color: '#888'
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: '#00D0DD'
    },
    activeTabText: {
        color: '#00D0DD',
        fontWeight: 'bold'
    },
    descriptionSection: {
        padding: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
    sectionDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 16
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    gridImage: {
        width: '48%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8
    },
});

export default CommunityScreen;

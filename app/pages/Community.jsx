import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import {useRouter} from "expo-router"
import ViewCommunity from "./ViewCommunity"
import Footer from "./Footer"

const categories = [
  { id: '1', title: 'Lorem', image: { uri: 'https://picsum.photos/200/200?random=1' } },
  { id: '2', title: 'Lorem', image: { uri: 'https://picsum.photos/200/200?random=2' } },
  { id: '3', title: 'Lorem', image: { uri: 'https://picsum.photos/200/200?random=3' } },
  { id: '4', title: 'Lorem', image: { uri: 'https://picsum.photos/200/200?random=4' } },
  { id: '5', title: 'Lorem', image: { uri: 'https://picsum.photos/200/200?random=4' } },
  { id: '6', title: 'Lorem', image: { uri: 'https://picsum.photos/200/200?random=4' } },


];

const communities = [
  { id: '1', title: 'Lorem ipsum', rating: 4.3, members: '10K+', image: { uri: 'https://picsum.photos/400/200?random=5' } },
  { id: '2', title: 'Lorem ipsum', rating: 4.3, members: '10K+', image: { uri: 'https://picsum.photos/400/200?random=6' } },
  { id: '3', title: 'Lorem ipsum', rating: 4.3, members: '10K+', image: { uri: 'https://picsum.photos/400/200?random=7' } },
  { id: '4', title: 'Lorem ipsum', rating: 4.3, members: '10K+', image: { uri: 'https://picsum.photos/400/200?random=5' } },
  { id: '5', title: 'Lorem ipsum', rating: 4.3, members: '10K+', image: { uri: 'https://picsum.photos/400/200?random=6' } },
  { id: '6', title: 'Lorem ipsum', rating: 4.3, members: '10K+', image: { uri: 'https://picsum.photos/400/200?random=7' } },
];

const Community = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('My Communities'); // State for the active tab

  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.title}</Text>
    </View>
  );

  const renderCommunityItem = ({ item }) => (
    <View style={styles.communityItem}>
      <Image source={item.image} style={styles.communityImage} />
      <View style={styles.communityOverlay}>
        <Text style={styles.communityTitle}>{item.title}</Text>
        <Text style={styles.communityRating}>⭐ {item.rating} ({item.members} members)</Text>
        <TouchableOpacity style={styles.communityButton} onPress={()=>router.push('./ViewCommunity')}>
          <Text style={styles.buttonText}>View Community</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.header}>Communities</Text>

          <View style={styles.followingRow}>
            <Text style={styles.followingText}>Following</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>


          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />

          {/* Tabs */}
        
          <View style={styles.tabs}>
         

            <TouchableOpacity onPress={() => {
              setActiveTab('My Feed');
              router.push('./MyFeedPage')
            }}>
              <Text style={[styles.tab, activeTab === 'My Feed' ? styles.activeTab : {}]}>
                My Feed ({communities.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('My Communities')}>
              <Text style={[styles.tab, activeTab === 'My Communities' ? styles.activeTab : {}]}>
                My Communities ({communities.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Community List */}
          <FlatList
            data={communities}
            renderItem={renderCommunityItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.communityList}
          />
          
        </View>
       

      </ScrollView>
      <View style={styles.footer}>

        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 10,
    marginTop: 1,
    //  backgroundColor: '#fff',
    width: "100%",


  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  followingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4, // Reduced marginBottom to reduce gap between followingRow and categories
  },
  followingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151'
  },
  viewAllText: {
    fontSize: 14,
    color: '#374151',
  },
  categoryList: {
    paddingBottom: 0, // Removed padding to reduce gap
    gap: 15

  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 12,


  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#374151',
    fontWeight: "bold"
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 8, // Reduced vertical margin to decrease space between tabs and categories
   gap:20

  },
  tab: {
    fontSize: 16,
    color: '#888',
    paddingBottom: 8,
  },
  activeTab: {
    color: '#00D0DD',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#00D0DD',
  },
  communityList: {
    paddingBottom: 16,
    marginBottom: 160

  },
  communityItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  communityImage: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  communityOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay to enhance text readability
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  communityRating: {
    fontSize: 14,
    color: '#ccc',
    marginVertical: 4,
  },
  communityButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 41,
    width: 130
  },
  buttonText: {
    color: '#00D0DD',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: "bold",
    top: 5
  },
  footer: {
    display: 'flex'

  }

});

export default Community;

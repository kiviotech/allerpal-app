import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Footer from "./Footer"
import {useRouter} from "expo-router"

const data = [
  {
    id: '1',
    community: 'Reiki Healing',
    userName: 'Aarav Sharma',
    location: 'Bangalore, India',
    postContent: 'This is what I learned in my recent course\n\n“The whole secret of existence”\n\n"The whole secret of existence lies in the pursuit of meaning, purpose, and connection. It is a delicate dance between self-discovery, compassion for others, and embracing the ever-unfolding mysteries of life. Finding harmony in the ebb and flow of experiences, we unlock the profound beauty that resides within our shared journey."',
    likes: 16,
    comments: 24,
    profilePic: 'https://via.placeholder.com/40', // Placeholder profile picture
  },
  {
    id: '2',
    community: 'Reiki Healing',
    userName: 'Aarav Sharma',
    location: 'Bangalore, India',
    postContent: 'This is what I learned in my recent course\n\n“The whole secret of existence”\n\n"The whole secret of existence lies in the pursuit of meaning, purpose, and connection. It is a delicate dance between self-discovery, compassion for others, and embracing the ever-unfolding mysteries of life. Finding harmony in the ebb and flow of experiences, we unlock the profound beauty that resides within our shared journey."',
    likes: 16,
    comments: 24,
    profilePic: 'https://via.placeholder.com/40', // Placeholder profile picture
  },
  {
    id: '3',
    community: 'Reiki Healing',
    userName: 'Aarav Sharma',
    location: 'Bangalore, India',
    postContent: 'This is what I learned in my recent course\n\n“The whole secret of existence”\n\n"The whole secret of existence lies in the pursuit of meaning, purpose, and connection. It is a delicate dance between self-discovery, compassion for others, and embracing the ever-unfolding mysteries of life. Finding harmony in the ebb and flow of experiences, we unlock the profound beauty that resides within our shared journey."',
    likes: 16,
    comments: 24,
    profilePic: 'https://via.placeholder.com/40', // Placeholder profile picture
  },
  {
    id: '4',
    community: 'Reiki Healing',
    userName: 'Aarav Sharma',
    location: 'Bangalore, India',
    postContent: 'This is what I learned in my recent course\n\n“The whole secret of existence”\n\n"The whole secret of existence lies in the pursuit of meaning, purpose, and connection. It is a delicate dance between self-discovery, compassion for others, and embracing the ever-unfolding mysteries of life. Finding harmony in the ebb and flow of experiences, we unlock the profound beauty that resides within our shared journey."',
    likes: 16,
    comments: 24,
    profilePic: 'https://via.placeholder.com/40', // Placeholder profile picture
  },
];

const CommunityApp = ({showFooter= true}) => {
  const router= useRouter()
  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.communityText}>Posted in <Text style={styles.communityLink}>{item.community}</Text></Text>
        <TouchableOpacity onPress={()=>router.push("./Community")}>

        <Text style={styles.viewCommunity}>view community</Text>
        </TouchableOpacity>
      </View>
      {/* Line Separator */}
      <View style={styles.separator} />

      <View style={styles.userInfo}>
        <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.userLocation}>{item.location}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.postContent}</Text>
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.iconText}>❤️ {item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.iconText}>💬 {item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.iconText}>🔗 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.AreaContainer}>
      <ScrollView style={{height: '84%'}}>
        <View style={styles.container}>
          {/* Header Section */}
          {/* <View style={styles.header}>
            <Image source={{ uri: 'https://via.placeholder.com/24' }} style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Communities</Text>
          </View> */}
          {/* New Post Section */}
          {/* <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
              <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.profileImage} />
              <TextInput
                placeholder="write your post here"
                style={styles.postInput}
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.headerBottom}>
              <TouchableOpacity style={styles.addPostButton}>
                <Text style={styles.addPostText}>🌐 Add your post in</Text>
                <Text style={styles.arrowDown}> ▼</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.publishButton}>
                <Text style={styles.publishButtonText}>Publish Post</Text>
              </TouchableOpacity>
            </View>
          </View> */}

          {/* Posts List */}
          <FlatList
            data={data}
            renderItem={renderPost}
            keyExtractor={item => item.id}
          />
        </View>

      </ScrollView>
{ showFooter && (
      <Footer />
)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  AreaContainer: {
    flex: 1,
    padding: 10,
    // marginTop: 20,
    //  backgroundColor: '#fff',
    width: "100%",
    borderColor: 'red',

  },
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#F7F8FA',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  addPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPostText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  arrowDown: {
    fontSize: 12,
    color: '#666',
  },
  publishButton: {
    backgroundColor: '#00D0DD',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  communityText: {
    color: '#333',
  },
  communityLink: {
    color: '#00D0DD',
    fontWeight: '600',
  },
  viewCommunity: {
    color: '#777',
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginVertical: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 16,
  },
  userLocation: {
    fontSize: 12,
    color: '#777',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    color: '#555',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default CommunityApp;

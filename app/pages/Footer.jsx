


import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Footer = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const router = useRouter();

  // Helper function to handle tab press
  const handleTabPress = (tabName, route) => {
    setActiveTab(tabName); // Update active tab
    if (route) {
      router.push(route); // Navigate only if a route is provided
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress('Home', '../pages/Home')}
        >
          <Ionicons name="home-outline" size={24} color={activeTab === 'Home' ? '#00aced' : '#888'} />
          <Text style={[styles.footerText, activeTab === 'Home' && styles.activeFooterText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress('Search')}
        >
          <Ionicons name="search-outline" size={24} color={activeTab === 'Search' ? '#00aced' : '#888'} />
          <Text style={[styles.footerText, activeTab === 'Search' && styles.activeFooterText]}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress('Community', '../pages/Community')}
        >
          <Ionicons name="people-outline" size={24} color={activeTab === 'Community' ? '#00aced' : '#888'} />
          <Text style={[styles.footerText, activeTab === 'Community' && styles.activeFooterText]}>Community</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleTabPress('Chat', '../pages/Chat')}
        >
          <Ionicons name="chatbubble-outline" size={24} color={activeTab === 'Chat' ? '#00aced' : '#888'} />
          <Text style={[styles.footerText, activeTab === 'Chat' && styles.activeFooterText]}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => {
            handleTabPress('Profile');
            router.push('./Account')
          }}
        >
          <Ionicons name="person-outline" size={24} color={activeTab === 'Profile' ? '#00aced' : '#888'} />
          <Text style={[styles.footerText, activeTab === 'Profile' && styles.activeFooterText]}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  activeFooterText: {
    color: '#00aced',
  },
});

export default Footer;

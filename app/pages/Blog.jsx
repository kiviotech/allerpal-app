import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Footer from './Footer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { MEDIA_BASE_URL } from '../../src/api/apiClient';
import { fetchAllArticles } from '../../src/services/articleServices';

const BlogCard = ({ article }) => {
  const router = useRouter()

  const handlePress = () => {
    router.push({
      pathname: '/pages/BlogDetails',
      params: {
        // id: article.id, // Ensure id is a string
        documentId: article.documentId,
      },
    });
  };

  const imageUrl =
    (article.article_image && article.article_image?.url)
      ? `${MEDIA_BASE_URL}${article.article_image.url}`
      : '';

  const content = article?.article_content || '';
  const wordCounts = content
    .split(/\W+/)
    .filter(word => word.length > 3)
    .reduce((counts, word) => {
      const lowerWord = word.toLowerCase();
      counts[lowerWord] = (counts[lowerWord] || 0) + 1;
      return counts;
    }, {});

  // Sort by frequency and extract top keywords
  const sortedKeywords = Object.entries(wordCounts)
    // .sort((a, b) => b[1] - a[1]) // Sort by frequency, descending
    .map(entry => entry[0]); // Get the word only

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{article.title}</Text>
      <Text style={styles.cardDescription}>
        {article.description?.length > 80
          ? `${article.description.substring(0, 80)}...`
          : article.description}
      </Text>
      <View style={styles.tagsContainer}>
        {sortedKeywords.slice(0, 3).map((keyword, index) => (
          <Text key={index} style={styles.tag}>
            {keyword}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickSearches = ['All', 'Dairy-Free', 'Nut-Free', 'Gluten-Free', 'Egg-Free']
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetchAllArticles();
        setArticles(response.data);
        setFilteredArticles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
  
    const filtered = articles.filter((blog) => {
      // Extract sorted keywords for the blog
      const content = blog?.article_content || '';
      const wordCounts = content
        .split(/\W+/)
        .filter(word => word.length > 3)
        .reduce((counts, word) => {
          const lowerWord = word.toLowerCase();
          counts[lowerWord] = (counts[lowerWord] || 0) + 1;
          return counts;
        }, {});
  
      const sortedKeywords = Object.entries(wordCounts)
        .map(entry => entry[0]); // Get only the words
  
      // Check if the title or sorted keywords match the search query
      return (
        blog.title.toLowerCase().includes(text.toLowerCase()) ||
        sortedKeywords.some((keyword) => keyword.toLowerCase().includes(text.toLowerCase()))
      );
    });
  
    setFilteredArticles(filtered);
  };

  const handleQuickSearch = (filter) => {
    const query = filter === 'All' ? '' : filter;
    handleSearch(query); // Apply the search logic
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search articles or allergens blog"
          placeholderTextColor='#9F9F9F'
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {/* <TextInput
        style={styles.searchBar}
        placeholder="Search articles or allergens blog"
      /> */}
      <ScrollView horizontal style={styles.filterBar} showsHorizontalScrollIndicator={false}>
        {quickSearches.map((filter, index) => (
          <TouchableOpacity key={index} style={styles.filterButton}
          onPress={() => {
            setSearchQuery(filter === 'All' ? '' : filter); // Update search input
            handleQuickSearch(filter); // Trigger search logic
          }}
          >
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={styles.blogList}>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))
        ) : (
          <Text style={styles.noResultsText}>No blogs found matching your search.</Text>
        )}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#FAFAFA'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 30,
    marginHorizontal: 20
  },
  searchIcon: {
    marginLeft: 20,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 20,
    padding: 15,
    outlineStyle: "none", // Removes focus outline
    fontSize: 16
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxHeight: 60,
    minHeight: 60,
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    color: '#8A8E9B',
    paddingBottom: 10
  },
  blogList: {
    // flex: 1,
    marginBottom: 70,
  },
  noResultsText: {
    margin: 'auto',
    fontSize: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    color: '#555',
    marginRight: 8,
    marginBottom: 8,
  },
});

export default Blog;

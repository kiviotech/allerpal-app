import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { fetchAllArticles, fetchArticleById } from '../../src/services/articleServices';
import axios from 'axios';
import { MEDIA_BASE_URL } from '../../src/api/apiClient';

const { width } = Dimensions.get("window");

const BlogDetails = () => {
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { documentId } = useLocalSearchParams(); // Retrieve article ID from params  const router = useRouter()
  const videoUri = 'https://www.youtube.com/embed/d1Y6X1m1dqE'; // Example video link
  const articleSource = require('../../assets/relatedArticles.png')

  // Fetch article details by ID
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetchArticleById(documentId);
        setArticle(response.data);
      } catch (error) {
        console.error("Error fetching article details:", error);
      } finally {
        setLoading(false);
      }
    };
    // Fetch all articles
    const collectAllArticles = async () => {
      try {
        const response = await fetchAllArticles();
        const allArticles = response.data;

        // Exclude the current article from related articles
        const filteredArticles = allArticles.filter(
          (article) => article.id !== parseInt(documentId, 10)
        );
        setRelatedArticles(filteredArticles);
      } catch (error) {
        console.error('Error fetching related articles:', error);
      }
    };

    if (documentId) {
      fetchArticle();
      collectAllArticles();
    }
  }, [documentId]);

  const imageUrl =
    (article?.article_image?.url)
      ? `${MEDIA_BASE_URL}${article.article_image.url}`
      : 'https://via.placeholder.com/150';

  const renderCard = ({ item }) => {
    const articleImageUrl = (item?.article_image?.url)
      ? `${MEDIA_BASE_URL}${item?.article_image?.url}`
      : 'https://via.placeholder.com/150';
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/blog-details/${item.documentId}`)}
      >
        <Image source={{ uri: articleImageUrl }} style={styles.cardImage} />
        <Text style={styles.articleTitle}>{item?.title}</Text>
      </TouchableOpacity>
    );
  };
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>{article?.title}</Text>
        <View style={styles.authorContainer}>
          <Ionicons name="person-circle-outline" size={36} color="#333" />
          <View style={styles.autherDetails}>
            <Text style={styles.author}>{article?.author_name}</Text>
            <Text style={styles.author}>Published: {article?.published_date}</Text>
          </View>
        </View>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.tagsContainer}>
          {sortedKeywords.slice(0, 5).map((keyword, index) => (
            <Text key={index} style={styles.tag}>
              {keyword}
            </Text>
          ))}
        </View>
        <Text style={styles.title}>Title for the description</Text>
        <View style={styles.authorContainer}>
          <Text style={styles.description}>
            {article?.description || 'No description available.'}
          </Text>
        </View>

        {/* <View style={styles.section}>
          <Text>{article?.article_content}</Text>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.title}>Common Nuts in UK Cuisine</Text>
          <Text style={styles.description}>Several nuts are frequently used in British cooking:</Text>
          <View style={styles.unorderedList}>
            <Text style={styles.listItem}>• Almonds</Text>
            <Text style={styles.listItem}>• Hazelnuts</Text>
            <Text style={styles.listItem}>• Walnuts</Text>
            <Text style={styles.listItem}>• Cashews</Text>
          </View>
        </View>

        {/* Hidden Sources of Nuts */}
        <View style={styles.section}>
          <Text style={styles.title}>Hidden Sources of Nuts</Text>
          <Text style={styles.description}>
            Nuts can be found in unexpected places in UK cuisine. Always check ingredients in:
          </Text>
          <View style={styles.unorderedList}>
            <Text style={styles.listItem}>• Baked goods</Text>
            <Text style={styles.listItem}>• Sauces and dressings</Text>
            <Text style={styles.listItem}>• Vegetarian dishes</Text>
          </View>
        </View>

        {/* Tips for Dining Out */}
        <View style={styles.section}>
          <Text style={styles.title}>Tips for Dining Out</Text>
          <Text style={styles.description}>When eating out in the UK with a nut allergy:</Text>
          <View style={styles.orderedList}>
            <Text style={styles.listItem}>1. Always inform the staff about your allergy</Text>
            <Text style={styles.listItem}>2. Ask about cross-contamination risks</Text>
            <Text style={styles.listItem}>3. Consider carrying an epinephrine auto-injector</Text>
          </View>
        </View>

        <View style={styles.videoSection}>
          {Platform.OS === 'web' ? (
            <iframe
              style={styles.video}
              src={videoUri}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <WebView
              style={styles.video}
              javaScriptEnabled={true}
              source={{
                uri: videoUri,
              }}
            />
          )}
        </View>

        {/* Related Articles */}
        <View style={styles.section}>
          <Text style={styles.title}>Related Articles</Text>
          <FlatList
            data={relatedArticles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 20,
    elevation: 2,
  },
  backButton: {
    marginLeft: 10,
  },
  scrollContainer: {
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  authorContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  autherDetails: {
    paddingHorizontal: 15
  },
  author: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  section: {
    marginBottom: 10,
    paddingTop: 10,
  },
  unorderedList: {
    marginLeft: 16,
    marginTop: 8,
  },
  orderedList: {
    marginLeft: 16,
    marginTop: 8,
  },
  listItem: {
    fontSize: 14,
    marginVertical: 4,
    lineHeight: 20,
    color: '#333',
  },
  videoSection: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  video: {
    borderRadius: 20,
  },
  card: {
    width: width * 0.6,
    marginRight: 16,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    height: 200,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10
  },
  cardImage: {
    width: '100%', // Set appropriate width
    height: 100, // Set appropriate height
    borderRadius: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    color: '#333',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default BlogDetails;

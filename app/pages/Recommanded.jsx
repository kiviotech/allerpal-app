import { View, TextInput, StyleSheet, Text, SafeAreaView } from 'react-native'
import React from 'react'
import FoodItem from './FoodItem'
import { Ionicons } from '@expo/vector-icons';
import FoodRecommendations from './FoodRecommandation';
import RestaurantRecommendation from './RestaurantRecommendation';
import Favourites from './Favorites';
import { ScrollView } from 'react-native-web';
import Footer from './Footer';
import RecommandedCard from "./RecommandedCard"


const Recommanded = () => {
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
          
          <View style={styles.container}>
            <Ionicons name="search" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Find Blogs..."
            // placeholderTextColor="#aaa"
            />
          </View>
      <ScrollView style={styles.outerContainer}> 
        
        <View>
            <Text style={styles.Title}>Recommanded for You</Text>
            <RecommandedCard/>
        </View>
        <View>
            <Text style={styles.Title}>Read About</Text>
            <FoodItem/>
        </View>
        <View>
            <Text style={styles.Title}>Recently Posted</Text>
            <RecommandedCard/>
        </View>
      </ScrollView>
      <Footer/>
    </SafeAreaView>
  )
}

export default Recommanded

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    height: '66%',
    marginTop: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
    marginTop: '10%',
    marginLeft: '5%',
    width: '70%'
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  TextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '5%'
  },
  FoodRestro: {
    width: '100%',

  },
  Restro: {
    width: '100%',


  },
  Title:{
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginTop:10
  }
});
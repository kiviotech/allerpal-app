


import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, CheckBox,Button,Image } from 'react-native';
import { Rating } from 'react-native-ratings';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import download from '../../assets/download_icon.png';
import { submitReview } from '../../src/services/reviewServices';
import { useLocalSearchParams } from 'expo-router';

const ReviewForm = () => {
  const {id} = useLocalSearchParams()
  console.log(id)
  const [formData, setFormData] = useState({
    date: new Date(),
    showDatePicker: false,
    title: '',
    description: '',
    isAnonymous: false,
    allergensRelated: false,
    allergens: '',
    rating: 4, // default rating value
  });
const [image,setImage]= useState();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setFormData(prevData => ({
      ...prevData,
      showDatePicker: false,
      date: currentDate,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };


  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }


    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      setImage(result.uri);
    }
  };

const date= new Date();
const formatDate = date.toLocaleDateString('en-GB',{
  day:'2-digit',
  month:'2-digit',
  year:'numeric'
})
console.log(formatDate)

  const handleSubmit = async ()=>{
   
    const reviewData = {
      // title: formData.title,
      comment: formData.description,
      restaurant:id,
      profile:'asha',
      isAnonymous: formData.isAnonymous,
      allergensRelated: formData.allergensRelated,
      allergens: formData.allergens,
      rating: formData.rating,
      // date: formatDate,
      image: null,

  }
  console.log("formdata is :",formData)
  
  try {
    await submitReview(reviewData);  // Call submitReview from your service
    alert("Review submitted successfully!");
    // Optionally, reset the form or navigate to another screen
    setFormData({
      // date:formatDate,
      showDatePicker: false,
      title: '',
      description: '',
      isAnonymous: false,
      allergensRelated: false,
      allergens: '',
      rating: 4,
    });
    setImage(null);  // Reset the image
  } catch (error) {
    alert("Failed to submit review: " + error.message);
  }
};

  return (
    <View style={styles.container}>


<View style={styles.ArrowContainer}>
     <TouchableOpacity style={styles.backArrow} >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      
      <Text style={styles.header}>Review</Text>
     </View>


      {/* <Text style={styles.label}>Date of Visit</Text>
      <TouchableOpacity 
        onPress={() => setFormData(prevData => ({ ...prevData, showDatePicker: true }))}
        style={[styles.input, styles.dateInput]}
      >
        <Text>{formData.date.toDateString()}</Text>
        <Ionicons name="calendar" size={24} color="cyan" style={styles.dateIcon} />
      </TouchableOpacity>
      
      {formData.showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )} */}

      <Text style={styles.label}>Title of Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name of title"
        placeholderTextColor="#a0a0a0"
        value={formData.title}
        onChangeText={value => handleInputChange('title', value)}
      />

      <Text style={styles.label}>Review Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter experience about food and visit here"
         placeholderTextColor="#a0a0a0"
        value={formData.description}
        onChangeText={value => handleInputChange('description', value)}
        multiline
      />

      <View style={styles.row}>
        <CheckBox
          value={formData.isAnonymous}
          onValueChange={value => handleInputChange('isAnonymous', value)}
        />
        <Text style={styles.checkboxLabel}>Post this review anonymously</Text>
      </View>

    <View style={styles.reviewContainer}>
    <Text style={styles.label1}>Are you writing this review on your saved allergens?</Text>
    <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              formData.allergensRelated && styles.selectedCheckbox,
            ]}
            onPress={() => handleInputChange('allergensRelated', true)}
          >
            {formData.allergensRelated && (
              <Ionicons name="checkmark" size={15} color="#00C9D6" />
            )}
           
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Yes</Text>
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              !formData.allergensRelated && styles.selectedCheckbox,
            ]}
            onPress={() => handleInputChange('allergensRelated', false)}
          >
            {!formData.allergensRelated && (
              <Ionicons name="checkmark" size={15} color="#00C9D6" />
            )}
            
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>No</Text>
        </View>
    </View>

      {!formData.allergensRelated && (
        <>
          <Text style={styles.label2}>If no, please specify which allergens your review relates to</Text>
          <TextInput
            style={styles.input1}
            placeholder="Type your allergens here"
             placeholderTextColor="#a0a0a0"
            value={formData.allergens}
            onChangeText={value => handleInputChange('allergens', value)}
          />
        </>
      )}

<View style={styles.uploadContainer}>
      <Text style={styles.label}>Upload related photos</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        <View style={styles.uploadContent}>
        <Image source={download} style={styles.icon} />
          <Text style={styles.uploadText}>Drag & Drop or Choose file to Upload</Text>
          <Text style={styles.fileTypes}>JPG, PNG or CVS</Text>
        </View>
        <Button title="Browse file" onPress={pickImage} color="#00C9D6" />
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
    </View>

      <Text style={styles.label2}>Rate your Experience</Text>
     <View style={styles.ratingContainer}>
     <Rating
        startingValue={formData.rating} // Starting value should reflect the state
        imageSize={30}
        onFinishRating={value => handleInputChange('rating', value)} // Update the state correctly
        style={styles.rating}
      />
     </View>

     <View style={styles.buttonContainer}>
     <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
     </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  
  label1:{
    fontSize: 18,
    marginTop:30,
    color: '#333',
  }, label2:{
    fontSize: 18,
    marginTop:20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:8,
    
  },
  input1: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:8,
    height:100
    
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textArea: {
    height: 80,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap:8
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  option: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
  },
  selectedOption: {
    fontWeight: 'bold',
    color: '#00f',
  },
  ratingContainer:{
    display:'flex',
   
   
  },
  rating: {
  marginTop:20,
  marginHorizontal:15
  
   
  },
  dateIcon: {
    position: 'absolute',
    right: 10,
  },
  buttonContainer:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  submitButton: {
    backgroundColor: '#00aced',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop:25,
    
    width:'40%',
   
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  reviewContainer:{
    display:'flex',
    flexDirection:'row',
  justifyContent:'center',
 alignItems:'center'
  },

  label: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 10,
  },
  uploadBox: {
  
    borderColor: '#00C9D6',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
   
    borderStyle:'dashed',
    borderWidth:3
  },
  uploadContent: {
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    color: '#808080',
    textAlign: 'center',
  },
  fileTypes: {
    fontSize: 12,
    color: '#C0C0C0',
    marginTop: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00C9D6',
    borderRadius: 5,
    padding: 4,
    width:20,
    height:20,
    marginHorizontal: 8,
  },
  selectedCheckbox: {
    backgroundColor: '#E0F7FA',
  },
  ArrowContainer:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    

  },
  backArrow: {
   
    marginTop: 13,  // Add some space above the back arrow
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    padding: 15,
    color: '#000',
    marginTop: 10, // Move header down a bit
  },
  icon: {
    width: 24,   // Adjust size as needed
    height: 24,
    marginRight: 5,
  },
});

export default ReviewForm;

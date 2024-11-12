


import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, CheckBox } from 'react-native';
import { Rating } from 'react-native-ratings';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const ReviewForm = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date of Visit</Text>
      <TouchableOpacity 
        onPress={() => setFormData(prevData => ({ ...prevData, showDatePicker: true }))}
        style={[styles.input, styles.dateInput]}
      >
        <Text>{formData.date.toDateString()}</Text>
        <Ionicons name="calendar" size={24} color="gray" style={styles.dateIcon} />
      </TouchableOpacity>
      
      {formData.showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Title of Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name of title"
        value={formData.title}
        onChangeText={value => handleInputChange('title', value)}
      />

      <Text style={styles.label}>Review Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter experience about food and visit here"
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
        <TouchableOpacity onPress={() => handleInputChange('allergensRelated', true)}>
          <Text style={[styles.option, formData.allergensRelated && styles.selectedOption]}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInputChange('allergensRelated', false)}>
          <Text style={[styles.option, !formData.allergensRelated && styles.selectedOption]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>

      {!formData.allergensRelated && (
        <>
          <Text style={styles.label2}>If no, please specify which allergens your review relates to</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your allergens here"
            value={formData.allergens}
            onChangeText={value => handleInputChange('allergens', value)}
          />
        </>
      )}

      <Text style={styles.label}>Rate your Experience</Text>
      <Rating
        startingValue={formData.rating} // Starting value should reflect the state
        imageSize={30}
        onFinishRating={value => handleInputChange('rating', value)} // Update the state correctly
        style={styles.rating}
      />

     <View style={styles.buttonContainer}>
     <TouchableOpacity style={styles.submitButton}>
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
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
    marginTop:10
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
    marginTop:8
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
  rating: {
  marginTop:20
   
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
  }
});

export default ReviewForm;

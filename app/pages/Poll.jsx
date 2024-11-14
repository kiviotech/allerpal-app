import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MyFeedPage from './MyFeedPage'

const Poll = () => {
    const router= useRouter()
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: 'Option 1', selected: false },
    { text: 'Option 2', selected: false },
    { text: 'Option 3', selected: false },
    { text: 'add new', selected: false },
  ]);

  const handleOptionChange = (index, text) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleSelectOption = (index) => {
    // If the last option ("add new") is clicked, add a new option just before "add new"
    if (index === options.length - 1) {
      const newOption = { text: `Option ${options.length}`, selected: false };
      // Insert the new option just before "add new"
      const newOptions = [...options];
      newOptions.splice(options.length - 1, 0, newOption);  // Add the new option just before the "add new" option
      setOptions(newOptions);
      return;
    }

    const newOptions = options.map((option, i) => ({
      ...option,
      selected: i === index, // Only the selected option will be marked
    }));
    setOptions(newOptions);
  };

  const handlePostPoll = () => {
    console.log('Posting poll:', { question, options });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
       <TouchableOpacity onPress={()=>router.push('./MyFeedPage')}>
       <Ionicons name="arrow-back" size={24} color="#000" />
       </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Poll</Text>
      </View>
<View style={styles.inputContainer}>
<Text  style={{color:'#ccc',fontSize:18}}>Yor Question</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your question"
        value={question}
        onChangeText={setQuestion}
      />
</View>

      {/* Display options with radio buttons */}
      {options.map((option, index) => (
        <View key={index} style={styles.optionContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handleSelectOption(index)}
          >
            <View
              style={[
                styles.radioCircle,
                option.selected && styles.selectedRadioCircle,
              ]}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.optionInput}
            placeholder={`Option ${index + 1}`}
            value={option.text}
            onChangeText={(text) => handleOptionChange(index, text)}
          />
        </View>
      ))}

      {/* Post Poll Button */}
     <View style={styles.buttonContainer}>
     <TouchableOpacity style={styles.postButton} onPress={handlePostPoll}>
        <Text style={styles.postButtonText}>Post Poll</Text>
      </TouchableOpacity>
     </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'%fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inputContainer:{
    marginTop:20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: '#ccc',
    padding: 10,
    fontSize:20
    // marginBottom: 10,
 
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:10,
    marginLeft:25
  },
  radioButton: {
    marginRight: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioCircle: {
    backgroundColor: '#007bff',
  },
  optionInput: {
    flex: 1,
  
    padding: 10,
  },
  buttonContainer:{
    display:'flex',
    alignItems:'center',
    justifyContent:'cenetr',
    marginTop:'20%'
  },
  postButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width:'30%'
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Poll;

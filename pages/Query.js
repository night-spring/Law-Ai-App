import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, Button, Platform, PermissionsAndroid } from 'react-native';
import SpeechToText from 'react-native-voice'; // Import SpeechToText
import Icon from 'react-native-vector-icons/FontAwesome';

const Query = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('Response will appear here...');
  const [isListening, setIsListening] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);


  const [error, setError] = useState('');

 

  const toggleDescription = (section) => {
    if (activeSection === section) {
      setActiveSection(null);  // Collapse if the same section is clicked
    } else {
      setActiveSection(section);  // Expand the clicked section
    }
  };
  
  const handleMicClick = async () => {
    try {
      if (isListening) {
        // Stop listening
        await SpeechToText.stopListening();
        console.log('Speech recognition stopped');
        setIsListening(false);
      } else {
        // Start listening
        await SpeechToText.startListening();
        console.log('Speech recognition started');
        setIsListening(true);
      }
    } catch (error) {
      console.error('Error in handling mic click:', error);
      setIsListening(false); // Reset listening state on error
    }
  };

  const handleInputChange = (text) => {
    setQuery(text);
  };

  const handleQuerySubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://sih-backend-881i.onrender.com/encode/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResponse(data); // Display the entire response as it is
    } catch (error) {
      console.error('Error fetching the response:', error);
      setError('Error occurred while fetching the response');
      setResponse('');
    }

    setIsLoading(false);
  };

  const renderResponse = (data) => {
    if (!data) {
      return <Text style={styles.responseText}>No data available</Text>;
    }

    if (typeof data === 'object' && typeof data.acts === 'object') {
      return (
        <View>
  <Text style={styles.responseTitle}>Act: IPC</Text>
  <ScrollView style={styles.scrollView}>
  {Object.entries(data.acts).map(([section, description], index) => (
    <View key={index} style={styles.sectionContainer}>
      <Text style={styles.responseText}>Section {section}</Text>
      <TouchableOpacity onPress={() => toggleDescription(section)}>
        <Text style={styles.linkText}>
          {activeSection === section ? 'Hide Description' : 'Show Description'}
        </Text>
      </TouchableOpacity>
      {activeSection === section && (
        <Text style={styles.descriptionText}>{description}</Text>
      )}
    </View>
  ))}
</ScrollView>

</View>

      );
    }

    return <Text style={styles.responseText}>{JSON.stringify(data, null, 2)}</Text>;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.responseContainer}>
        <View style={styles.responseBox}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            renderResponse(response)
          )}
        </View>
      </ScrollView>

      {/* Query Input with Mic */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleInputChange}
          placeholder="Type your query here..."
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity
          onPress={() => {
            console.log('Microphone button clicked'); // Debug log for button click
            handleMicClick(); // Ensure handleMicClick is invoked correctly
          }}
          style={styles.micButton}
        >
          <Icon
            name="microphone"
            size={24}
            color={isListening ? '#007bff' : '#555'}
          />
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity onPress={handleQuerySubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Query</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  responseBox: {
    flex: 1,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4f',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  micButton: {
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  responseText: {
    fontSize: 16,
    marginBottom: 8,
  },
  linkText: {
    color: 'blue',  // Blue color for the clickable text
    fontSize: 16,
    textDecorationLine: 'underline',  // Optional: Adds an underline to make it look like a link
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  scrollView: {
    margin: 10,
  },
});

export default Query;

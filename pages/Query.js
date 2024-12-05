import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Voice from 'react-native-voice'; // For voice recognition
import Icon from 'react-native-vector-icons/FontAwesome';

const Query = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('Response will appear here...');
  const [isListening, setIsListening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false); // Show popup after response
  const [tagInput, setTagInput] = useState('');
  const [caseData, setCaseData] = useState({
    query: '',
    caseHeading: '',
    applicableArticles: '',
    tags: [],
    status: '',
    description: '',
  });

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      setQuery(event.value[0]);
    };

    Voice.onSpeechError = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      Voice.stop();
    } else {
      Voice.start('en-US');
    }
    setIsListening(!isListening);
  };

  const handleInputChange = (text) => {
    setQuery(text);
  };

  const handleQuerySubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://sih-backend-seven.vercel.app/ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setCaseData({
        query,
        caseHeading: data.caseHeading || 'Untitled Case',
        applicableArticles: data.response || 'No applicable articles',
        tags: [],
      });

      setResponse(data.response || 'No response received');

      // Show popup after receiving a valid response
      setShowPopup(true);
    } catch (error) {
      console.error('Error fetching the response:', error);
      setError('Error occurred while fetching the response');
      setResponse('');
    }

    setIsLoading(false);
    setQuery('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !caseData.tags.includes(tagInput.trim())) {
      setCaseData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, tagInput.trim()],
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (index) => {
    setCaseData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSaveCase = async () => {
    try {
      const endpoint = 'https://sih-backend-seven.vercel.app/case_save/'; // Replace with your actual endpoint
      const dataToSend = { ...caseData };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        Alert.alert('Case saved successfully!');
        setIsModalOpen(false);  // Close modal after success
        setShowPopup(false); // Close popup after saving
      } else {
        Alert.alert('Failed to save the case.');
      }
    } catch (error) {
      Alert.alert('Error saving the case:', error);
    }
  };

  const renderPopup = () => {
    if (!showPopup) return null;

    return (
      <View style={styles.popupContainer}>
        <TouchableOpacity
          onPress={() => setIsModalOpen(true)} // Open modal to save case
          style={styles.popup}
        >
          <Text style={styles.popupText}>New case identified! Click to review.</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderModal = () => {
    return (
      <Modal visible={isModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Case to Database</Text>

            {/* Query Field */}
            <TextInput
              value={caseData.query}
              onChangeText={(text) => setCaseData({ ...caseData, query: text })}
              style={styles.input}
              placeholder="User Query"
            />

            {/* Case Heading Field */}
            <TextInput
              value={caseData.caseHeading}
              onChangeText={(text) => setCaseData({ ...caseData, caseHeading: text })}
              style={styles.input}
              placeholder="Case Heading"
            />

            {/* Applicable Articles Field */}
            <TextInput
              value={caseData.applicableArticles}
              onChangeText={(text) => setCaseData({ ...caseData, applicableArticles: text })}
              style={styles.input}
              placeholder="Applicable Articles"
            />

            {/* Status Field */}
            <TextInput
              value={caseData.status}
              onChangeText={(text) => setCaseData({ ...caseData, status: text })}
              style={styles.input}
              placeholder="Status"
            />

            {/* Description Field */}
            <TextInput
              value={caseData.description}
              onChangeText={(text) => setCaseData({ ...caseData, description: text })}
              style={styles.input}
              placeholder="Description"
            />

            {/* Save and Cancel Buttons */}
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setIsModalOpen(false)} />
              <Button title="Save Case" onPress={handleSaveCase} />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Query Response Box */}
        <View style={styles.queryResponseBox}>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.responseText}>{response}</Text>
          )}
        </View>

        {/* User input for query with microphone button */}
        <View style={styles.queryContainer}>
          <TextInput
            style={styles.queryEntryBox}
            value={query}
            onChangeText={handleInputChange}
            placeholder="Type your query here..."
          />
          <TouchableOpacity onPress={handleMicClick} style={styles.micButton}>
            <Icon name="microphone" size={30} color={isListening ? 'green' : 'gray'} />
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View style={styles.submitButtonContainer}>
          <Button style={styles.submitButton} title="Submit" onPress={handleQuerySubmit} color="#007bff" />
        </View>

        {/* Render Popup after response */}
        {renderPopup()}

        {/* Case Information Modal */}
        {isModalOpen && renderModal()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Add styles for the popup
  popupContainer: {
    position: 'fixed', // Change from 'absolute' to 'fixed'
    top: 20, // Stick it to the top of the screen
    left: 0,
    right: 0,
    bottom: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    zIndex: 10, // Ensure the popup is on top
  },
  popup: {
    backgroundColor: 'darkblue',
    padding: 15,
    borderColor: 'black',
    borderRadius: 10,
  },
  popupText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginVertical: 10, // Add some vertical spacing between cards
  },
  queryResponseBox: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#f9f9f9', // Light grey background
    borderRadius: 12, // Rounded corners
    borderWidth: 1,
    borderColor: '#ddd', // Light border color
  },
  responseText: {
    fontSize: 16,
    color: '#333', // Dark text color for readability
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#007bff', // Blue color for loading
    fontWeight: '500', // Slightly bolder
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f', // Bootstrap red color
    fontWeight: '500', // Slightly bolder
    textAlign: 'center',
  },
  queryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25, // Increased space between input and button
  },
  queryEntryBox: {
    flex: 1,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8, // Smoother input corners
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5', // Light grey background for input field
    fontSize: 16, // Slightly larger font
  },
  micButton: {
    marginLeft: 15,
    padding: 10,
    borderRadius: 500,
    backgroundColor: 'white', // Mic button background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonContainer: {
    marginTop: 15,
    borderRadius:20
  },
  submitButton:{
borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
  },
  modalContent: {
    width: '85%', // Slightly wider modal
    padding: 25,
    backgroundColor: '#ffffff',
    borderRadius: 15, // Rounder modal corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600', // Slightly lighter than bold
    marginBottom: 20,
    color: '#333', // Darker title color
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#f5f5f5', // Light grey background
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20, // Added spacing between buttons and input fields
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#007bff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#d9534f', // Red background for cancel button
  },
  saveButton: {
    backgroundColor: '#5bc0de', // Light blue for save button
  },
});

export default Query;

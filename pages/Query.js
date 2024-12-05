import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import Voice from 'react-native-voice'; // For voice recognition
import Icon from 'react-native-vector-icons/FontAwesome';

const Query = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('Response will appear here...');
  const [isListening, setIsListening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
    const endpoint = 'https://sih-backend-seven.vercel.app/case_save/';
    const dataToSend = {
      caseHeading: caseData.caseHeading,
      applicableArticle: caseData.applicableArticles,
      tags: caseData.tags,
      query: caseData.query,
      status: caseData.status,
      description: caseData.description,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('Case saved successfully!');
        setIsModalOpen(false); // Close modal after success
      } else {
        alert('Failed to save the case.');
      }
    } catch (error) {
      alert('Error saving the case:', error);
    }
  };

  const HowItWorksModal = () => {
    return (
      <Modal visible={isModalOpen} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>How It Works</Text>
          <Text style={styles.modalBody}>
            Type in any criminal incident, and the model will try to determine the acts and sections applicable to the incident.
          </Text>
          <Button title="Close" onPress={() => setIsModalOpen(false)} />
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Integrate the MenuBar component with high zIndex */}

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

      {/* User input for query */}
      <TextInput
        style={styles.queryEntryBox}
        value={query}
        onChangeText={handleInputChange}
        placeholder="Type your query here..."
      />

      {/* Microphone button */}
      <TouchableOpacity onPress={handleMicClick} style={styles.micButton}>
        <Icon name="microphone" size={30} color={isListening ? 'green' : 'gray'} />
      </TouchableOpacity>

      {/* Submit Button */}
      <Button title="Submit" onPress={handleQuerySubmit} />

      {/* Case Information Modal */}
      {isModalOpen && (
        <Modal transparent={true} visible={isModalOpen}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text>Case Heading</Text>
              <TextInput
                value={caseData.caseHeading}
                onChangeText={(text) => setCaseData({ ...caseData, caseHeading: text })}
                style={styles.modalInput}
              />

              <Text>Applicable Articles</Text>
              <TextInput
                value={caseData.applicableArticles}
                onChangeText={(text) => setCaseData({ ...caseData, applicableArticles: text })}
                style={styles.modalInput}
              />

              <Text>Status</Text>
              <TextInput
                value={caseData.status}
                onChangeText={(text) => setCaseData({ ...caseData, status: text })}
                style={styles.modalInput}
              />

              <Text>Description</Text>
              <TextInput
                value={caseData.description}
                onChangeText={(text) => setCaseData({ ...caseData, description: text })}
                style={styles.modalInput}
              />

              <View style={styles.tagContainer}>
                <Text>Tags</Text>
                <TextInput
                  value={tagInput}
                  onChangeText={setTagInput}
                  style={styles.tagInput}
                />
                <Button title="Add Tag" onPress={handleAddTag} />
                <FlatList
                  data={caseData.tags}
                  renderItem={({ item, index }) => (
                    <View style={styles.tagItem}>
                      <Text>{item}</Text>
                      <TouchableOpacity onPress={() => handleRemoveTag(index)}>
                        <Text style={styles.removeTag}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>

              <Button title="Save Case" onPress={handleSaveCase} />
              <Button title="Cancel" onPress={() => setIsModalOpen(false)} />
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  menuBar: {
    zIndex: 1000,
    position: 'absolute',
    top: 0,
    width: '100%',
    elevation: 1000, // Ensure the MenuBar has the highest stack level
  },
  queryEntryBox: {
    marginVertical: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    zIndex: 1, // Lower zIndex for this element
  },
  queryResponseBox: {
    marginVertical: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    zIndex: 1, // Lower zIndex for this element
  },
  loadingText: { textAlign: 'center', color: 'blue' },
  errorText: { textAlign: 'center', color: 'red' },
  responseText: { textAlign: 'center' },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1, // Lower zIndex for modal background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    zIndex: 2, // Ensure modal content is higher than background but lower than MenuBar
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { marginVertical: 10 },
  modalInput: { borderWidth: 1, marginVertical: 5, padding: 10 },
  tagContainer: { marginVertical: 20 },
  tagInput: { borderWidth: 1, padding: 10, marginVertical: 10 },
  tagItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  removeTag: { color: 'red' },
  micButton: { marginTop: 10 },
});


export default Query;

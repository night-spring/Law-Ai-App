import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet,ScrollView,Button } from 'react-native';
import Voice from 'react-native-voice'; // For voice recognition
import Icon from 'react-native-vector-icons/FontAwesome';

const Query = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('Response will appear here...');
  const [isListening, setIsListening] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const initializeVoice = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'This app needs access to your microphone to process voice queries.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.error('Microphone permission denied');
          }
        }
      } catch (err) {
        console.error('Permission request failed:', err);
      }
    };

    initializeVoice();

    Voice.onSpeechStart = () => {
      console.log('Speech recognition started');
    };

    Voice.onSpeechEnd = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        setQuery(event.value[0]);
      }
    };

    Voice.onSpeechError = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  const toggleDescriptions = () => {
    setShowDescriptions((prev) => !prev);
  };

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
  
    const toggleDescriptions = () => {
      setShowDescriptions((prev) => !prev);
    };
  
    if (typeof data === 'object' && typeof data.acts === 'object') {
      return (
        <View>
          <Text style={styles.responseTitle}>Act: IPC</Text>
          <Button
            title={showDescriptions ? "Hide Descriptions" : "Show Descriptions"}
            onPress={toggleDescriptions}
          />
          <ScrollView style={styles.scrollView}>
            {Object.entries(data.acts).map(([section, description], index) => (
              <View key={index} style={styles.sectionContainer}>
                <Text style={styles.responseText}>Section {section}</Text>
                {showDescriptions && (
                  <Text style={styles.descriptionText}>{description}</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }
  
    return (
      <Text style={styles.responseText}>
        {JSON.stringify(data, null, 2)}
      </Text>
    );
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
        <TouchableOpacity onPress={handleMicClick} style={styles.micButton}>
          <Icon name="microphone" size={24} color={isListening ? '#007bff' : '#555'} />
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
});

export default Query;

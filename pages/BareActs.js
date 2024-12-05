import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, TouchableOpacity, Modal, StyleSheet, Linking } from 'react-native';
import axios from 'axios';


const BareActs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [laws, setLaws] = useState([]);
  const [selectedActType, setSelectedActType] = useState('');
  const [showDownloads, setShowDownloads] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Assume mobile for simplicity
  const [isFetching, setIsFetching] = useState(false);
  const [results, setResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);  // for modal dropdown
  const [dropdownValue, setDropdownValue] = useState('');  // store the selected value from dropdown

  // State for fetching PDFs
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Fetch PDFs on component mount
  useEffect(() => {
    const fetchPdfs = async () => {
      setPdfLoading(true);
      setPdfError(null);

      try {
        const response = await axios.get("https://sih-backend-seven.vercel.app/pdfs/");
        setPdfs(response.data); // Assuming the response contains the list of PDFs with metadata
        setFilteredPdfs(response.data); // Set initial filtered PDFs to all PDFs
      } catch (err) {
        setPdfError("Failed to fetch PDF data.");
        console.error("Error fetching PDFs:", err);
      } finally {
        setPdfLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  const performSearch = async () => {
    if (!searchQuery && !dropdownValue) {
      setError('Please fill in at least one field for search.');
      return;
    }

    setIsFetching(true);
    try {
      const payload = { query: searchQuery, act: dropdownValue };

      const apiResponse = await axios.post(
        'https://sih-backend-seven.vercel.app/search/',
        payload
      );

      setResults(apiResponse.data.response || []);
      if (apiResponse.data.response.length === 0) {
        setError('No results found.');
      }
    } catch (err) {
      setError('Error fetching data.');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>Bare Acts Library</Text>

          <View style={{ marginTop: 20 }}>
            <Button title="View Bare Acts" onPress={() => setShowDownloads(false)} />
            <Button title="Original Documents" onPress={() => setShowDownloads(true)} />
          </View>

          {!showDownloads ? (
            <View style={{ marginTop: 20 }}>
              <TextInput
                placeholder="Search for a Bare Act"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              />

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setModalVisible(true)}
              >
                <Text>{dropdownValue || 'Select Act Type'}</Text>
              </TouchableOpacity>

              {/* Modal for selecting Act Type */}
              <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    {['bns', 'ipc', 'crpc', 'iea', 'cpc', 'mva'].map((act) => (
                      <TouchableOpacity
                        key={act}
                        style={styles.modalItem}
                        onPress={() => {
                          setDropdownValue(act);
                          setModalVisible(false);
                        }}
                      >
                        <Text>{act.toUpperCase()}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Modal>

              <Button title="Search" onPress={performSearch} />

              {isFetching ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : error ? (
                <Text style={{ color: 'red' }}>{error}</Text>
              ) : (
                <FlatList
                  data={results}
                  renderItem={({ item }) => (
                    <View key={item.id} style={{ marginBottom: 20 }}>
                      <Text style={{ fontWeight: 'bold' }}>Section {item.section_id}</Text>
                      <Text>{item.section_title}</Text>
                      <Text>{item.description}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              )}
            </View>
          ) : (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Original Documents</Text>

              {pdfLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : pdfError ? (
                <Text style={{ color: 'red' }}>{pdfError}</Text>
              ) : (
                <FlatList
                  data={filteredPdfs}
                  renderItem={({ item }) => (
                    <View style={styles.documentItem} key={item.id}>
                      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                      {/* Ensure the URL is valid before using Linking */}
                      {item.url ? (
                        <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                          <Text style={{ color: 'blue' }}>Download PDF</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={{ color: 'red' }}>Invalid URL</Text>
                      )}
                    </View>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  documentItem: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default BareActs;

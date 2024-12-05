import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, Button, useWindowDimensions } from 'react-native';
import Footer from '../components/Footer';

const Database = () => {
  const [cases, setCases] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaseData, setEditedCaseData] = useState({});
  
  const { width } = useWindowDimensions(); // using useWindowDimensions to track window size
  const scrollViewRef = useRef(null); // Reference to ScrollView for scrollTo functionality

  // Update isMobile state based on window width
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://sih-backend-seven.vercel.app/case_list/');
      const data = await response.json();
      setCases(data.cases || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setCases([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'green';
      case 'closed':
        return 'red';
      case 'under-investigation':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const openCaseDetailsModal = (id) => {
    const caseItem = cases.find((caseItem) => caseItem.id === id);
    setActiveCase(caseItem);
    setEditedCaseData(caseItem);
    setIsEditing(false);
  };

  const closeCaseDetailsModal = () => {
    setActiveCase(null);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveChanges = () => {
    const updatedCases = cases.map((caseItem) =>
      caseItem.id === activeCase.id
        ? {
            ...caseItem,
            caseHeading: editedCaseData.caseHeading,
            query: editedCaseData.query,
            applicableArticle: editedCaseData.applicableArticle,
            description: editedCaseData.description,
            status: editedCaseData.status,
          }
        : caseItem
    );

    setCases(updatedCases);
    setActiveCase(null);
  };

  const handleInputChange = (name, value) => {
    setEditedCaseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Scroll to the top function
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4f8' }}>
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        onScroll={(event) => {
          if (event.nativeEvent.contentOffset.y > 200) {
            setShowScrollBtn(true);
          } else {
            setShowScrollBtn(false);
          }
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: '600', textAlign: 'center', marginVertical: 16, color: '#1D4ED8' }}>
          Case Database
        </Text>

        {cases.length === 0 ? (
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '600', color: '#4B5563' }}>
            No cases available
          </Text>
        ) : (
          <FlatList
            data={cases}
            renderItem={({ item }) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: '#fff',
                  padding: 16,
                  marginVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 22, fontWeight: '600', color: '#1D4ED8' }}>
                    {item.caseHeading}
                  </Text>
                  <Text
                    style={{
                      backgroundColor: getStatusColor(item.status),
                      color: '#fff',
                      paddingVertical: 4,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {item.status}
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>{item.query}</Text>
                <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 4 }}>
                  <Text style={{ fontWeight: 'bold' }}>Tags:</Text> {item.tags}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <TouchableOpacity onPress={() => openCaseDetailsModal(item.id)}>
                    <Text style={{ color: '#3B82F6', fontSize: 16 }}>Show Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      openCaseDetailsModal(item.id);
                      setIsEditing(true);
                    }}
                  >
                    <Text style={{ color: '#F59E0B', fontSize: 16 }}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </ScrollView>

      <Footer />

      {showScrollBtn && (
        <TouchableOpacity
          onPress={scrollToTop}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#3B82F6',
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 24 }}>↑</Text>
        </TouchableOpacity>
      )}

      {activeCase && (
        <Modal visible={true} transparent={true} animationType="slide" onRequestClose={closeCaseDetailsModal}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View
              style={{
                width: '90%',
                backgroundColor: '#fff',
                padding: 16,
                borderRadius: 8,
                maxHeight: '80%',
                overflow: 'scroll',
              }}
            >
              <TouchableOpacity onPress={closeCaseDetailsModal} style={{ position: 'absolute', top: 10, right: 10 }}>
                <Text style={{ fontSize: 24, color: '#4B5563' }}>×</Text>
              </TouchableOpacity>
              <ScrollView>
                <Text style={{ fontSize: 24, fontWeight: '600', color: '#1D4ED8' }}>
                  {isEditing ? (
                    <TextInput
                      value={editedCaseData.caseHeading || ''}
                      onChangeText={(text) => handleInputChange('caseHeading', text)}
                      style={{
                        fontSize: 24,
                        fontWeight: '600',
                        color: '#1D4ED8',
                        borderBottomWidth: 1,
                        borderBottomColor: '#D1D5DB',
                      }}
                    />
                  ) : (
                    activeCase.caseHeading
                  )}
                </Text>
                <Text style={{ fontSize: 18, color: '#000', marginTop: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>Query: </Text>
                  {isEditing ? (
                    <TextInput
                      value={editedCaseData.query || ''}
                      onChangeText={(text) => handleInputChange('query', text)}
                      style={{
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: '#D1D5DB',
                        padding: 8,
                        marginTop: 4,
                      }}
                      multiline
                    />
                  ) : (
                    activeCase.query
                  )}
                </Text>
                <Text style={{ fontSize: 16, color: '#000', marginTop: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>Tags: </Text>
                  {activeCase.tags}
                </Text>
                {isEditing && (
                  <Button onPress={handleSaveChanges} title="Save Changes" color="#3B82F6" />
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Database;

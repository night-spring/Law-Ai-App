import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import axios from "axios";

const BareActs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [laws, setLaws] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [pdfSearchQuery, setPdfSearchQuery] = useState("");
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [showDownloads, setShowDownloads] = useState(false);
  const [selectedActType, setSelectedActType] = useState("");

  useEffect(() => {
    const fetchLaws = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://sih-backend-seven.vercel.app/database/");
        setLaws(response.data.data);
      } catch (err) {
        console.error("Error fetching laws:", err);
        setError("Failed to fetch laws data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLaws();
  }, []);

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://sih-backend-seven.vercel.app/pdfs/");
        setPdfs(response.data);
        setFilteredPdfs(response.data);
      } catch (err) {
        console.error("Error fetching PDFs:", err);
        setError("Failed to fetch PDF data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  const handleSearch = async () => {
    if (!selectedActType) {
      Alert.alert("Error", "Please select an act type to proceed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://sih-backend-seven.vercel.app/search/", {
        query: searchQuery || "",
        act: selectedActType,
      });
      setSearchResults(response.data.data);
    } catch (err) {
      setError("An error occurred while fetching results.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfSearchChange = (text) => {
    setPdfSearchQuery(text);
    if (text === "") {
      setFilteredPdfs(pdfs);
    } else {
      const filtered = pdfs.filter((pdf) =>
        pdf.act_name.toLowerCase().includes(text.toLowerCase()) ||
        pdf.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPdfs(filtered);
    }
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Bare Acts Database</Text>

      <View style={styles.toggleSection}>
        <TouchableOpacity
          onPress={() => setShowDownloads(false)}
          style={[
            styles.toggleButton,
            !showDownloads ? styles.activeToggleButton : null,  // Active toggle style for 'View Bare Acts'
          ]}
        >
          <Text style={styles.toggleButtonText}>View Bare Acts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowDownloads(true)}
          style={[
            styles.toggleButton,
            showDownloads ? styles.activeToggleButton : null,  // Active toggle style for 'Original Documents'
          ]}
        >
          <Text style={styles.toggleButtonText}>Original Documents</Text>
        </TouchableOpacity>
      </View>

      {!showDownloads ? (
        <View>
          <View style={styles.searchSection}>
            <TextInput
              style={styles.input}
              placeholder="Search for a Bare Act"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TextInput
              style={styles.input}
              placeholder="Select Act Type (e.g., IPC)"
              value={selectedActType}
              onChangeText={setSelectedActType}
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <View>
              {laws.map((law) => (
                <View key={law.id} style={styles.lawItem}>
                  <Text style={styles.lawTitle}>
                    Section {law.section_id}: {law.section_title}
                  </Text>
                  <Text style={styles.lawDescription}>{law.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Search PDFs"
            value={pdfSearchQuery}
            onChangeText={handlePdfSearchChange}
          />
          <FlatList
            data={filteredPdfs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.pdfItem}>
                <Text style={styles.pdfTitle}>{item.act_name}</Text>
                <Text style={styles.pdfDescription}>{item.description}</Text>
              </View>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
    marginBottom: 20,
  },
  toggleSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeToggleButton: {
    backgroundColor: "#003366",  // Highlight the active button
  },
  toggleButtonText: {
    color: "#fff",
  },
  searchSection: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#003366",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  lawItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  lawTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003366",
  },
  lawDescription: {
    marginTop: 5,
    color: "#333",
  },
  pdfItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003366",
  },
  pdfDescription: {
    marginTop: 5,
    color: "#333",
  },
});

export default BareActs;

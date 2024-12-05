import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FileSystem } from 'expo-file-system';
import { Sharing } from 'expo-sharing';

const OfficialFIRFormat = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to download and save the FIR PDF file
  const downloadPdf = async () => {
    setIsDownloading(true); // Start the download process

    try {
      // Path to your FIR.pdf file in the assets folder (relative path within your project)
      const fileUri = FileSystem.documentDirectory + 'FIR.pdf';

      // Copy the FIR.pdf file to the device's file system
      await FileSystem.downloadAsync(
        'https://yourserver.com/path/to/FIR.pdf', // Use the URL where your FIR.pdf is hosted
        fileUri
      );

      // Optionally, share the downloaded PDF if sharing is available
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }

      Alert.alert('Download Complete', 'The FIR format has been downloaded and saved.');
    } catch (error) {
      console.error('Error downloading the PDF:', error);
      Alert.alert('Download Error', 'There was an issue downloading the FIR format.');
    } finally {
      setIsDownloading(false); // End the download process
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Official FIR Format</Text>
      <Text style={styles.description}>
        Below is the official FIR format. You can download it for your use.
      </Text>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={downloadPdf}
        disabled={isDownloading} // Disable button while downloading
      >
        <Text style={styles.downloadText}>
          {isDownloading ? 'Downloading...' : 'Download FIR Format'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OfficialFIRFormat;

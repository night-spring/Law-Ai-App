import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useNavigation } from '@react-navigation/native';

const FormToPDF = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    district: '',
    policeStation: '',
    year: '',
    firNo: '',
    date: '',
    act1: '',
    sections1: '',
    act2: '',
    sections2: '',
    act3: '',
    sections3: '',
    otherActs: '',
    offenceDay: '',
    offenceDate: '',
    offenceTime: '',
    infoReceivedDate: '',
    infoReceivedTime: '',
    generalDiaryRef: '',
    typeOfInfo: '',
    occurrenceDirection: '',
    beatNo: '',
    address: '',
    outsidePS: '',
    complainantName: '',
    fatherName: '',
    birthDate: '',
    nationality: '',
    passportNo: '',
    passportIssueDate: '',
    passportIssuePlace: '',
    occupation: '',
    complainantAddress: '',
    accusedDetails: '',
    delayReason: '',
    stolenProperties: '',
    stolenValue: '',
    inquestReportNo: '',
    actionTaken: '',
    officerName: '',
    officerRank: '',
    officerNo: '',
    signature: '',
    dispatchDate: '',
    dispatchTime: ''
  });

  // Handle field changes
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Generate PDF
  const generatePDF = async () => {
    const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2 { text-align: center; }
          p { margin: 5px 0; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>FORM – IF1 (Integrated Form)</h1>
        <h2>FIRST INFORMATION REPORT</h2>
        <p class="field"><span class="label">District:</span> ${formData.district}</p>
        <p class="field"><span class="label">Police Station:</span> ${formData.policeStation}</p>
        <p class="field"><span class="label">Year:</span> ${formData.year}</p>
        <p class="field"><span class="label">F.I.R. No:</span> ${formData.firNo}</p>
        <p class="field"><span class="label">Date:</span> ${formData.date}</p>
        <!-- Add other fields in the same format -->
      </body>
      </html>
    `;

    try {
      const options = {
        html: htmlContent,
        fileName: 'FIR_report',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      alert(`PDF saved at: ${file.filePath}`);
      navigation.navigate('ViewPDF', { filePath: file.filePath });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Generate FIR PDF</Text>

      <TextInput
        style={styles.input}
        placeholder="District"
        value={formData.district}
        onChangeText={(value) => handleChange('district', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Police Station"
        value={formData.policeStation}
        onChangeText={(value) => handleChange('policeStation', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Year"
        value={formData.year}
        onChangeText={(value) => handleChange('year', value)}
      />
      {/* Add other fields similarly */}

      <Button title="Generate PDF" onPress={generatePDF} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, paddingVertical: 5, fontSize: 16 }
});

export default FormToPDF;

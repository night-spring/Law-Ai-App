import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Landing = () => {
  const navigation = useNavigation();
  const [showButton, setShowButton] = useState(false);
  const scrollViewRef = useRef(null); // Use useRef here to reference ScrollView

  const handleDownload = () => {
    navigation.navigate('Download');
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 300); // Show the back-to-top button after scrolling 300px
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true }); // Use scrollViewRef correctly
  };

  const handleSmoothScroll = (target) => {
    scrollViewRef.current?.scrollTo({ y: target, animated: true }); // Use scrollViewRef correctly
  };

  return (
    <ScrollView
      style={styles.container}
      ref={scrollViewRef} // Assign scrollViewRef here
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={require('../images/indian-emblem.png')} style={styles.emblem} />
          <View>
            <Text style={styles.headerTitle}>LawAI Portal</Text>
            <Text style={styles.headerSubtitle}>Enforcing Law & Justice for Government of India</Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Text style={styles.buttonText}>Download Software</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.visitButton}
            onPress={() => Linking.openURL('https://india.gov.in')}
          >
            <Text style={styles.buttonText}>Visit India.gov.in</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Back to Top Button */}
      {showButton && (
        <TouchableOpacity style={styles.backToTop} onPress={scrollToTop}>
          <Text style={styles.backToTopText}>↑</Text>
        </TouchableOpacity>
      )}

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Empowering Law Enforcement with AI</Text>
        <Text style={styles.heroSubtitle}>
          Revolutionize law enforcement with AI-powered tools. Streamline FIR filing, access legal
          resources, and enhance operational efficiency with cutting-edge technology.
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Utilities')}>
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.learnMoreButton}
            onPress={() => handleSmoothScroll(600)}
          >
            <Text style={styles.ctaButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Section */}
      <View style={styles.imageSection}>
        <Image source={require('../images/Landing.jpg')} style={styles.landingImage} />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
            An initiative representing trust and authority abiding by the constitution.
          </Text>
        </View>
        <Text style={styles.imageDescription}>
          This initiative is designed to bring the power of technology to law enforcement agencies,
          providing them with the resources they need to uphold justice and maintain public trust.
        </Text>
      </View>

      {/* Vision Section */}
      <View style={styles.visionSection}>
        <Text style={styles.visionTitle}>Our Vision</Text>
        <Text style={styles.visionText}>
          At LawAI, we aim to bridge the gap between law enforcement and advanced technology,
          empowering officers with tools to uphold justice swiftly and accurately across the
          nation.
        </Text>
        <View style={styles.visionCards}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Innovative AI Tools</Text>
            <Text style={styles.cardText}>
              Leveraging the latest AI advancements to bring unmatched precision in legal processes.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Empowering Officers</Text>
            <Text style={styles.cardText}>
              Providing law enforcement with resources that make their work efficient and impactful.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nationwide Impact</Text>
            <Text style={styles.cardText}>
              Reaching every corner of the country to ensure justice is accessible to all.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#1E3A8A',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emblem: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#d1d5db',
  },
  headerButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  downloadButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  visitButton: {
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: 'bold',
  },
  hero: {
    padding: 24,
    backgroundColor: '#6366F1',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#e5e7eb',
    marginBottom: 24,
  },
  heroButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ctaButton: {
    backgroundColor: '#FBBF24',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  learnMoreButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: 'bold',
  },
  imageSection: {
    padding: 24,
  },
  landingImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  visionSection: {
    padding: 24,
    backgroundColor: '#f3f4f6',
  },
  visionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  visionText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  visionCards: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  card: {
    width: '30%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#4b5563',
  },
  backToTop: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToTopText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Landing;

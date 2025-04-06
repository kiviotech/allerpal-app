import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { downloadTemplate } from '../../../src/services/restaurantImportService';

/**
 * Template Download Component
 * Provides functionality to download the restaurant import template
 */
const TemplateDownload = ({ onDownloadComplete, onDownloadError }) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle template download
   */
  const handleDownload = async () => {
    setDownloading(true);
    setError(null);

    try {
      const result = await downloadTemplate();
      
      setDownloading(false);
      
      if (result.success) {
        if (Platform.OS === 'web') {
          Alert.alert(
            "Download Initiated",
            "Template download has started. Check your browser's download folder.",
            [{ text: "OK" }]
          );
        } else {
          Alert.alert(
            "Download Successful",
            `Template has been saved and shared with you.`,
            [{ text: "OK" }]
          );
        }
        
        if (onDownloadComplete) {
          onDownloadComplete(result);
        }
      }
    } catch (err) {
      setDownloading(false);
      const errorMessage = err.message || 'Error downloading template';
      setError(errorMessage);
      
      console.error('Template download error:', err);
      
      Alert.alert(
        "Download Failed",
        `Could not download template: ${errorMessage}. Please try again or contact support.`,
        [{ text: "OK" }]
      );
      
      if (onDownloadError) {
        onDownloadError(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="document-outline" size={24} color="#333" />
        <Text style={styles.title}>Import Template</Text>
      </View>
      
      <Text style={styles.description}>
        Download the Excel template for restaurant imports. The template includes
        sheets for restaurants, menus, menu items, and allergens.
      </Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={18} color="#ff3b30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={handleDownload}
        disabled={downloading}
      >
        {downloading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="download-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Download Template</Text>
          </>
        )}
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={18} color="#666" />
        <Text style={styles.infoText}>
          Please refer to the import guide for detailed instructions on filling out the template.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#FFF2F2',
    padding: 10,
    borderRadius: 6,
  },
  errorText: {
    color: '#ff3b30',
    marginLeft: 8,
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F8FF',
    padding: 10,
    borderRadius: 6,
  },
  infoText: {
    color: '#666',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});

export default TemplateDownload; 
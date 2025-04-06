import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert, 
  Linking 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

// Import components
import FileUploadForm from './components/FileUploadForm';
import TemplateDownload from './components/TemplateDownload';
import ImportStatusList from './components/ImportStatusList';

// Import Guide URL - change this to your actual guide URL
const IMPORT_GUIDE_URL = 'https://allerpal.com/restaurant-import-guide';

/**
 * RestaurantImport Screen
 * Main page for importing restaurants, menus, and menu items
 */
const RestaurantImport = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const params = useLocalSearchParams();

  // Handle page navigation
  const handleViewAllImports = () => {
    router.push('/ImportHistory');
  };

  // Handle upload completion event
  const handleUploadComplete = (result) => {
    setRefreshKey(Date.now()); // Refresh the list to show the new import
    
    // Extract result information
    const importedData = result?.data || {};
    const importMeta = result?.meta || {};
    
    // Check if the file is still processing
    if (importedData.status === "processing") {
      // Show a processing message
      Alert.alert(
        "Upload In Progress",
        `Your file "${importedData.file_name}" has been uploaded and is being processed in the background. Check the import history for results.`,
        [{ text: "OK" }]
      );
      return;
    }
    
    // For completed imports, display a more informative success message
    let successMessage = "Your restaurant data has been uploaded successfully and is being processed.";
    
    // Add details if available
    if (importedData.restaurants?.length > 0) {
      successMessage += `\n\n${importedData.restaurants.length} restaurants processed.`;
    } else if (importedData.restaurant) {
      successMessage += "\n\n1 restaurant processed.";
    }
    
    if (importedData.menuItems?.length > 0) {
      successMessage += `\n${importedData.menuItems.length} menu items processed.`;
    }
    
    // Add warnings if any
    if (importMeta.warnings && importMeta.warnings.length > 0) {
      successMessage += `\n\nWarnings: ${importMeta.warnings.length} issues found.`;
    }
    
    // Include processing time if available
    if (importedData.processingTimeMs) {
      const processingTime = (importedData.processingTimeMs / 1000).toFixed(2);
      successMessage += `\n\nProcessing time: ${processingTime} seconds.`;
    }
    
    Alert.alert(
      "Upload Successful",
      successMessage,
      [{ text: "OK" }]
    );
  };

  // Handle upload error event
  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    
    // Extract error details
    let errorMessage = "Failed to upload restaurant data.";
    
    if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Check for specific error types
    if (errorMessage.includes("ValidationError")) {
      errorMessage = "The data in your Excel file has validation errors. Please check the format and try again.";
    } else if (errorMessage.includes("No file")) {
      errorMessage = "No file was selected or the file was empty. Please select a valid Excel file.";
    }
    
    Alert.alert(
      "Upload Failed",
      errorMessage,
      [{ text: "OK" }]
    );
  };

  // Handle import details view
  const handleViewImportDetails = (importDetails) => {
    if (importDetails.action === 'viewAll') {
      handleViewAllImports();
      return;
    }
    
    // Navigate to details screen with import ID
    router.push({
      pathname: `/ImportDetails`,
      params: { id: importDetails.id }
    });
  };

  // Handle opening the import guide
  const handleOpenImportGuide = async () => {
    try {
      const supported = await Linking.canOpenURL(IMPORT_GUIDE_URL);
      
      if (supported) {
        await Linking.openURL(IMPORT_GUIDE_URL);
      } else {
        Alert.alert(
          "Cannot Open Link",
          "The import guide URL cannot be opened. Please contact support for assistance.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error opening import guide:', error);
      Alert.alert(
        "Error",
        "There was an error opening the import guide. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  // Check for auth on component mount
  useEffect(() => {
    // TODO: Add authentication check
    // If not authenticated, redirect to login
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant Import</Text>
      </View>
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Import Restaurants</Text>
          <Text style={styles.sectionDescription}>
            Upload Excel files to bulk import restaurants, menus, menu items, and allergen information.
            Make sure to follow the template format for a successful import.
          </Text>
        </View>
        
        <FileUploadForm 
          onUploadComplete={handleUploadComplete} 
          onUploadError={handleUploadError} 
        />
        
        <TemplateDownload />
        
        <ImportStatusList 
          key={`import-list-${refreshKey}`}
          limit={5}
          onViewDetails={handleViewImportDetails}
        />
        
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#007AFF" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Need Help?</Text>
              <Text style={styles.infoText}>
                For detailed instructions on how to format your import file, refer to the 
                import documentation. You can also download a sample file to get started.
              </Text>
              <TouchableOpacity 
                style={styles.infoButton}
                onPress={handleOpenImportGuide}
              >
                <Text style={styles.infoButtonText}>View Import Guide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  infoSection: {
    marginVertical: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  infoButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  infoButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default RestaurantImport; 
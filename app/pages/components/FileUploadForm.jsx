import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadImportFile, downloadTemplate, processUploadedFile } from '../../../src/services/restaurantImportService';
import { Ionicons } from '@expo/vector-icons';

/**
 * File Upload Form Component for restaurant import functionality
 * Allows users to select and upload Excel files
 */
const FileUploadForm = ({ onUploadComplete, onUploadError }) => {
  // File input reference (web only)
  const fileInputRef = useRef(null);

  // Local state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Handle file selection from web input
   */
  const handleWebFileSelect = (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      
      console.log('[FileUploadForm] Web file selected:', file.name);
      
      // Validate file type
      const validExcelTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/excel'
      ];
      
      if (!file.name.endsWith('.xlsx') && !validExcelTypes.includes(file.type)) {
        setError('Please select an Excel (.xlsx) file');
        console.error('[FileUploadForm] Invalid file type:', file.type);
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        console.error('[FileUploadForm] File too large:', file.size);
        return;
      }
      
      // Ensure the file name has proper extension
      let fileName = file.name;
      if (!fileName.endsWith('.xlsx')) {
        fileName = `${fileName}.xlsx`;
        console.log('[FileUploadForm] Adding .xlsx extension:', fileName);
      }
      
      // Create a proper file object with the correct name and type
      const validFile = new File(
        [file], 
        fileName, 
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );
      
      setSelectedFile(validFile);
      setError(null);
      console.log('[FileUploadForm] File validated and saved:', fileName);
    } catch (error) {
      console.error('[FileUploadForm] Error in web file selection:', error);
      setError('Error selecting file. Please try again.');
    }
  };

  /**
   * Handle file selection from native file picker
   */
  const handleNativeFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        copyToCacheDirectory: true,
      });
      
      console.log('[FileUploadForm] Document picker result:', result);
      
      if (result.canceled) {
        console.log('[FileUploadForm] Document picker canceled');
        return;
      }
      
      const file = result.assets[0];
      
      // Ensure the file has a proper name and extension
      let fileName = file.name;
      if (!fileName.endsWith('.xlsx')) {
        fileName = `${fileName}.xlsx`;
      }
      
      // Create a file object with all required properties
      const fileToUpload = {
        ...file,
        name: fileName,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
      
      setSelectedFile(fileToUpload);
      console.log('[FileUploadForm] Selected file:', fileToUpload);
    } catch (err) {
      console.error('[FileUploadForm] Error selecting file:', err);
      setError('Error selecting file. Please try again.');
    }
  };

  /**
   * Handle file selection
   */
  const selectFile = async () => {
    try {
      setError(null);
      
      if (Platform.OS === 'web') {
        // On web, use the file input
        fileInputRef.current.click();
      } else {
        // On native, use the document picker
        await handleNativeFileSelection();
      }
    } catch (err) {
      console.error('[FileUploadForm] Error selecting file:', err);
      setError('Error selecting file');
    }
  };

  /**
   * Handle file upload
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }
    
    setError(null);
    setUploading(true);
    setUploadProgress(0);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    
    if (Platform.OS === 'web') {
      formData.append('files', selectedFile);
    } else {
      formData.append('files', {
        uri: selectedFile.uri,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        name: selectedFile.name || 'import-file.xlsx'
      });
    }
    
    try {
      console.log('[FileUploadForm] Starting file upload');
      
      // First, upload file to Strapi media library
      const uploadResponse = await uploadImportFile(formData, (progress) => {
        setUploadProgress(progress);
      });
      
      console.log('[FileUploadForm] File upload successful:', uploadResponse);
      
      // Handle different response formats - could be array or object with data property
      let processResponse;
      
      if (Array.isArray(uploadResponse) && uploadResponse.length > 0) {
        // Original format: array of files
        const uploadedFile = uploadResponse[0];
        
        // Now process the uploaded file
        console.log('[FileUploadForm] Processing uploaded file:', uploadedFile.id);
        setUploadProgress(75); // Set progress to 75% while processing
        
        processResponse = await processUploadedFile(uploadedFile.id, uploadedFile.name);
      } else if (uploadResponse && uploadResponse.data) {
        // New format: already processed and in background processing
        console.log('[FileUploadForm] File already processing in background:', uploadResponse.data);
        processResponse = uploadResponse;
        setUploadProgress(90);
      } else {
        console.error('[FileUploadForm] Unexpected response format:', uploadResponse);
        throw new Error('Unexpected response format from server');
      }
      
      console.log('[FileUploadForm] Final response:', processResponse);
      
      // Always set to a complete state when we get a response
      setUploadProgress(100);
      
      // Reset form
      setSelectedFile(null);
      setUploading(false);
      
      // Clear file input on web
      if (Platform.OS === 'web' && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Call completion callback with the process response
      if (onUploadComplete) {
        onUploadComplete(processResponse);
      }
    } catch (err) {
      console.error('===== FILE UPLOAD ERROR =====');
      console.error('[FileUploadForm] Upload error:', err);
      
      // Log additional error details
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        
        // Handle specific Strapi upload errors
        if (err.response.status === 413) {
          setError('File is too large for the server to accept');
        } else if (err.response.data?.error?.name === 'ValidationError') {
          setError('Invalid file: ' + err.response.data.error.message);
        }
      }
      
      setUploading(false);
      const errorMessage = err.message || 'Error uploading file';
      if (!error) { // Only set if not already set by specific error handling above
        setError(errorMessage);
      }
      
      // Show detailed error alert
      const detailedError = err.response?.data?.error?.message || err.message || 'Unknown error occurred';
      Alert.alert(
        "Upload Failed",
        `Could not upload file: ${detailedError}. Please check the console for more details.`,
        [{ text: "OK" }]
      );
      
      // Call error callback if provided
      if (onUploadError) {
        onUploadError(err);
      }
    }
  };

  /**
   * Handle template download
   */
  const handleTemplateDownload = async () => {
    try {
      console.log('[FileUploadForm] Downloading template...');
      await downloadTemplate();
      console.log('[FileUploadForm] Template download initiated');
    } catch (err) {
      console.error('[FileUploadForm] Template download error:', err);
      Alert.alert(
        "Download Failed",
        "Could not download the template. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  // Render progress indicator
  const renderProgress = () => {
    if (!uploading) return null;
    
    // Determine progress status text
    let statusText = 'Uploading file...';
    if (uploadProgress >= 75 && uploadProgress < 100) {
      statusText = 'Processing data...';
    } else if (uploadProgress === 100) {
      statusText = 'Completing...';
    }
    
    return (
      <View style={styles.progressContainer}>
        <ActivityIndicator size="small" color="#007AFF" style={styles.progressIndicator} />
        <Text style={styles.progressText}>{statusText} ({Math.round(uploadProgress)}%)</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Restaurant Import File</Text>
      <Text style={styles.subtitle}>
        Upload an Excel file containing restaurant data, menus, and menu items.
      </Text>
      
      {/* Hidden file input for web */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          style={{ display: 'none' }}
          onChange={handleWebFileSelect}
        />
      )}
      
      <TouchableOpacity 
        style={styles.uploadBox} 
        onPress={selectFile}
        disabled={uploading}
      >
        <Ionicons name="cloud-upload-outline" size={48} color="#6A6A6A" />
        <Text style={styles.uploadText}>
          {selectedFile 
            ? (Platform.OS === 'web' ? selectedFile.name : selectedFile.name) 
            : 'Click to select Excel file (.xlsx)'}
        </Text>
        <Text style={styles.uploadHint}>
          Maximum file size: 10MB
        </Text>
      </TouchableOpacity>
      
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={18} color="#ff3b30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {renderProgress()}
      
      <TouchableOpacity 
        style={[
          styles.button, 
          !selectedFile || uploading ? styles.buttonDisabled : null
        ]} 
        onPress={handleUpload}
        disabled={!selectedFile || uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.helperText}>
        Need a template? <Text 
          style={styles.linkText}
          onPress={handleTemplateDownload}
        >
          Download the template
        </Text>
      </Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  uploadText: {
    color: '#333',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  uploadHint: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
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
  progressContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 10,
    borderRadius: 6,
  },
  progressText: {
    marginLeft: 10,
    color: '#007AFF',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default FileUploadForm; 
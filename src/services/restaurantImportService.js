import {
  uploadImportFile as uploadImportFileRepo,
  importJsonData as importJsonDataRepo,
  downloadTemplate as downloadTemplateRepo,
  listImports as listImportsRepo,
  getImportById as getImportByIdRepo,
  validateImport as validateImportRepo,
  processUploadedFile as processUploadedFileRepo
} from '../api/repositories/restaurantImportRepositories';
import * as FileSystem from 'expo-file-system';
import { Share, Platform } from 'react-native';
import apiClient from '../api/apiClient';
import restaurantImportEndpoints from '../api/endpoints/restaurantImportEndpoints';

/**
 * Upload a restaurant import file
 * @param {FormData} formData - The form data containing the file
 * @param {Function} onProgress - Callback for upload progress
 * @returns {Promise} - Result of the upload operation
 */
export const uploadImportFile = async (formData, onProgress) => {
  try {
    console.log('[RestaurantImportService] Starting upload process');
    
    // Extract file from formData
    let fileObject = null;
    let fileName = '';
    
    // Try to get the file from the FormData
    for (let [key, value] of formData.entries()) {
      if (key === 'files') {
        fileObject = value;
        // Get filename based on platform
        if (Platform.OS === 'web') {
          fileName = value.name;
        } else {
          fileName = value.name || 'import-file.xlsx';
        }
        break;
      }
    }
    
    if (!fileObject) {
      throw new Error('No file found in form data');
    }
    
    console.log(`[RestaurantImportService] Uploading file: ${fileName}`);
    
    // First, upload the file to Strapi's media library
    const uploadFormData = new FormData();
    
    // Different handling based on platform
    if (Platform.OS === 'web') {
      // Web platform: Append the file directly
      uploadFormData.append('files', fileObject);
    } else {
      // Native platform: Create a file-like object
      uploadFormData.append('files', {
        uri: fileObject.uri,
        name: fileName,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    }
    
    // Upload to Strapi's general upload endpoint
    console.log('[RestaurantImportService] Sending file to media library...');
    const uploadResponse = await apiClient.post('/upload', uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data) => data],
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`[RestaurantImportService] Upload progress: ${percentCompleted}%`);
        if (onProgress) {
          onProgress(percentCompleted * 0.7); // Use 70% of the progress for file upload
        }
      },
    });

    console.log('[RestaurantImportService] Upload response:', uploadResponse.data);
    
    if (!uploadResponse.data) {
      throw new Error('No data in upload response');
    }
    
    // Check if the response is already in the new format (direct processing response)
    if (uploadResponse.data.data && uploadResponse.data.data.import_id) {
      console.log('[RestaurantImportService] Received direct processing response:', uploadResponse.data);
      return uploadResponse.data;
    }
    
    // Return the uploaded file details
    return uploadResponse.data;
  } catch (error) {
    console.error('[RestaurantImportService] Error uploading file:', error);
    throw error;
  }
};

/**
 * Import restaurant data from JSON
 * @param {Object} data - The JSON data to import
 * @param {Object} options - Import options
 * @returns {Promise} - Result of the import operation
 */
export const importJsonData = async (data, options = {}) => {
  try {
    console.log('[RestaurantImportService] Importing JSON data...');
    const response = await importJsonDataRepo(data, options);
    console.log('[RestaurantImportService] JSON import successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('[RestaurantImportService] Error importing JSON data:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to import data');
  }
};

/**
 * Download the restaurant import template
 * @returns {Promise} - Result with file URI and success status
 */
export const downloadTemplate = async () => {
  try {
    console.log('[RestaurantImportService] Downloading template...');
    const response = await downloadTemplateRepo();
    const fileName = 'restaurant-import-template.xlsx';
    
    // Web platform implementation
    if (Platform.OS === 'web') {
      console.log('[RestaurantImportService] Using web download method');
      
      // The response.data should already be a Blob since we specified responseType: 'blob'
      const blob = response.data;
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      console.log('[RestaurantImportService] Web download initiated');
      return {
        success: true,
        fileName,
      };
    } 
    // Native platform implementation (iOS, Android)
    else {
      console.log('[RestaurantImportService] Using native download method');
      
      try {
        // Convert the ArrayBuffer from the response to a base64 string
        // First, create a temporary directory for our file
        const tempDir = FileSystem.cacheDirectory + 'downloads/';
        const tempFileUri = tempDir + fileName;
        
        // Ensure directory exists
        const dirInfo = await FileSystem.getInfoAsync(tempDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
        }
        
        // Download the file directly to the temporary location
        const downloadResult = await FileSystem.downloadAsync(
          response.config.url,
          tempFileUri,
          {
            headers: response.config.headers,
          }
        );
        
        console.log('[RestaurantImportService] File downloaded to:', downloadResult.uri);
        
        // Share the file
        await Share.share({
          url: downloadResult.uri,
          title: 'Restaurant Import Template',
          message: 'Here is the restaurant import template'
        });
        
        return {
          success: true,
          fileUri: downloadResult.uri,
          fileName,
        };
      } catch (nativeError) {
        console.error('[RestaurantImportService] Native download error:', nativeError);
        throw new Error('Native download failed: ' + nativeError.message);
      }
    }
  } catch (error) {
    console.error('[RestaurantImportService] Error downloading template:', error);
    throw new Error(error.message || 'Failed to download template');
  }
};

/**
 * List import history with pagination
 * @param {Number} page - Page number
 * @param {Number} pageSize - Number of results per page
 * @returns {Promise} - Import records with pagination info
 */
export const listImports = async (page = 1, pageSize = 10) => {
  try {
    console.log(`[RestaurantImportService] Listing imports (page ${page}, pageSize ${pageSize})...`);
    const response = await listImportsRepo(page, pageSize);
    console.log('[RestaurantImportService] List imports successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('[RestaurantImportService] Error listing imports:', error);
    throw new Error('Failed to list imports');
  }
};

/**
 * Get details of a specific import
 * @param {String} id - Import ID
 * @returns {Promise} - Import details
 */
export const getImportById = async (id) => {
  try {
    console.log(`[RestaurantImportService] Getting import details for ID: ${id}`);
    const response = await getImportByIdRepo(id);
    console.log('[RestaurantImportService] Get import details successful:', response.data);
    return response.data;
  } catch (error) {
    console.error(`[RestaurantImportService] Error getting import with ID ${id}:`, error);
    throw new Error('Failed to get import details');
  }
};

/**
 * Validate an import file without processing it
 * @param {FormData} formData - The form data containing the file
 * @returns {Promise} - Validation results
 */
export const validateImport = async (formData) => {
  try {
    console.log('[RestaurantImportService] Validating import file...');
    const response = await validateImportRepo(formData);
    console.log('[RestaurantImportService] Validation successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('[RestaurantImportService] Error validating import:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to validate import');
  }
};

/**
 * Process a file that has already been uploaded to Strapi's media library
 * @param {number} fileId - ID of the uploaded file in Strapi media library
 * @param {string} fileName - Name of the file
 * @returns {Promise} - Result of the processing operation
 */
export const processUploadedFile = async (fileId, fileName) => {
  try {
    console.log(`[RestaurantImportService] Processing uploaded file ID: ${fileId}, name: ${fileName}`);
    
    // Create the request data
    const processData = {
      fileId: fileId,
      file_name: fileName
    };
    
    // Log the request payload for debugging
    console.log('[RestaurantImportService] Sending process request with data:', JSON.stringify(processData));
    
    const response = await processUploadedFileRepo(fileId, fileName);
    console.log('[RestaurantImportService] File processing response:', response.data);
    
    // Return the processed data
    return response.data;
  } catch (error) {
    console.error('[RestaurantImportService] Error processing uploaded file:', error);
    
    // Provide more detailed error information
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw new Error(error.response?.data?.error?.message || error.message || 'Failed to process file');
  }
}; 
import apiClient from "../apiClient";
import restaurantImportEndpoints from "../endpoints/restaurantImportEndpoints";

/**
 * Upload an Excel file containing restaurant import data
 * @param {FormData} formData - FormData object containing the file
 * @param {Function} onUploadProgress - Progress callback function
 * @returns {Promise} - API response
 */
export const uploadImportFile = async (formData, onUploadProgress) => {
  // Log FormData details for debugging
  console.log('======== UPLOAD IMPORT FILE - DEBUG LOGS ========');
  console.log('uploadImportFile: Starting upload process');
  
  try {
    // Check if we're on web and log form data contents for debugging
    if (typeof window !== 'undefined' && typeof FormData !== 'undefined') {
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File || value instanceof Blob) {
          console.log(`Field: ${key}, Filename: ${value.name}, Type: ${value.type}, Size: ${value.size} bytes`);
        } else if (typeof value === 'object') {
          console.log(`Field: ${key}, Value:`, value);
          // Try to extract more information about the object
          try {
            if (value.uri) console.log(`  - URI: ${value.uri}`);
            if (value.name) console.log(`  - Name: ${value.name}`);
            if (value.type) console.log(`  - Type: ${value.type}`);
            if (value.size) console.log(`  - Size: ${value.size} bytes`);
          } catch (e) {
            console.log('  - Cannot extract detailed object properties');
          }
        } else {
          console.log(`Field: ${key}, Value: ${value}`);
        }
      }
    }
    
    // Log endpoint details
    console.log(`Sending request to endpoint: ${restaurantImportEndpoints.uploadImportFile}`);
    
    // Prepare request config with detailed logging
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      transformRequest: [function (data) {
        console.log('transformRequest called with data type:', typeof data);
        return data;
      }],
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
        if (onUploadProgress) {
          onUploadProgress(percentCompleted);
        }
      },
    };
    
    console.log('Request headers:', config.headers);
    
    // Make the API request with try-catch for more detailed error logging
    try {
      console.log('Sending API request...');
      const response = await apiClient.post(restaurantImportEndpoints.uploadImportFile, formData, config);
      console.log('API request successful!');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);
      return response;
    } catch (apiError) {
      console.error('===== API REQUEST ERROR =====');
      console.error('Error details:', apiError);
      
      if (apiError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response status:', apiError.response.status);
        console.error('Response headers:', apiError.response.headers);
        console.error('Response data:', apiError.response.data);
        console.error('Response config URL:', apiError.response.config?.url);
        
        // Check if there's a specific error message in the response
        if (apiError.response.data?.error?.message) {
          console.error('Server error message:', apiError.response.data.error.message);
        } else if (apiError.response.data?.message) {
          console.error('Server error message:', apiError.response.data.message);
        }
      } else if (apiError.request) {
        // The request was made but no response was received
        console.error('No response received from server');
        console.error('Request details:', apiError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', apiError.message);
      }
      
      // Rethrow with more context
      throw apiError;
    }
  } catch (error) {
    console.error('======== UPLOAD IMPORT FILE - ERROR ========');
    console.error('Error during upload process:', error);
    throw error;
  } finally {
    console.log('======== UPLOAD IMPORT FILE - END ========');
  }
};

/**
 * Import restaurant data from JSON
 * @param {Object} data - JSON data to import
 * @param {Object} options - Import options
 * @returns {Promise} - API response
 */
export const importJsonData = (data, options = {}) => {
  return apiClient.post(restaurantImportEndpoints.importJsonData, {
    data,
    options,
  });
};

/**
 * Download the restaurant import template
 * @returns {Promise} - API response with blob data
 */
export const downloadTemplate = () => {
  return apiClient.get(restaurantImportEndpoints.downloadTemplate, {
    responseType: 'blob',
  });
};

/**
 * List import history with pagination
 * @param {Number} page - Page number
 * @param {Number} pageSize - Results per page
 * @returns {Promise} - API response with import records
 */
export const listImports = (page = 1, pageSize = 10) => {
  return apiClient.get(restaurantImportEndpoints.listImports(page, pageSize));
};

/**
 * Get details of a specific import
 * @param {String} id - Import ID
 * @returns {Promise} - API response with import details
 */
export const getImportById = (id) => {
  return apiClient.get(restaurantImportEndpoints.getImportById(id));
};

/**
 * Validate an import file without processing it
 * @param {FormData} formData - FormData object containing the file
 * @returns {Promise} - API response with validation results
 */
export const validateImport = (formData) => {
  return apiClient.post(restaurantImportEndpoints.validateImport, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Process a file that has already been uploaded to the Strapi media library
 * @param {number} fileId - ID of the file in the media library
 * @param {string} fileName - Name of the file
 * @returns {Promise} - API response with processing results
 */
export const processUploadedFile = (fileId, fileName) => {
  return apiClient.post(restaurantImportEndpoints.processUploadedFile, {
    fileId,
    file_name: fileName
  });
}; 
import axios from "axios";
import { getToken } from "../utils/storage";

export const BASE_URL = "http://localhost:1402/api";
export const MEDIA_BASE_URL = "http://localhost:1402";

// export const BASE_URL = "https://api.allerpal.com/api";
// export const MEDIA_BASE_URL = "https://api.allerpal.com";

console.log("[apiClient] Initializing with BASE_URL:", BASE_URL);

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    try {
      console.log(`[apiClient] Making ${config.method.toUpperCase()} request to: ${config.url}`);
      console.log(`[apiClient] Request headers:`, config.headers);
      
      // Special handling for FormData/multipart requests
      if (config.data instanceof FormData) {
        console.log('[apiClient] Request contains FormData');
        
        // Log FormData contents for debugging
        try {
          console.log('[apiClient] FormData entries:');
          for (let [key, value] of config.data.entries()) {
            if (value instanceof File || value instanceof Blob) {
              console.log(`[apiClient] Field: ${key}, Filename: ${value.name}, Type: ${value.type}, Size: ${value.size} bytes`);
            } else if (typeof value === 'object') {
              console.log(`[apiClient] Field: ${key}, Object:`, value);
            } else {
              console.log(`[apiClient] Field: ${key}, Value: ${value}`);
            }
          }
          
          // Force correct content type for multipart/form-data
          config.headers['Content-Type'] = 'multipart/form-data';
          
          // Ensure axios doesn't try to transform the FormData
          config.transformRequest = [(data) => data];
          
        } catch (formDataError) {
          console.warn('[apiClient] Error logging FormData:', formDataError);
        }
      } else if (config.data) {
        // For regular JSON data, log the payload
        try {
          console.log('[apiClient] Request payload:', 
            typeof config.data === 'object' ? JSON.stringify(config.data) : config.data);
        } catch (e) {
          console.log('[apiClient] Request payload: [Cannot stringify payload]');
        }
      }
      
      const token = await getToken(); // Ensure the function call is correct
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("[apiClient] Token set in headers");
      } else {
        console.warn("[apiClient] No token available for request");
      }
    } catch (error) {
      console.error("[apiClient] Error in request interceptor:", error); // Log any error in fetching the token
    }

    return config;
  },
  (error) => {
    console.error("[apiClient] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[apiClient] Response from ${response.config.url} - Status: ${response.status}`);
    
    // Add more details for file upload endpoints
    if (response.config.url.includes('upload') || response.config.url.includes('import')) {
      console.log(`[apiClient] Upload/Import successful - Response data:`, response.data);
    }
    
    return response;
  },
  (error) => {
    console.error("======= API CLIENT ERROR =======");
    console.error(`[apiClient] Response error: ${error.message}`);
    
    if (error.response) {
      console.error(`[apiClient] Status: ${error.response.status}`);
      console.error(`[apiClient] Status text: ${error.response.statusText}`);
      console.error(`[apiClient] URL: ${error.response.config?.url}`);
      console.error(`[apiClient] Method: ${error.response.config?.method?.toUpperCase()}`);
      
      // Log headers
      console.error(`[apiClient] Response headers:`, error.response.headers);
      
      // Detailed error data
      console.error(`[apiClient] Error data:`, error.response.data);
      
      // Special handling for 400 errors
      if (error.response.status === 400) {
        console.error(`[apiClient] 400 Bad Request Details:`);
        
        if (error.response.data?.error?.details) {
          console.error(`[apiClient] Error details:`, error.response.data.error.details);
        }
        
        if (error.response.data?.error?.message) {
          console.error(`[apiClient] Error message: ${error.response.data.error.message}`);
        }
        
        // For Strapi validation errors
        if (error.response.data?.error?.name === 'ValidationError') {
          console.error(`[apiClient] Validation errors:`, error.response.data.error.details);
        }
      }
    } else if (error.request) {
      console.error(`[apiClient] No response received from server`);
      console.error(`[apiClient] Request details:`, error.request);
    }
    
    console.error("======= END API CLIENT ERROR =======");
    return Promise.reject(error);
  }
);

export default apiClient;

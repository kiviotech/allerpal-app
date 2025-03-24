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
      
      const token = await getToken(); // Ensure the function call is correct
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("[apiClient] Token set in headers");
      } else {
        console.warn("[apiClient] No token available for request");
      }
    } catch (error) {
      console.error("[apiClient] Error fetching token:", error); // Log any error in fetching the token
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
    return response;
  },
  (error) => {
    console.error("[apiClient] Response error:", error.message);
    if (error.response) {
      console.error(`[apiClient] Status: ${error.response.status}, Data:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

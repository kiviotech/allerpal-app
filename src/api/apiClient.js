import axios from "axios";
import { getToken } from "../utils/storage"

export const BASE_URL = "http://localhost:1337/api";
export const MEDIA_BASE_URL = "http://localhost:1337";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken(); // Retrieve the token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

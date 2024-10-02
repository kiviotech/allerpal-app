import axios from 'axios';
import { getToken } from '../utils/storage';

export const BASE_URL = 'http://localhost:1337/api';
export const MEDIA_BASE_URL = 'http://localhost:1337';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    const token = "5a3a52642c057b0781fb7eb3102b1d3e27d3da31b7e81307bd033708b53e8317f5ef02dd71af1fd1efdc2880518a3d2866d1707e36072cc6e7be89eb464e919b97f13590228a7c1b125400ff8616915c25f477cc7fd33c1c80630d708f5769cec29cc67e4d442d38ee9f4c09938503d8aa4ed45fb918d8e56216c5474ed85227"; // Call the function to get the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default apiClient;
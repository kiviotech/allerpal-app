import axios from 'axios';
import { getToken } from '../utils/storage';

export const BASE_URL = 'http://localhost:1337/api';
export const MEDIA_BASE_URL = 'http://localhost:1337';

// export const BASE_URL = 'https://api.allerpal.com/api';
// export const MEDIA_BASE_URL = 'https://api.allerpal.com/uploads';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    const token =
      "e2f511edf40c318a5e20d08ce125ea797eaa0ad3060b165cb6b4132c5e68ac3d1d8de2eb0935123a5b554972506295f02d4486d7168f2868d4218e601895c36e248bf4807bcf00c7f540c5658a6f0abb5dd910fdf26e941d60f3603433fee8b9cd226a5ff2d3c25451c132a57f6ccb7f60fbb0d609842041a9009d31075db089"; // Call the function to get the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default apiClient;
import axios from 'axios';
import { getToken } from '../utils/storage';

// export const BASE_URL = 'http://localhost:1337/api';
// export const MEDIA_BASE_URL = 'http://localhost:1337';

export const BASE_URL = 'https://api.allerpal.com/api';
export const MEDIA_BASE_URL = 'https://api.allerpal.com/uploads';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    const token = "98da4f877426b04f7fdce7a239431b9d6d72eaa08aa6aa89bff6d56ee28f8eb8ae083a04ea4f8d6ff41d0f53a2baed4d0aa4e5cf4b2f03d4d4097642f38e973b61ed4087eb177ff95a24a1955a17cb10889979d20b97389334eefdb95e4604462b0b185831bdd142410f52b4ef561d08439e6fc519ba50eb64b08df45a54b8fc"; // Call the function to get the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default apiClient;
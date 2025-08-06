import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth.ts';

const API_URL = 'https://connectx-backend-1ybq.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // No refresh token available, clear tokens and reject
          clearTokens();
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });
        
        // If token refresh was successful
        if (response.data.data.accessToken) {
          // Save the new tokens
          setTokens(response.data.data.accessToken, refreshToken);
          
          // Update the failed request with the new token and retry
          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid, clear tokens
        clearTokens();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
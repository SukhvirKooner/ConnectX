import api from './api';
import { setTokens, clearTokens } from './auth';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  title?: string;
  company?: string;
  location?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RefreshTokenData {
  refreshToken: string;
}

interface AuthResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

const authService = {
  // Register a new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', data);
    const { accessToken, refreshToken, user } = response.data.data;
    
    // Save tokens
    setTokens(accessToken, refreshToken);
    
    // Save user data
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data.data;
  },
  
  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data);
    const { accessToken, refreshToken, user } = response.data.data;
    
    // Save tokens
    setTokens(accessToken, refreshToken);
    
    // Save user data
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data.data;
  },
  
  // Refresh token
  refreshToken: async (data: RefreshTokenData): Promise<{ accessToken: string }> => {
    const response = await api.post('/api/auth/refresh', data);
    return response.data.data;
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user data regardless of API response
      clearTokens();
    }
  },
  
  // Get current user
  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/api/auth/me');
    return response.data.data;
  },
};

export default authService;
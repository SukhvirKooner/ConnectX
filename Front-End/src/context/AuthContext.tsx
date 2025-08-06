import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '@/services';
import { getAccessToken } from '@/services/auth';

interface User {
  _id: string;
  email: string;
  name: string;
  title?: string;
  company?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  profile_completed: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, title?: string, company?: string, location?: string) => Promise<boolean>;
  logout: () => void;
  completeProfile: (profileData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Check if we have a token
        const token = getAccessToken();
        if (token) {
          // Get current user from API
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        // Clear any invalid session data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      // Set the user data but check if profile is completed
      setUser(response.user);
      setIsAuthenticated(true);
      // Return true regardless of profile completion status
      // This prevents automatic redirection to profile page
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    title?: string, 
    company?: string, 
    location?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.register({ 
        email, 
        password, 
        name,
        title,
        company,
        location
      });
      setUser(response.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      if (user) {
        // First update the user profile
        await userService.updateProfile(user._id, profileData);
        
        // Then mark the profile as completed
        const updatedUser = await userService.completeProfile();
        
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to complete profile:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      completeProfile,
      isAuthenticated,
      loading
    }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
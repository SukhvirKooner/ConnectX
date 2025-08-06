import api from './api';

interface UpdateProfileData {
  name?: string;
  title?: string;
  company?: string;
  location?: string;
  bio?: string;
}

interface SearchParams {
  page?: number;
  limit?: number;
  query?: string;
}

const userService = {
  // Get user profile by ID
  getUserProfile: async (userId: string): Promise<any> => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data.data;
  },
  
  // Update user profile
  updateProfile: async (userId: string, data: UpdateProfileData): Promise<any> => {
    const response = await api.put(`/api/users/${userId}`, data);
    return response.data.data;
  },
  
  // Complete profile
  completeProfile: async (): Promise<any> => {
    const response = await api.post('/api/users/complete-profile');
    return response.data.data;
  },
  
  // Upload avatar
  uploadAvatar: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/api/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },
  
  // Search users
  searchUsers: async (params: SearchParams = {}): Promise<any> => {
    const { page = 1, limit = 10, query = '' } = params;
    const response = await api.get('/api/users/search', {
      params: { page, limit, query },
    });
    
    return response.data.data;
  },
};

export default userService;
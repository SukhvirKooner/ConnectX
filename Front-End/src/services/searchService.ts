import api from './api';

interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}

const searchService = {
  // Search users
  searchUsers: async (params: SearchParams = {}): Promise<any> => {
    const response = await api.get('/api/search/users', { params });
    return response.data.data;
  },
  
  // Search posts
  searchPosts: async (params: SearchParams = {}): Promise<any> => {
    const response = await api.get('/api/search/posts', { params });
    return response.data.data;
  },
  
  // Search jobs
  searchJobs: async (params: SearchParams = {}): Promise<any> => {
    const response = await api.get('/api/search/jobs', { params });
    return response.data.data;
  },
  
  // Get trending content
  getTrending: async (): Promise<any> => {
    const response = await api.get('/api/search/trending');
    return response.data.data;
  },
};

export default searchService;
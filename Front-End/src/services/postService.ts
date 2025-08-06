import api from './api';

interface PostParams {
  page?: number;
  limit?: number;
}

interface CreatePostData {
  content: string;
  image?: File;
}

interface UpdatePostData {
  content?: string;
  image?: File;
}

interface CommentData {
  content: string;
}

interface SharePostData {
  content?: string;
}

const postService = {
  // Get posts with pagination
  getPosts: async (params: PostParams = {}): Promise<any> => {
    const response = await api.get('/api/posts', { params });
    return response.data.data;
  },
  
  // Get posts by user ID
  getPostsByUserId: async (userId: string, params: PostParams = {}): Promise<any> => {
    const response = await api.get(`/api/posts/user/${userId}`, { params });
    return response.data.data;
  },
  
  // Create a new post
  createPost: async (data: CreatePostData): Promise<any> => {
    const formData = new FormData();
    formData.append('content', data.content);
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    const response = await api.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },
  
  // Get post by ID
  getPostById: async (postId: string): Promise<any> => {
    const response = await api.get(`/api/posts/${postId}`);
    return response.data.data;
  },
  
  // Update post
  updatePost: async (postId: string, data: UpdatePostData): Promise<any> => {
    const formData = new FormData();
    
    if (data.content) {
      formData.append('content', data.content);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    const response = await api.put(`/api/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },
  
  // Delete post
  deletePost: async (postId: string): Promise<any> => {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data.data;
  },
  
  // Toggle like on post
  toggleLike: async (postId: string): Promise<any> => {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data.data;
  },
  
  // Get post likes
  getPostLikes: async (postId: string, params: PostParams = {}): Promise<any> => {
    const response = await api.get(`/api/posts/${postId}/likes`, { params });
    return response.data.data;
  },
  
  // Add comment to post
  addComment: async (postId: string, data: CommentData): Promise<any> => {
    const response = await api.post(`/api/posts/${postId}/comments`, data);
    return response.data.data;
  },
  
  // Get post comments
  getPostComments: async (postId: string, params: PostParams = {}): Promise<any> => {
    const response = await api.get(`/api/posts/${postId}/comments`, { params });
    return response.data.data;
  },
  
  // Share post
  sharePost: async (postId: string, data: SharePostData = {}): Promise<any> => {
    const response = await api.post(`/api/posts/${postId}/share`, data);
    return response.data.data;
  },
};

export default postService;
import api from './api';

interface SkillSearchParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface UserSkillParams {
  page?: number;
  limit?: number;
}

const skillService = {
  // Get all skills with optional filtering
  getAllSkills: async (params: SkillSearchParams = {}): Promise<any> => {
    const response = await api.get('/api/skills', { params });
    return response.data.data;
  },
  
  // Get skill by ID
  getSkillById: async (skillId: string): Promise<any> => {
    const response = await api.get(`/api/skills/${skillId}`);
    return response.data.data;
  },
  
  // Add skill to user profile
  addSkillToProfile: async (skillId: string): Promise<any> => {
    const response = await api.post('/api/skills/user', { skill_id: skillId });
    return response.data.data;
  },
  
  // Remove skill from user profile
  removeSkillFromProfile: async (userSkillId: string): Promise<any> => {
    const response = await api.delete(`/api/skills/user/${userSkillId}`);
    return response.data.data;
  },
  
  // Get user skills
  getUserSkills: async (userId: string, params: UserSkillParams = {}): Promise<any> => {
    const response = await api.get(`/api/skills/user/${userId}`, { params });
    return response.data.data;
  },
  
  // Endorse a user skill
  endorseSkill: async (userSkillId: string): Promise<any> => {
    const response = await api.post(`/api/skills/endorse/${userSkillId}`);
    return response.data.data;
  },
  
  // Get skill endorsements
  getSkillEndorsements: async (userSkillId: string, params: UserSkillParams = {}): Promise<any> => {
    const response = await api.get(`/api/skills/endorsements/${userSkillId}`, { params });
    return response.data.data;
  },
};

export default skillService;
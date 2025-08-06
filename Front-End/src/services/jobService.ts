import api from './api';

interface JobParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  company?: string;
  type?: string;
  experience_level?: string;
  sort?: string;
}

interface CreateJobData {
  title: string;
  company?: string;
  location?: string;
  description: string;
  requirements?: string;
  type?: string;
  experience_level?: string;
  salary_range?: string;
  application_deadline?: Date;
  contact_email?: string;
}

interface UpdateJobData {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  requirements?: string;
  type?: string;
  experience_level?: string;
  salary_range?: string;
  application_deadline?: Date;
  contact_email?: string;
}

interface JobApplicationData {
  cover_letter?: string;
  resume?: File;
}

const jobService = {
  // Get all jobs with pagination and filtering
  getJobs: async (params: JobParams = {}): Promise<any> => {
    const response = await api.get('/api/jobs', { params });
    return response.data.data;
  },
  
  // Create a new job posting
  createJob: async (data: CreateJobData): Promise<any> => {
    const response = await api.post('/api/jobs', data);
    return response.data.data;
  },
  
  // Get job by ID
  getJobById: async (jobId: string): Promise<any> => {
    const response = await api.get(`/api/jobs/${jobId}`);
    return response.data.data;
  },
  
  // Update job posting
  updateJob: async (jobId: string, data: UpdateJobData): Promise<any> => {
    const response = await api.put(`/api/jobs/${jobId}`, data);
    return response.data.data;
  },
  
  // Delete job posting
  deleteJob: async (jobId: string): Promise<any> => {
    const response = await api.delete(`/api/jobs/${jobId}`);
    return response.data.data;
  },
  
  // Apply for a job
  applyForJob: async (jobId: string, data: JobApplicationData): Promise<any> => {
    const formData = new FormData();
    
    if (data.cover_letter) {
      formData.append('cover_letter', data.cover_letter);
    }
    
    if (data.resume) {
      formData.append('resume', data.resume);
    }
    
    const response = await api.post(`/api/jobs/${jobId}/apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },
  
  // List user's job applications
  listMyApplications: async (params: JobParams = {}): Promise<any> => {
    const response = await api.get('/api/jobs/applications', { params });
    return response.data.data;
  },
  
  // List user's job postings
  listMyJobPostings: async (params: JobParams = {}): Promise<any> => {
    const response = await api.get('/api/jobs/my-postings', { params });
    return response.data.data;
  },
  
  // Toggle save job
  toggleSaveJob: async (jobId: string): Promise<any> => {
    const response = await api.post(`/api/jobs/${jobId}/save`);
    return response.data.data;
  },
  
  // Get saved jobs
  getSavedJobs: async (params: JobParams = {}): Promise<any> => {
    const response = await api.get('/api/jobs/saved', { params });
    return response.data.data;
  },
};

export default jobService;
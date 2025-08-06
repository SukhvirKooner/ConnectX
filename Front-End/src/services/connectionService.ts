import api from './api';

interface ConnectionParams {
  page?: number;
  limit?: number;
}

interface ConnectionRequestData {
  addressee_id: string;
  message?: string;
}

const connectionService = {
  // Get all connections
  getConnections: async (params: ConnectionParams = {}): Promise<any> => {
    const response = await api.get('/api/connections', { params });
    return response.data.data;
  },
  
  // Send connection request
  sendConnectionRequest: async (data: ConnectionRequestData): Promise<any> => {
    const response = await api.post('/api/connections/request', data);
    return response.data.data;
  },
  
  // Accept connection request
  acceptConnectionRequest: async (connectionId: string): Promise<any> => {
    const response = await api.put(`/api/connections/${connectionId}/accept`);
    return response.data.data;
  },
  
  // Decline connection request
  declineConnectionRequest: async (connectionId: string): Promise<any> => {
    const response = await api.put(`/api/connections/${connectionId}/decline`);
    return response.data.data;
  },
  
  // Remove connection
  removeConnection: async (connectionId: string): Promise<any> => {
    const response = await api.delete(`/api/connections/${connectionId}`);
    return response.data.data;
  },
  
  // Get sent connection requests
  getSentRequests: async (params: ConnectionParams = {}): Promise<any> => {
    const response = await api.get('/api/connections/requests/sent', { params });
    return response.data.data;
  },
  
  // Get received connection requests
  getReceivedRequests: async (params: ConnectionParams = {}): Promise<any> => {
    const response = await api.get('/api/connections/requests/received', { params });
    return response.data.data;
  },
  
  // Get connection suggestions
  getConnectionSuggestions: async (params: ConnectionParams = {}): Promise<any> => {
    const response = await api.get('/api/connections/suggestions', { params });
    return response.data.data;
  },
};

export default connectionService;
import api from './api';

interface NotificationParams {
  page?: number;
  limit?: number;
}

const notificationService = {
  // Get all notifications with pagination
  getNotifications: async (params: NotificationParams = {}): Promise<any> => {
    const response = await api.get('/api/notifications', { params });
    return response.data.data;
  },
  
  // Mark a notification as read
  markNotificationRead: async (notificationId: string): Promise<any> => {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data.data;
  },
  
  // Mark all notifications as read
  markAllNotificationsRead: async (): Promise<any> => {
    const response = await api.put('/api/notifications/read-all');
    return response.data.data;
  },
  
  // Delete a notification
  deleteNotification: async (notificationId: string): Promise<any> => {
    const response = await api.delete(`/api/notifications/${notificationId}`);
    return response.data.data;
  },
};

export default notificationService;
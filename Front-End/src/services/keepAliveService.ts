import api from './api';

/**
 * Service to keep the backend alive by periodically pinging the health endpoint
 * This prevents Render from putting the application to sleep due to inactivity
 */
const keepAliveService = {
  interval: null as NodeJS.Timeout | null,
  
  /**
   * Ping the backend health check endpoint
   */
  ping: async (): Promise<void> => {
    try {
      const response = await api.get('/health');
      console.log('Keep-alive ping successful:', response.data);
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
    }
  },
  
  /**
   * Start the keep-alive service
   * @param intervalMs - Interval in milliseconds between pings (default: 5 minutes)
   */
  start: (intervalMs: number = 10 * 60 * 1000): void => {
    // Clear any existing interval
    if (keepAliveService.interval) {
      keepAliveService.stop();
    }
    
    // Start pinging immediately
    keepAliveService.ping();
    
    // Set up interval for subsequent pings
    keepAliveService.interval = setInterval(keepAliveService.ping, intervalMs);
    console.log(`Keep-alive service started with ${intervalMs}ms interval`);
  },
  
  /**
   * Stop the keep-alive service
   */
  stop: (): void => {
    if (keepAliveService.interval) {
      clearInterval(keepAliveService.interval);
      keepAliveService.interval = null;
      console.log('Keep-alive service stopped');
    }
  },
};

export default keepAliveService;
import apiClient from './apiClient';

export const reportsService = {
  /**
   * Fetch overall hospital dashboard summary metrics
   */
  async getDashboardSummary() {
    return apiClient.get('/dashboard/summary');
  },

  /**
   * Fetch doctor performance and daily load analytics
   */
  async getDashboardDoctors() {
    return apiClient.get('/dashboard/doctors');
  }
};

export default reportsService;

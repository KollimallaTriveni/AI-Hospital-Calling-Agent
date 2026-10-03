import apiClient from './apiClient';

export const callService = {
  /**
   * Fetch call logs list
   */
  async getCallLogs(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.page_size) query.append('page_size', params.page_size || 50);
    const queryString = query.toString();
    return apiClient.get(`/calls${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Log/create a new telephony call session
   */
  async createCallLog(callPayload) {
    return apiClient.post('/calls', callPayload);
  },

  /**
   * Get call log detail
   */
  async getCallById(callId) {
    return apiClient.get(`/calls/${callId}`);
  },

  /**
   * Mark a call session complete
   */
  async completeCall(callId, outcomeData = {}) {
    return apiClient.post(`/calls/${callId}/complete`, outcomeData);
  },

  /**
   * Run AI symptom triage & medical specialty routing
   */
  async triageSymptoms(symptoms, age = null, gender = null) {
    return apiClient.post('/medical-routing/triage', {
      symptoms,
      age,
      gender
    });
  },

  /**
   * Post message to AI conversational agent
   */
  async chatWithAgent(message, history = []) {
    return apiClient.post('/agent/chat', {
      message,
      history
    });
  }
};

export default callService;

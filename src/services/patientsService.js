import apiClient from './apiClient';

export const patientsService = {
  /**
   * Fetch list of patients
   */
  async getPatients(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.page_size) query.append('page_size', params.page_size || 50);
    const queryString = query.toString();
    return apiClient.get(`/patients${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Create a new patient record
   */
  async createPatient(patientData) {
    return apiClient.post('/patients', patientData);
  },

  /**
   * Get patient details by ID
   */
  async getPatientById(patientId) {
    return apiClient.get(`/patients/${patientId}`);
  },

  /**
   * Get patient by phone number
   */
  async getPatientByPhone(phone) {
    return apiClient.get(`/patients/phone/${encodeURIComponent(phone)}`);
  },

  /**
   * Get appointment history for a patient
   */
  async getPatientAppointments(patientId) {
    return apiClient.get(`/patients/${patientId}/appointments`);
  }
};

export default patientsService;

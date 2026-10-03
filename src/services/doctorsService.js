import apiClient from './apiClient';

export const doctorsService = {
  /**
   * Fetch doctors list from API with optional filters
   */
  async getDoctors(params = {}) {
    const query = new URLSearchParams();
    if (params.specialty_id) query.append('specialty_id', params.specialty_id);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.page_size) query.append('page_size', params.page_size || 50);

    const queryString = query.toString();
    const endpoint = `/doctors${queryString ? `?${queryString}` : ''}`;
    return apiClient.get(endpoint);
  },

  /**
   * Fetch doctor details by ID
   */
  async getDoctorById(doctorId) {
    return apiClient.get(`/doctors/${doctorId}`);
  },

  /**
   * Fetch doctor shift schedules
   */
  async getDoctorSchedules(doctorId, date = null) {
    const endpoint = `/doctors/${doctorId}/schedules${date ? `?date=${date}` : ''}`;
    return apiClient.get(endpoint);
  },

  /**
   * Fetch doctor's booked appointments
   */
  async getDoctorAppointments(doctorId, params = {}) {
    const query = new URLSearchParams();
    if (params.date) query.append('date', params.date);
    if (params.status) query.append('status', params.status);
    const queryString = query.toString();
    return apiClient.get(`/doctors/${doctorId}/appointments${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Fetch available doctor booking slots
   */
  async getAvailableSlots(doctorId, date) {
    const query = new URLSearchParams();
    query.append('doctor_id', doctorId);
    if (date) query.append('date', date);
    return apiClient.get(`/availability/slots?${query.toString()}`);
  },

  /**
   * Fetch medical specialties
   */
  async getSpecialties() {
    return apiClient.get('/specialties');
  }
};

export default doctorsService;

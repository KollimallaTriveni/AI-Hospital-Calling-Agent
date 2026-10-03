import apiClient from './apiClient';

export const appointmentsService = {
  /**
   * Fetch list of appointments
   */
  async getAppointments(params = {}) {
    const query = new URLSearchParams();
    if (params.doctor_id) query.append('doctor_id', params.doctor_id);
    if (params.patient_id) query.append('patient_id', params.patient_id);
    if (params.date) query.append('date', params.date);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.page_size) query.append('page_size', params.page_size || 50);

    const queryString = query.toString();
    return apiClient.get(`/appointments${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Book a new appointment
   * Payload format:
   * {
   *   patient_id: int (or patient object fields),
   *   doctor_id: int,
   *   appointment_date: "YYYY-MM-DD",
   *   start_time: "HH:MM",
   *   reason: string,
   *   channel: "AI Voice Call" | "Web Portal"
   * }
   */
  async createAppointment(appointmentPayload) {
    return apiClient.post('/appointments', appointmentPayload);
  },

  /**
   * Fetch appointment by ID
   */
  async getAppointmentById(id) {
    return apiClient.get(`/appointments/${id}`);
  },

  /**
   * Cancel an appointment
   */
  async cancelAppointment(id, reason = 'Cancelled by user') {
    return apiClient.post(`/appointments/${id}/cancel`, { reason });
  }
};

export default appointmentsService;

import api from './api';

const appointmentService = {
  // Randevu oluştur
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Kullanıcının randevularını getir
  getMyAppointments: async (params = {}) => {
    const response = await api.get('/appointments/my-appointments', { params });
    return response.data;
  },

  // İşletmenin randevularını getir
  getBusinessAppointments: async (params = {}) => {
    const response = await api.get('/appointments/business/appointments', { params });
    return response.data;
  },

  // Randevu detayı
  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Randevu güncelle
  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Randevu iptal et
  cancelAppointment: async (id, reason = '') => {
    const response = await api.put(`/appointments/${id}/cancel`, { reason });
    return response.data;
  },

  // Randevu onayla (İşletme)
  confirmAppointment: async (id) => {
    const response = await api.put(`/appointments/${id}/confirm`);
    return response.data;
  },

  // Randevuyu tamamla (İşletme)
  completeAppointment: async (id) => {
    const response = await api.put(`/appointments/${id}/complete`);
    return response.data;
  },

  // Müsait saatleri getir
  getAvailableSlots: async (businessId, date, duration = 60) => {
    const response = await api.get(`/appointments/available-slots/${businessId}`, {
      params: { date, duration },
    });
    return response.data;
  },
};

export default appointmentService;

import api from './api';

const businessService = {
  // Tüm işletmeleri getir (arama ve filtreleme ile)
  getBusinesses: async (params = {}) => {
    const response = await api.get('/businesses', { params });
    return response.data;
  },

  // Tek işletme detayı
  getBusinessById: async (id) => {
    const response = await api.get(`/businesses/${id}`);
    return response.data;
  },

  // İşletme oluştur
  createBusiness: async (businessData) => {
    const response = await api.post('/businesses', businessData);
    return response.data;
  },

  // İşletme güncelle
  updateBusiness: async (id, businessData) => {
    const response = await api.put(`/businesses/${id}`, businessData);
    return response.data;
  },

  // İşletme sil
  deleteBusiness: async (id) => {
    const response = await api.delete(`/businesses/${id}`);
    return response.data;
  },

  // Kendi işletmemi getir
  getMyBusiness: async () => {
    const response = await api.get('/businesses/my/business');
    return response.data;
  },

  // Hizmet ekle
  addService: async (businessId, serviceData) => {
    const response = await api.post(`/businesses/${businessId}/services`, serviceData);
    return response.data;
  },

  // Hizmet güncelle
  updateService: async (businessId, serviceId, serviceData) => {
    const response = await api.put(`/businesses/${businessId}/services/${serviceId}`, serviceData);
    return response.data;
  },

  // Hizmet sil
  deleteService: async (businessId, serviceId) => {
    const response = await api.delete(`/businesses/${businessId}/services/${serviceId}`);
    return response.data;
  },
};

export default businessService;

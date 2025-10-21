import axios from 'axios';
import { getStorageData } from '../utils/storage';

// API base URL - Development için localhost, production için gerçek URL
const API_BASE_URL = __DEV__
  ? 'http://localhost:5000/api'
  : 'https://your-production-api.com/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout
});

// Request interceptor - Her istekte token ekle
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStorageData('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token alma hatası:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => {
    return response.data; // Sadece data kısmını döndür
  },
  (error) => {
    // Hata mesajını iyileştir
    let errorMessage = 'Bir hata oluştu';

    if (error.response) {
      // Server hata mesajı
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      // Network hatası
      errorMessage = 'Sunucuya bağlanılamadı';
    }

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;

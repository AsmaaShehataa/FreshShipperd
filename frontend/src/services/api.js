// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/stats/'),
  getBoxes: () => api.get('/boxes/'),
  getItems: () => api.get('/items/'),
  getCustomers: () => api.get('/customers/'),
};

// Profile and Settings APIs - ADD THESE
export const profileAPI = {
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
  getSettings: () => api.get('/auth/settings/'),
  updateSettings: (data) => api.put('/auth/settings/', data),
};

// Auth APIs (for logout)
export const authAPI = {
  logout: (refreshToken) => api.post('/auth/logout/', { refresh: refreshToken }),
  getCurrentUser: () => api.get('/auth/me/'),
};
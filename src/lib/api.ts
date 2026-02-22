// src/lib/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('approveflow_token');
    if (token && config.headers) {
      // Ensure we don't overwrite Content-Type for the login endpoint
      if (config.url !== '/auth/login') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Expirations
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('approveflow_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
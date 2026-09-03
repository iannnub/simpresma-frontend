import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: inject Sanctum Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('simpresma_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unwraps data and catches 401 unauthenticated
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return data directly as defined in spec
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('simpresma_token');
      localStorage.removeItem('simpresma_user');
      
      // Redirect to login only if not already on /login to prevent redirect loops
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../features/auth/authSlice';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    // Don't modify config if it's already set (from authService)
    if (!config.headers.Authorization) {
      const user = localStorage.getItem('user');
      console.log('User from localStorage:', user);
      if (user) {
        const { token } = JSON.parse(user);
        console.log('Token found:', token ? 'Yes' : 'No');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Setting Authorization header:', `Bearer ${token}`);
        }
      }
    }
    console.log('Final request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle auth errors for protected endpoints
    const isAuthEndpoint = error.config.url?.includes('/api/users/login') || 
                          error.config.url?.includes('/api/users/register');
    
    // Don't handle auth errors for auth endpoints
    if (!isAuthEndpoint && error.response?.status === 401) {
      const errorMessage = error.response?.data?.message?.toLowerCase() || '';
      
      // Only logout for specific token errors from the backend
      if (errorMessage === 'token expired' || 
          errorMessage === 'invalid token' || 
          errorMessage === 'invalid token: user not found' ||
          errorMessage === 'no token provided') {
        
        // Check if we actually sent a token
        const hasToken = error.config?.headers?.Authorization?.startsWith('Bearer ');
        if (hasToken) {
          store.dispatch(logout());
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance; 
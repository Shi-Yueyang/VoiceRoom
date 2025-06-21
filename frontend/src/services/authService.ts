import { axios } from '../config/api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await axios.get('/api/auth/profile');
    return response.data;
  },

  // Set auth token in headers
  setAuthToken: (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Remove auth token from headers
  removeAuthToken: () => {
    delete axios.defaults.headers.common['Authorization'];
  }
};

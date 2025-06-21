import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export { axios };

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

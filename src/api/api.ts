import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = (username: string, password: string, role: 'buyer' | 'seller') => {
  return api.post('/register', { username, password, role });
};

export const login = (username: string, password: string) => {
  return api.post('/login', { username, password });
};

export const submitServiceRequest = (serviceRequest: any) => {
  return api.post('/service-request', serviceRequest);
};

export const getServiceRequests = () => {
  return api.get('/service-requests');
};

export const submitOffer = (offer: any) => {
  return api.post('/offer', offer);
};

export const getOffers = (requestId: number) => {
  return api.get(`/offers/${requestId}`);
};

export default api;
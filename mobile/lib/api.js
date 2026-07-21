import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage?.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const listingAPI = {
  createListing: (data) => api.post('/listings', data),
  getListings: (params) => api.get('/listings', { params }),
  getListingById: (id) => api.get(`/listings/${id}`),
  updateListing: (id, data) => api.put(`/listings/${id}`, data),
  deleteListing: (id) => api.delete(`/listings/${id}`)
};

export const messageAPI = {
  sendMessage: (data) => api.post('/messages', data),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  getConversations: () => api.get('/messages')
};

export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
  getReviews: (userId) => api.get(`/users/${userId}/reviews`)
};

export const duesAPI = {
  getDuesStatus: () => api.get('/dues/status'),
  createPaymentIntent: (amount) => api.post('/dues/payment-intent', { amount }),
  confirmPayment: (data) => api.post('/dues/confirm-payment', data),
  getPaymentHistory: () => api.get('/dues/history'),
  setupRecurring: (data) => api.post('/dues/recurring', data),
  getInvoices: () => api.get('/dues/invoices')
};

export default api;

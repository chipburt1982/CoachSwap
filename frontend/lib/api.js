import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
  getListingById: (listingId) => api.get(`/listings/${listingId}`),
  updateListing: (listingId, data) => api.put(`/listings/${listingId}`, data),
  deleteListing: (listingId) => api.delete(`/listings/${listingId}`)
};

export const messageAPI = {
  sendMessage: (data) => api.post('/messages', data),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  getConversations: () => api.get('/messages')
};

export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data)
};

export default api;

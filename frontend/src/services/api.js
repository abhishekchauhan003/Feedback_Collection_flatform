import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const auth = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export const business = {
  create: (data) => API.post('/business', data),
  getAll: () => API.get('/business'),
  update: (id, data) => API.put(`/business/${id}`, data),
  delete: (id) => API.delete(`/business/${id}`),
};

export const qr = {
  createBranch: (data) => API.post('/qr/branch', data),
  getBranches: (businessId) => API.get(`/qr/branch/${businessId}`),
};

export const feedback = {
  submit: (data) => API.post('/feedback', data),
  get: (id) => API.get(`/feedback/${id}`),
  update: (id, data) => API.put(`/feedback/${id}`, data),
  regenerate: (id) => API.post(`/feedback/${id}/regenerate`),
  redirect: (id) => API.post(`/feedback/${id}/redirect`),
};

export const analytics = {
  get: (businessId) => API.get(`/analytics/${businessId}`),
};
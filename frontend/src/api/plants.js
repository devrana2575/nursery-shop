import api from './client';

export const plantsApi = {
  list: (params = {}) => api.get('/plants', { params }),
  featured: () => api.get('/plants/featured'),
  categories: () => api.get('/plants/categories'),
  get: (id) => api.get(`/plants/${id}`),
  create: (payload) => api.post('/plants', payload),
  update: (id, payload) => api.put(`/plants/${id}`, payload),
  remove: (id) => api.delete(`/plants/${id}`),
};

import api from './client';

export const contactApi = {
  send: (payload) => api.post('/contact', payload),
  list: () => api.get('/contact'),
  markRead: (id) => api.patch(`/contact/${id}/read`),
  remove: (id) => api.delete(`/contact/${id}`),
};

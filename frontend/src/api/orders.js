import api from './client';

export const ordersApi = {
  create: (payload) => api.post('/orders', payload),
  mine: () => api.get('/orders/mine'),
  all: (params = {}) => api.get('/orders', { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
  stats: () => api.get('/orders/stats'),
};

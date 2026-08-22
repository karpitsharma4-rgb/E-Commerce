import api from './api'

export const orderService = {
  placeOrder: (data) => api.post('/api/orders', data),
  getMyOrders: () => api.get('/api/orders/my'),
  getOrderById: (id) => api.get(`/api/orders/${id}`),
  getAllOrders: () => api.get('/api/orders'),
  updateOrderStatus: (id, data) => api.put(`/api/orders/${id}/status`, data),
}

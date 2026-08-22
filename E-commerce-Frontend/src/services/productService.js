import api from './api'

export const productService = {
  getProducts: (params) => api.get('/api/products', { params }),
  getProductById: (id) => api.get(`/api/products/${id}`),
  createProduct: (data) => api.post('/api/products', data),
  updateProduct: (id, data) => api.put(`/api/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
}

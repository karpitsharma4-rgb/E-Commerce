import api from './api'

export const cartService = {
  getCart: () => api.get('/api/cart'),
  addToCart: (data) => api.post('/api/cart', data),
  removeCartItem: (itemId) => api.delete(`/api/cart/${itemId}`),
  clearCart: () => api.delete('/api/cart'),
}

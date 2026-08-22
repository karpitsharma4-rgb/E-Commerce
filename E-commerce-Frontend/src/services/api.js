import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401
// NOTE: We do NOT globally redirect on 401 here because:
// - fetchProfile (auth/me) failing should NOT wipe the session silently
// - Each Redux thunk handles its own 401 via rejectWithValue
// - Explicit logout is dispatched from Redux (authSlice logout action)
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default api

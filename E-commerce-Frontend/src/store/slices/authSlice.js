import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'

// Load persisted auth from localStorage
const persistedToken = localStorage.getItem('token')
const persistedUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.register(data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.login(data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getProfile()
      // Handle both { data: { data: {...} } } and { data: {...} } shapes
      return res.data.data ?? res.data
    } catch (err) {
      // If token is invalid/expired, clear stored credentials
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to load profile')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.updateProfile(data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Profile update failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: persistedUser,
    token: persistedToken,
    role: persistedUser?.role || null,
    isAuthenticated: !!persistedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.role = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true
      state.error = null
    }
    const handleAuthFulfilled = (state, action) => {
      state.loading = false
      state.user = action.payload
      state.token = action.payload.token
      state.role = action.payload.role
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload))
    }
    const handleRejected = (state, action) => {
      state.loading = false
      state.error = action.payload
    }

    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleAuthFulfilled)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(fetchProfile.pending, handlePending)
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = { ...action.payload, token: state.token }
        state.role = action.payload.role
        state.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify({ ...action.payload, token: state.token }))
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        // If the token was invalid/expired (cleared in thunk), reset auth state
        // so ProtectedRoute redirects to login cleanly
        if (!localStorage.getItem('token')) {
          state.user = null
          state.token = null
          state.role = null
          state.isAuthenticated = false
        }
      })
      .addCase(updateProfile.pending, handlePending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        // Build merged object once — preserves token, avoids Immer double-apply bug
        const merged = { ...state.user, ...action.payload, token: state.token }
        state.user = merged
        state.role = merged.role
        localStorage.setItem('user', JSON.stringify(merged))
      })
      .addCase(updateProfile.rejected, handleRejected)
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

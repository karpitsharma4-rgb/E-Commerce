import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderService } from '../../services/orderService'

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (data, { rejectWithValue }) => {
    try {
      const res = await orderService.placeOrder(data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to place order')
    }
  }
)

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderService.getMyOrders()
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load orders')
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await orderService.getOrderById(id)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load order')
    }
  }
)

export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderService.getAllOrders()
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load all orders')
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await orderService.updateOrderStatus(id, data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status')
    }
  }
)

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    currentOrder: null,
    orderHistory: [],
    allOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(placeOrder.pending, pending)
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(placeOrder.rejected, rejected)
      .addCase(fetchMyOrders.pending, pending)
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orderHistory = Array.isArray(action.payload) ? action.payload : (action.payload?.orders || [])
      })
      .addCase(fetchMyOrders.rejected, rejected)
      .addCase(fetchOrderById.pending, pending)
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrderById.rejected, rejected)
      .addCase(fetchAllOrders.pending, pending)
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false
        state.allOrders = Array.isArray(action.payload) ? action.payload : (action.payload?.orders || [])
      })
      .addCase(fetchAllOrders.rejected, rejected)
      .addCase(updateOrderStatus.pending, pending)
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        const updated = action.payload
        const idx = state.allOrders.findIndex(o => o._id === updated._id)
        if (idx !== -1) state.allOrders[idx] = updated
        if (state.currentOrder?._id === updated._id) state.currentOrder = updated
      })
      .addCase(updateOrderStatus.rejected, rejected)
  },
})

export const { clearCurrentOrder, clearError } = orderSlice.actions
export default orderSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cartService } from '../../services/cartService'

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartService.getCart()
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data, { rejectWithValue }) => {
    try {
      const res = await cartService.addToCart(data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add to cart')
    }
  }
)

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await cartService.removeCartItem(itemId)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart()
      return []
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to clear cart')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCartLocally: (state) => {
      state.cartItems = []
      state.totalQuantity = 0
    },
  },
  extraReducers: (builder) => {
    const updateCart = (state, action) => {
      state.loading = false
      const items = Array.isArray(action.payload) ? action.payload : (action.payload?.items || [])
      state.cartItems = items
      state.totalQuantity = items.reduce((total, item) => total + (item.quantity || 1), 0)
    }
    const handlePending = (state) => { state.loading = true; state.error = null }
    const handleRejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, updateCart)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, updateCart)
      .addCase(addToCart.rejected, handleRejected)
      .addCase(removeCartItem.pending, handlePending)
      .addCase(removeCartItem.fulfilled, updateCart)
      .addCase(removeCartItem.rejected, handleRejected)
      .addCase(clearCart.pending, handlePending)
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false
        state.cartItems = []
        state.totalQuantity = 0
      })
      .addCase(clearCart.rejected, handleRejected)
  },
})

export const { clearCartLocally } = cartSlice.actions
export default cartSlice.reducer

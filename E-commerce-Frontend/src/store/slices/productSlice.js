import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '../../services/productService'

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const res = await productService.getProducts(params)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await productService.getProductById(id)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load product')
    }
  }
)

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (data, { rejectWithValue }) => {
    try {
      const res = await productService.createProduct(data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create product')
    }
  }
)

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await productService.updateProduct(id, data)
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update product')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete product')
    }
  }
)

const initialFilters = {
  keyword: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  sort: '',
  page: 1,
  limit: 12,
}

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pages: 1,
      total: 0,
    },
    filters: initialFilters,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 }
    },
    setPage: (state, action) => {
      state.filters.page = action.payload
    },
    clearProduct: (state) => {
      state.product = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        state.products = payload.products || payload || []
        state.pagination = {
          page: payload.page || 1,
          pages: payload.pages || 1,
          total: payload.total || state.products.length,
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.product = action.payload })
      .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex(p => p._id === action.payload._id)
        if (idx !== -1) state.products[idx] = action.payload
        if (state.product?._id === action.payload._id) state.product = action.payload
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload)
      })
  },
})

export const { setFilters, setPage, clearProduct } = productSlice.actions
export default productSlice.reducer

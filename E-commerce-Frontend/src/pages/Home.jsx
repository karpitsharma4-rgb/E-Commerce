import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { fetchProducts, setFilters, setPage } from '../store/slices/productSlice'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'

const CATEGORIES = ['T-Shirts', 'Shirts', 'Jeans', 'Dresses', 'Jackets', 'Trousers', 'Shorts', 'Kurtis', 'Hoodies', 'Ethnic Wear']
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function Home() {
  const dispatch = useDispatch()
  const { products, loading, error, pagination, filters } = useSelector((state) => state.product)

  const loadProducts = useCallback(() => {
    const params = {}
    if (filters.keyword) params.keyword = filters.keyword
    if (filters.category) params.category = filters.category
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.sort) params.sort = filters.sort
    params.page = filters.page
    params.limit = filters.limit
    dispatch(fetchProducts(params))
  }, [dispatch, filters])

  useEffect(() => { loadProducts() }, [loadProducts])

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }))
  }

  const clearFilters = () => {
    dispatch(setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', sort: '', page: 1 }))
  }

  const hasActiveFilters = filters.keyword || filters.category || filters.minPrice || filters.maxPrice || filters.sort

  return (
    <div className="page-container">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 mb-8 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDB2NmgtNnYtNmg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10">
          <p className="text-indigo-200 font-medium mb-2">New Season Arrivals</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Discover Your Style</h1>
          <p className="text-indigo-100 text-lg max-w-md">Premium clothing for every occasion. Shop the latest trends at unbeatable prices.</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              className="input-field pl-9 py-2 text-sm"
              id="search-input"
            />
          </div>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input-field py-2 text-sm w-auto min-w-36"
            id="category-filter"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Price range */}
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="input-field py-2 text-sm w-24"
            min="0"
            id="min-price"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="input-field py-2 text-sm w-24"
            min="0"
            id="max-price"
          />

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="input-field py-2 text-sm w-auto min-w-44"
            id="sort-select"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors" id="clear-filters">
              <FiX size={16} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-gray-600 text-sm">
          {loading ? 'Loading...' : `${pagination.total || products.length} product${(pagination.total || products.length) !== 1 ? 's' : ''} found`}
        </p>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            <FiFilter size={12} />
            Filters active
          </div>
        )}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[3/4] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Failed to load products</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button onClick={loadProducts} className="btn-primary">Try Again</button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={pagination.page}
        pages={pagination.pages}
        onPageChange={(p) => {
          dispatch(setPage(p))
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    </div>
  )
}

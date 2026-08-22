import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import { fetchProfile } from './store/slices/authSlice'
import { fetchCart } from './store/slices/cartSlice'

// Pages
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import MyOrders from './pages/MyOrders'
import OrderDetails from './pages/OrderDetails'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'

function App() {
  const dispatch = useDispatch()
  const { token, isAuthenticated } = useSelector((state) => state.auth)

  // Auto-fetch profile and cart on (re)load if token exists
  useEffect(() => {
    if (token) {
      dispatch(fetchProfile())
      dispatch(fetchCart())
    }
  }, [dispatch, token])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (authenticated users) */}
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />

          {/* 404 fallback */}
          <Route path="*" element={
            <div className="page-container text-center py-32">
              <div className="text-8xl mb-6">🤷</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
              <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary inline-block">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

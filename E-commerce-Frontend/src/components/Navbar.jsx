import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiPackage, FiSettings } from 'react-icons/fi'
import { logout } from '../store/slices/authSlice'
import { clearCartLocally } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user, role } = useSelector((state) => state.auth)
  const { totalQuantity } = useSelector((state) => state.cart)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCartLocally())
    toast.success('Logged out successfully')
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Style<span className="text-indigo-600">Hive</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Shop</Link>
            {isAuthenticated && (
              <>
                <Link to="/my-orders" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">My Orders</Link>
                <Link to="/profile" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Profile</Link>
              </>
            )}
            {role === 'admin' && (
              <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors flex items-center gap-1">
                <FiSettings size={16} />
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <FiShoppingCart size={22} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </Link>

            {/* Auth buttons - desktop */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Hi, {user?.name?.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 font-medium"
                >
                  <FiLogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-1.5">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5">Register</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              id="mobile-menu-toggle"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg font-medium">Shop</Link>
            {isAuthenticated && (
              <>
                <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg font-medium">
                  <FiPackage className="inline mr-2" />My Orders
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg font-medium">
                  <FiUser className="inline mr-2" />Profile
                </Link>
              </>
            )}
            {role === 'admin' && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold">
                <FiSettings className="inline mr-2" />Admin Panel
              </Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-2">
                <FiLogOut size={16} />Logout
              </button>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm flex-1 text-center">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm flex-1 text-center">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

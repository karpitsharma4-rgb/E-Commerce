import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiPackage, FiShoppingBag, FiList, FiTrendingUp } from 'react-icons/fi'
import { fetchAllOrders } from '../store/slices/orderSlice'
import { fetchProducts } from '../store/slices/productSlice'

const STATUS_STYLES = {
  Processing: 'badge-warning',
  Shipped: 'badge-info',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
}

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { allOrders } = useSelector((state) => state.order)
  const { products } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(fetchAllOrders())
    dispatch(fetchProducts({ limit: 100 }))
  }, [dispatch])

  const stats = {
    totalProducts: products.length,
    totalOrders: allOrders.length,
    pendingOrders: allOrders.filter(o => o.status === 'Processing').length,
    revenue: allOrders.reduce((s, o) => s + (o.totalPrice || 0), 0),
  }

  const recentOrders = [...allOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div className="page-container">
      <h1 className="section-title">Admin Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: stats.totalProducts, icon: FiShoppingBag, color: 'bg-blue-50 text-blue-600', link: '/admin/products' },
          { label: 'Total Orders', value: stats.totalOrders, icon: FiPackage, color: 'bg-indigo-50 text-indigo-600', link: '/admin/orders' },
          { label: 'Pending Orders', value: stats.pendingOrders, icon: FiList, color: 'bg-yellow-50 text-yellow-600', link: '/admin/orders' },
          { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: FiTrendingUp, color: 'bg-green-50 text-green-600' },
        ].map(({ label, value, icon: Icon, color, link }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
            {link && <Link to={link} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-2 inline-block">View all →</Link>}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/admin/products" className="card p-5 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <FiShoppingBag className="text-indigo-600" size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Manage Products</p>
              <p className="text-sm text-gray-500">Add, edit, or delete products</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/orders" className="card p-5 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <FiPackage className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Manage Orders</p>
              <p className="text-sm text-gray-500">Update statuses & tracking</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">Order</th>
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden sm:table-cell">Date</th>
                  <th className="text-left py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">Status</th>
                  <th className="text-right py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <Link to={`/orders/${order._id}`} className="font-mono text-indigo-600 hover:text-indigo-800 text-xs">
                        #{order._id?.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-500 hidden sm:table-cell">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span className={STATUS_STYLES[order.status] || 'badge-info'}>{order.status || 'Processing'}</span>
                    </td>
                    <td className="py-3 text-right font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

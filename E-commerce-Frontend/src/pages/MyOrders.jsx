import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiPackage, FiChevronRight } from 'react-icons/fi'
import { fetchMyOrders } from '../store/slices/orderSlice'

const STATUS_STYLES = {
  Processing: 'badge-warning',
  Shipped: 'badge-info',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
}

export default function MyOrders() {
  const dispatch = useDispatch()
  const { orderHistory, loading, error } = useSelector((state) => state.order)

  useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])

  if (loading) return (
    <div className="page-container">
      <div className="space-y-4 animate-pulse">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  )

  return (
    <div className="page-container">
      <h1 className="section-title">My Orders</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>
      )}

      {orderHistory.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h2>
          <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <FiPackage size={18} /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orderHistory.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow group"
              id={`order-${order._id}`}
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-gray-400">#{order._id?.slice(-8).toUpperCase()}</span>
                  <span className={STATUS_STYLES[order.status] || 'badge-info'}>{order.status || 'Processing'}</span>
                  {order.trackingNumber && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      Track: {order.trackingNumber}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? 's' : ''} ·{' '}
                  <span className="text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</p>
                </div>
                <FiChevronRight className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

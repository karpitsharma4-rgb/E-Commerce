import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiPackage, FiExternalLink, FiSave } from 'react-icons/fi'
import { fetchAllOrders, updateOrderStatus } from '../store/slices/orderSlice'
import { toast } from 'react-toastify'

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled']
const STATUS_STYLES = {
  Processing: 'badge-warning',
  Shipped: 'badge-info',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
}

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { allOrders, loading } = useSelector((state) => state.order)
  const [editingOrder, setEditingOrder] = useState(null)
  const [statusMap, setStatusMap] = useState({})
  const [trackingMap, setTrackingMap] = useState({})
  const [submitting, setSubmitting] = useState({})

  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

  useEffect(() => {
    const sm = {}, tm = {}
    allOrders.forEach(o => { sm[o._id] = o.status; tm[o._id] = o.trackingNumber || '' })
    setStatusMap(sm)
    setTrackingMap(tm)
  }, [allOrders])

  const handleUpdate = async (orderId) => {
    setSubmitting(prev => ({ ...prev, [orderId]: true }))
    const result = await dispatch(updateOrderStatus({
      id: orderId,
      data: { status: statusMap[orderId], trackingNumber: trackingMap[orderId] }
    }))
    setSubmitting(prev => ({ ...prev, [orderId]: false }))
    if (updateOrderStatus.fulfilled.match(result)) {
      toast.success('Order updated!')
      setEditingOrder(null)
    } else {
      toast.error(result.payload || 'Update failed')
    }
  }

  if (loading && allOrders.length === 0) {
    return (
      <div className="page-container">
        <div className="space-y-4 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title mb-0">Manage Orders</h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
          {allOrders.length} total
        </span>
      </div>

      {allOrders.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700">No orders yet</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {[...allOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => (
            <div key={order._id} className="card p-5">
              {/* Order header */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <FiPackage className="text-indigo-600" size={18} />
                <span className="font-mono text-sm font-bold text-gray-700">#{order._id?.slice(-8).toUpperCase()}</span>
                <span className={STATUS_STYLES[order.status] || 'badge-info'}>{order.status || 'Processing'}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</span>
                <Link to={`/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-800 p-1" id={`view-order-${order._id}`}>
                  <FiExternalLink size={16} />
                </Link>
              </div>

              {/* Customer info */}
              {order.user && (
                <p className="text-xs text-gray-500 mb-3">
                  Customer: <span className="font-medium text-gray-700">{order.user.name || order.user.email || order.user}</span>
                  {order.orderItems && <span> · {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</span>}
                </p>
              )}

              {/* Update form */}
              {editingOrder === order._id ? (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                      <select
                        value={statusMap[order._id] || order.status}
                        onChange={e => setStatusMap(prev => ({ ...prev, [order._id]: e.target.value }))}
                        className="input-field py-2 text-sm"
                        id={`status-select-${order._id}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tracking Number</label>
                      <input
                        type="text"
                        value={trackingMap[order._id] || ''}
                        onChange={e => setTrackingMap(prev => ({ ...prev, [order._id]: e.target.value }))}
                        placeholder="e.g. SH1234567890IN"
                        className="input-field py-2 text-sm"
                        id={`tracking-input-${order._id}`}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(order._id)}
                      disabled={submitting[order._id]}
                      className="btn-primary flex items-center gap-2 text-sm py-2"
                      id={`save-order-${order._id}`}
                    >
                      {submitting[order._id] ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={15} />}
                      Save
                    </button>
                    <button onClick={() => setEditingOrder(null)} className="btn-secondary text-sm py-2">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {order.trackingNumber && (
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-mono font-medium">
                      🚚 {order.trackingNumber}
                    </span>
                  )}
                  <button
                    onClick={() => setEditingOrder(order._id)}
                    className="btn-secondary text-sm py-1.5 ml-auto"
                    id={`edit-order-${order._id}`}
                  >
                    Update Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

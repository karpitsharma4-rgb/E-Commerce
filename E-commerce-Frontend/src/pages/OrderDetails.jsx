import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiArrowLeft, FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi'
import { fetchOrderById } from '../store/slices/orderSlice'

const STATUS_STYLES = {
  Processing: 'badge-warning',
  Shipped: 'badge-info',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
}

const STATUS_STEPS = ['Processing', 'Shipped', 'Delivered']

export default function OrderDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentOrder: order, loading, error } = useSelector((state) => state.order)

  useEffect(() => { dispatch(fetchOrderById(id)) }, [dispatch, id])

  if (loading) return (
    <div className="page-container">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="h-60 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  )

  if (error || !order) return (
    <div className="page-container text-center py-20">
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{error || 'Order not found'}</h3>
      <button onClick={() => navigate('/my-orders')} className="btn-primary">My Orders</button>
    </div>
  )

  const currentStepIdx = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="page-container">
      <button onClick={() => navigate('/my-orders')} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
        <FiArrowLeft size={18} /> Back to Orders
      </button>

      {/* Title row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <span className={STATUS_STYLES[order.status] || 'badge-info'}>{order.status || 'Processing'}</span>
        <span className="font-mono text-sm text-gray-400 ml-auto">#{order._id?.slice(-8).toUpperCase()}</span>
      </div>

      {/* Progress tracker */}
      {order.status !== 'Cancelled' && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2">
            {STATUS_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  i <= currentStepIdx ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>{i + 1}</div>
                <span className={`text-xs font-medium hidden sm:inline ${i <= currentStepIdx ? 'text-indigo-600' : 'text-gray-400'}`}>{s}</span>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 ${i < currentStepIdx ? 'bg-indigo-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          {order.trackingNumber && (
            <div className="mt-4 bg-indigo-50 rounded-xl px-4 py-3">
              <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">Tracking Number</p>
              <p className="font-mono font-bold text-indigo-800">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiPackage className="text-indigo-600" /> Ordered Items
            </h2>
            <div className="space-y-4">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.image || 'https://placehold.co/64x80/e2e8f0/64748b?text=•'}
                      alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <div className="flex gap-2 mt-1">
                      {item.size && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Size: {item.size}</span>}
                      {item.color && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Color: {item.color}</span>}
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">₹{item.price?.toLocaleString()} × {item.quantity}</span>
                      <span className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity)?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Shipping */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiMapPin className="text-indigo-600" size={16} /> Shipping Address
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && <p className="font-medium">{order.shippingAddress.phone}</p>}
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiCreditCard className="text-indigo-600" size={16} /> Payment
            </h3>
            <p className="text-sm text-gray-700 font-medium">{order.paymentMethod}</p>
          </div>

          {/* Price breakdown - from backend */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3">Price Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>₹{order.itemsPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18% GST)</span>
                <span>₹{order.taxPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={order.shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                  {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-indigo-600">₹{order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

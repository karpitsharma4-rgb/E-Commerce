import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiCheckCircle, FiPackage, FiList } from 'react-icons/fi'
import { fetchOrderById } from '../store/slices/orderSlice'

export default function OrderSuccess() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentOrder } = useSelector((state) => state.order)

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id))
  }, [id, dispatch])

  return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center">
        <div className="card p-10">
          {/* Success animation */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <FiCheckCircle className="text-green-500" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-6">Thank you for your purchase. We'll start processing your order right away.</p>

          {/* Order ID */}
          <div className="bg-indigo-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-indigo-500 uppercase tracking-widest font-semibold mb-1">Order ID</p>
            <p className="font-mono text-sm text-indigo-800 font-bold break-all">{id}</p>
          </div>

          {/* Backend-authoritative prices */}
          {currentOrder && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span className="font-medium">₹{currentOrder.itemsPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (GST)</span>
                <span className="font-medium">₹{currentOrder.taxPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={`font-medium ${currentOrder.shippingPrice === 0 ? 'text-green-600' : ''}`}>
                  {currentOrder.shippingPrice === 0 ? 'FREE' : `₹${currentOrder.shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
                <span>Total</span>
                <span className="text-indigo-600">₹{currentOrder.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link to={`/orders/${id}`} className="btn-primary flex items-center justify-center gap-2" id="view-order-btn">
              <FiPackage size={18} /> View Order Details
            </Link>
            <Link to="/my-orders" className="btn-secondary flex items-center justify-center gap-2" id="my-orders-btn">
              <FiList size={18} /> My Orders
            </Link>
            <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

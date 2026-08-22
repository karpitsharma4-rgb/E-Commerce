import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi'
import { placeOrder } from '../store/slices/orderSlice'
import { clearCartLocally } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'

const PAYMENT_METHODS = ['Cash on Delivery', 'UPI', 'Credit/Debit Card', 'Net Banking']

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.order)
  const { cartItems } = useSelector((state) => state.cart)

  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Review
  const [address, setAddress] = useState({
    name: '', street: '', city: '', state: '', postalCode: '', country: 'India',
    phone: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('')

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    if (!paymentMethod) { toast.warning('Please select a payment method'); return }

    const orderData = {
      shippingAddress: address,
      paymentMethod,
      orderItems: cartItems.map(item => ({
        product: item.product?._id || item.product,
        name: item.product?.name || item.name,
        price: item.product?.discountPrice || item.product?.price || item.price,
        image: item.product?.images?.[0] || '',
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }))
    }

    const result = await dispatch(placeOrder(orderData))
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCartLocally())
      toast.success('Order placed successfully! 🎉')
      navigate(`/order-success/${result.payload._id}`)
    } else {
      toast.error(result.payload || 'Failed to place order')
    }
  }

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="page-container">
      <h1 className="section-title">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step > i + 1 ? 'bg-green-500 text-white' :
              step === i + 1 ? 'bg-indigo-600 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {step > i + 1 ? <FiCheck size={14} /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${step === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
            {i < 2 && <div className={`flex-1 h-0.5 w-8 ${step > i + 1 ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiMapPin className="text-indigo-600" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              </div>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input id="name" name="name" value={address.name} onChange={handleAddressChange}
                      required placeholder="John Doe" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input id="phone" name="phone" value={address.phone} onChange={handleAddressChange}
                      required placeholder="+91 98765 43210" className="input-field" />
                  </div>
                </div>
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input id="street" name="street" value={address.street} onChange={handleAddressChange}
                    required placeholder="123 Main Street, Apt 4B" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input id="city" name="city" value={address.city} onChange={handleAddressChange}
                      required placeholder="Mumbai" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input id="state" name="state" value={address.state} onChange={handleAddressChange}
                      required placeholder="Maharashtra" className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                    <input id="postalCode" name="postalCode" value={address.postalCode} onChange={handleAddressChange}
                      required placeholder="400001" className="input-field" maxLength={6} />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input id="country" name="country" value={address.country} onChange={handleAddressChange}
                      className="input-field" />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-3 mt-2" id="continue-to-payment-btn">
                  Continue to Payment →
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiCreditCard className="text-indigo-600" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(method => (
                  <label key={method}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    htmlFor={`payment-${method}`}>
                    <input id={`payment-${method}`} type="radio" name="paymentMethod" value={method}
                      checked={paymentMethod === method} onChange={() => setPaymentMethod(method)}
                      className="accent-indigo-600" />
                    <span className="font-medium text-gray-800">{method}</span>
                    {method === 'Cash on Delivery' && <span className="ml-auto text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Safe</span>}
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1" id="back-to-address-btn">← Back</button>
                <button onClick={() => paymentMethod ? setStep(3) : toast.warning('Select a payment method')}
                  className="btn-primary flex-1" id="continue-to-review-btn">
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Review & Place Order</h2>

              {/* Address summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Shipping To</p>
                <p className="text-sm font-medium text-gray-900">{address.name}</p>
                <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state} - {address.postalCode}</p>
                <p className="text-sm text-gray-600">{address.country} | {address.phone}</p>
              </div>

              {/* Payment summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment</p>
                <p className="text-sm font-medium text-gray-900">{paymentMethod}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1" id="back-to-payment-btn">← Back</button>
                <button onClick={handlePlaceOrder} disabled={loading}
                  className="btn-primary flex-1 py-3 text-base" id="place-order-btn">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing Order...
                    </span>
                  ) : '🎉 Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="card p-5 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
            Your Order ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cartItems.map(item => {
              const price = item.product?.discountPrice || item.product?.price || item.price || 0
              return (
                <div key={item._id} className="flex gap-3">
                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.product?.images?.[0] || 'https://placehold.co/48x56/e2e8f0/64748b?text=•'}
                      alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.product?.name || item.name}</p>
                    <p className="text-xs text-gray-500">{item.size} · {item.color} · ×{item.quantity}</p>
                    <p className="text-xs font-bold text-gray-900">₹{(price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

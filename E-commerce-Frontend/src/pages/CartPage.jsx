import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiTrash2, FiShoppingBag, FiArrowRight, FiMinus, FiPlus } from 'react-icons/fi'
import { fetchCart, removeCartItem, clearCart, addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartItems, loading } = useSelector((state) => state.cart)

  useEffect(() => { dispatch(fetchCart()) }, [dispatch])

  const handleRemove = async (itemId) => {
    const result = await dispatch(removeCartItem(itemId))
    if (removeCartItem.fulfilled.match(result)) toast.success('Item removed')
    else toast.error(result.payload || 'Failed to remove item')
  }

  const handleClearCart = async () => {
    if (!window.confirm('Clear entire cart?')) return
    const result = await dispatch(clearCart())
    if (clearCart.fulfilled.match(result)) toast.success('Cart cleared')
    else toast.error(result.payload || 'Failed to clear cart')
  }

  const handleQtyChange = async (item, newQty) => {
    if (newQty < 1) return
    await dispatch(addToCart({
      productId: item.product?._id || item.product,
      quantity: newQty,
      size: item.size,
      color: item.color,
    }))
  }

  // Calculate totals (frontend display only - backend is authoritative at order time)
  const itemsPrice = cartItems.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || item.price || 0
    return sum + price * (item.quantity || 1)
  }, 0)
  const taxPrice = Math.round(itemsPrice * 0.18)
  const shippingPrice = itemsPrice > 999 ? 0 : 99
  const totalPrice = itemsPrice + taxPrice + shippingPrice

  if (loading && cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-container text-center py-20">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FiShoppingBag size={18} /> Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title mb-0">Shopping Cart</h1>
        <button onClick={handleClearCart} disabled={loading}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
          id="clear-cart-btn">
          <FiTrash2 size={16} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const prodImg = item.product?.images?.[0]
            const prodName = item.product?.name || item.name
            const prodPrice = item.product?.discountPrice || item.product?.price || item.price || 0

            return (
              <div key={item._id} className="card p-4 flex gap-4">
                {/* Image */}
                <div className="w-24 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <img src={prodImg || `https://placehold.co/100x120/e2e8f0/64748b?text=Item`}
                    alt={prodName}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = 'https://placehold.co/100x120/e2e8f0/64748b?text=Item'} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{prodName}</h3>
                  <div className="flex gap-3 mt-1">
                    {item.size && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Size: {item.size}</span>}
                    {item.color && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Color: {item.color}</span>}
                  </div>
                  <p className="text-indigo-600 font-bold mt-2">₹{prodPrice.toLocaleString()}</p>

                  {/* Actions row */}
                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => handleQtyChange(item, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                        className="px-2.5 py-1.5 hover:bg-gray-100 disabled:opacity-40 transition-colors">
                        <FiMinus size={12} />
                      </button>
                      <span className="px-3 text-sm font-bold min-w-8 text-center">{item.quantity}</span>
                      <button onClick={() => handleQtyChange(item, item.quantity + 1)}
                        disabled={loading}
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors">
                        <FiPlus size={12} />
                      </button>
                    </div>

                    {/* Subtotal + Remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">₹{(prodPrice * item.quantity).toLocaleString()}</span>
                      <button onClick={() => handleRemove(item._id)}
                        disabled={loading}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        id={`remove-item-${item._id}`}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items ({cartItems.length})</span>
                <span className="font-medium text-gray-900">₹{itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18% GST)</span>
                <span className="font-medium text-gray-900">₹{taxPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={`font-medium ${shippingPrice === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>
              {itemsPrice <= 999 && (
                <p className="text-xs text-gray-400 italic">Add ₹{(1000 - itemsPrice).toLocaleString()} more for free shipping</p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                <span>Total (est.)</span>
                <span className="text-indigo-600">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">* Final total confirmed by backend at checkout</p>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3.5 mt-5 flex items-center justify-center gap-2 text-base"
              id="checkout-btn"
            >
              Proceed to Checkout <FiArrowRight size={18} />
            </button>

            <Link to="/" className="block text-center text-sm text-indigo-600 hover:text-indigo-700 mt-4 font-medium">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

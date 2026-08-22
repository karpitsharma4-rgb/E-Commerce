import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiShoppingCart, FiStar, FiArrowLeft, FiPackage } from 'react-icons/fi'
import { fetchProductById, clearProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'

export default function ProductPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { product, loading, error } = useSelector((state) => state.product)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { loading: cartLoading } = useSelector((state) => state.cart)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    dispatch(fetchProductById(id))
    return () => dispatch(clearProduct())
  }, [dispatch, id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart')
      navigate('/login')
      return
    }
    if (!selectedSize) { toast.warning('Please select a size'); return }
    if (!selectedColor) { toast.warning('Please select a color'); return }

    const result = await dispatch(addToCart({
      productId: product._id,
      quantity,
      size: selectedSize,
      color: selectedColor,
    }))
    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart!')
    } else {
      toast.error(result.payload || 'Failed to add to cart')
    }
  }

  if (loading) return (
    <div className="page-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )

  if (error || !product) return (
    <div className="page-container text-center py-20">
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{error || 'Product not found'}</h3>
      <button onClick={() => navigate('/')} className="btn-primary">Back to Shop</button>
    </div>
  )

  const {
    name, description, price, discountPrice, images, countInStock,
    sizes, colors, rating, numReviews, category
  } = product

  const hasDiscount = discountPrice && discountPrice < price
  const discountPct = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0
  const displayImages = images?.length > 0 ? images : [`https://placehold.co/600x600/e2e8f0/64748b?text=${encodeURIComponent(name)}`]

  return (
    <div className="page-container">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium" id="back-btn">
        <FiArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100">
            <img src={displayImages[selectedImage]} alt={name}
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = `https://placehold.co/600x600/e2e8f0/64748b?text=${encodeURIComponent(name)}`} />
          </div>
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {displayImages.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-300'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Category & Title */}
          {category && <span className="text-xs font-medium text-indigo-600 uppercase tracking-widest">{category}</span>}
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <FiStar key={star} size={18}
                  className={star <= Math.round(rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{rating?.toFixed(1) || 'N/A'} ({numReviews || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              ₹{(hasDiscount ? discountPrice : price)?.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">₹{price?.toLocaleString()}</span>
                <span className="bg-green-100 text-green-700 text-sm font-bold px-2.5 py-0.5 rounded-full">{discountPct}% OFF</span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <FiPackage size={16} className={countInStock > 0 ? 'text-green-500' : 'text-red-500'} />
            <span className={`text-sm font-medium ${countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {countInStock > 0 ? `In Stock (${countInStock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{description}</p>
          )}

          {/* Size selector */}
          {sizes?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Size <span className="text-red-500">*</span>
                {selectedSize && <span className="ml-2 text-indigo-600 font-bold">{selectedSize}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                    id={`size-${size}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {colors?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Color <span className="text-red-500">*</span>
                {selectedColor && <span className="ml-2 text-indigo-600 font-bold">{selectedColor}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button key={color} onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all ${
                      selectedColor === color
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                    }`}
                    id={`color-${color}`}>
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Quantity</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 border-2 border-gray-200 rounded-xl flex items-center justify-center text-lg font-bold hover:border-indigo-300 transition-colors">-</button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(countInStock, q + 1))}
                className="w-10 h-10 border-2 border-gray-200 rounded-xl flex items-center justify-center text-lg font-bold hover:border-indigo-300 transition-colors">+</button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={cartLoading || countInStock === 0}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
            id="add-to-cart-btn"
          >
            {cartLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiShoppingCart size={20} />
            )}
            {countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

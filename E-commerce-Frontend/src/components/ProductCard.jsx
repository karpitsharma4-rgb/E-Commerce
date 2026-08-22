import { Link } from 'react-router-dom'
import { FiStar, FiShoppingCart } from 'react-icons/fi'

export default function ProductCard({ product }) {
  const {
    _id,
    name,
    images,
    price,
    discountPrice,
    rating,
    numReviews,
    countInStock,
    category,
  } = product

  const displayImage = images?.[0] || `https://placehold.co/400x500/e2e8f0/64748b?text=${encodeURIComponent(name)}`
  const hasDiscount = discountPrice && discountPrice < price
  const discountPct = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${_id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x500/e2e8f0/64748b?text=${encodeURIComponent(name)}`
            }}
          />
          {/* Stock badge */}
          {countInStock === 0 && (
            <div className="absolute top-2 left-2">
              <span className="badge-danger text-xs">Out of Stock</span>
            </div>
          )}
          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-2 right-2">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discountPct}%</span>
            </div>
          )}
          {/* Category */}
          {category && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">{category}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${_id}`}>
          <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 text-sm leading-snug">{name}</h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <FiStar className="text-yellow-400 fill-yellow-400" size={13} />
          <span className="text-xs text-gray-500">{rating?.toFixed(1) || 'N/A'} ({numReviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          {hasDiscount ? (
            <>
              <span className="font-bold text-gray-900">₹{discountPrice.toLocaleString()}</span>
              <span className="text-sm text-gray-400 line-through">₹{price.toLocaleString()}</span>
            </>
          ) : (
            <span className="font-bold text-gray-900">₹{price?.toLocaleString()}</span>
          )}
        </div>

        <Link
          to={`/product/${_id}`}
          className="mt-3 w-full flex items-center justify-center gap-2 btn-primary text-sm py-2"
          id={`view-product-${_id}`}
        >
          <FiShoppingCart size={15} />
          View Details
        </Link>
      </div>
    </div>
  )
}

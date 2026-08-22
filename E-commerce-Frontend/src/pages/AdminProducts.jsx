import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/slices/productSlice'
import { toast } from 'react-toastify'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Pink', 'Navy', 'Grey', 'Brown', 'Beige']
const CATEGORIES = ['T-Shirts', 'Shirts', 'Jeans', 'Dresses', 'Jackets', 'Trousers', 'Shorts', 'Kurtis', 'Hoodies', 'Ethnic Wear']

const emptyForm = {
  name: '', description: '', price: '', discountPrice: '', countInStock: '',
  category: '', brand: '', images: '', sizes: [], colors: [],
}

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.product)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { dispatch(fetchProducts({ limit: 100 })) }, [dispatch])

  const openCreate = () => { setForm(emptyForm); setEditingProduct(null); setShowForm(true) }
  const openEdit = (p) => {
    setForm({
      name: p.name || '', description: p.description || '', price: p.price || '',
      discountPrice: p.discountPrice || '', countInStock: p.countInStock || '',
      category: p.category || '', brand: p.brand || '',
      images: p.images?.join(', ') || '', sizes: p.sizes || [], colors: p.colors || [],
    })
    setEditingProduct(p)
    setShowForm(true)
  }

  const handleToggle = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      countInStock: Number(form.countInStock),
      images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
    }

    let result
    if (editingProduct) {
      result = await dispatch(updateProduct({ id: editingProduct._id, data: payload }))
      if (updateProduct.fulfilled.match(result)) {
        toast.success('Product updated!')
        setShowForm(false)
      } else toast.error(result.payload || 'Update failed')
    } else {
      result = await dispatch(createProduct(payload))
      if (createProduct.fulfilled.match(result)) {
        toast.success('Product created!')
        setShowForm(false)
      } else toast.error(result.payload || 'Create failed')
    }
    setSubmitting(false)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return
    const result = await dispatch(deleteProduct(id))
    if (deleteProduct.fulfilled.match(result)) toast.success('Product deleted')
    else toast.error(result.payload || 'Delete failed')
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title mb-0">Manage Products</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2" id="create-product-btn">
          <FiPlus size={18} /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Product Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. Classic White Shirt" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Price (₹) *</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Discount Price (₹)</label>
                  <input type="number" min="0" value={form.discountPrice} onChange={e => setForm({...form, discountPrice: e.target.value})} className="input-field" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Stock *</label>
                  <input type="number" min="0" value={form.countInStock} onChange={e => setForm({...form, countInStock: e.target.value})} required className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Brand</label>
                  <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="input-field" placeholder="Optional" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Image URLs (comma-separated)</label>
                  <input value={form.images} onChange={e => setForm({...form, images: e.target.value})} className="input-field" placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="input-field resize-none" />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button key={s} type="button" onClick={() => handleToggle('sizes', s)}
                      className={`px-3 py-1.5 border-2 rounded-lg text-sm font-medium transition-all ${
                        form.sizes.includes(s) ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Available Colors</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => handleToggle('colors', c)}
                      className={`px-3 py-1.5 border-2 rounded-lg text-sm font-medium transition-all ${
                        form.colors.includes(c) ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2" id="submit-product-btn">
                  {submitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck size={16} />}
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" id="cancel-product-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-200 rounded-xl" />)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">No products yet</h3>
          <button onClick={openCreate} className="btn-primary">Create First Product</button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Stock</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={p.images?.[0] || `https://placehold.co/40x48/e2e8f0/64748b?text=P`}
                            alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-gray-900 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{p.category || '—'}</td>
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-bold text-gray-900">₹{(p.discountPrice || p.price)?.toLocaleString()}</span>
                        {p.discountPrice && p.discountPrice < p.price && (
                          <span className="ml-1 text-xs text-gray-400 line-through">₹{p.price?.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={p.countInStock > 0 ? 'badge-success' : 'badge-danger'}>
                        {p.countInStock > 0 ? p.countInStock : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" id={`edit-product-${p._id}`}>
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" id={`delete-product-${p._id}`}>
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

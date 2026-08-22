import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiLock,
  FiEdit2, FiCheck, FiX,
} from 'react-icons/fi'
import { fetchProfile, updateProfile } from '../store/slices/authSlice'
import { toast } from 'react-toastify'

export default function Profile() {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.auth)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: { street: '', city: '', state: '', postalCode: '', country: 'India' },
  })

  // Sync form when user data loads
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || 'India',
        },
      })
    }
  }, [user])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAddressChange = (e) =>
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [e.target.name]: e.target.value },
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const submitData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
    }
    // Only send password if the user typed one
    if (form.password) submitData.password = form.password

    const result = await dispatch(updateProfile(submitData))

    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!')
      setEditing(false)
      setForm((prev) => ({ ...prev, password: '' }))
    } else {
      // Show the actual server error message (Bug #6 fix)
      toast.error(result.payload || 'Failed to update profile')
    }
  }

  const handleCancel = () => {
    setEditing(false)
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || 'India',
        },
      })
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-container text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Could not load profile</h3>
        <p className="text-gray-500 mb-4">
          {error || 'Please make sure you are logged in and the backend is running.'}
        </p>
        <button onClick={() => dispatch(fetchProfile())} className="btn-primary">
          Retry
        </button>
      </div>
    )
  }

  const addressLine = [
    user.address?.street,
    user.address?.city,
    user.address?.state,
    user.address?.postalCode,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title mb-0">My Profile</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary flex items-center gap-2"
              id="edit-profile-btn"
            >
              <FiEdit2 size={16} /> Edit Profile
            </button>
          )}
        </div>

        <div className="card p-8">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-600 text-3xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span
                className={`mt-1 inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  user?.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {user?.role === 'admin' ? '⚙️ Admin' : '👤 Customer'}
              </span>
            </div>
          </div>

          {!editing ? (
            /* ── View Mode ── */
            <div className="space-y-5">
              {/* Name */}
              <InfoRow icon={<FiUser />} label="Full Name" value={user?.name} />
              {/* Email */}
              <InfoRow icon={<FiMail />} label="Email" value={user?.email} />
              {/* Phone */}
              <InfoRow
                icon={<FiPhone />}
                label="Phone"
                value={user?.phone || <span className="text-gray-400 italic">Not set</span>}
              />
              {/* Address */}
              <InfoRow
                icon={<FiMapPin />}
                label="Address"
                value={
                  addressLine || <span className="text-gray-400 italic">Not set</span>
                }
              />
            </div>
          ) : (
            /* ── Edit Mode ── */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="name" name="name" type="text"
                  value={form.name} onChange={handleChange}
                  className="input-field" required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  className="input-field" required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone
                </label>
                <input
                  id="phone" name="phone" type="tel"
                  value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" className="input-field"
                />
              </div>

              {/* Address */}
              <fieldset className="border border-gray-200 rounded-xl p-4 space-y-3">
                <legend className="text-sm font-medium text-gray-700 px-1">
                  <FiMapPin className="inline mr-1" />Address
                </legend>
                <div>
                  <label htmlFor="street" className="block text-sm text-gray-600 mb-1">Street</label>
                  <input
                    id="street" name="street" type="text"
                    value={form.address.street} onChange={handleAddressChange}
                    placeholder="123 Main Street" className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="city" className="block text-sm text-gray-600 mb-1">City</label>
                    <input
                      id="city" name="city" type="text"
                      value={form.address.city} onChange={handleAddressChange}
                      placeholder="Mumbai" className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="addrState" className="block text-sm text-gray-600 mb-1">State</label>
                    <input
                      id="addrState" name="state" type="text"
                      value={form.address.state} onChange={handleAddressChange}
                      placeholder="Maharashtra" className="input-field"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm text-gray-600 mb-1">PIN Code</label>
                    <input
                      id="postalCode" name="postalCode" type="text"
                      value={form.address.postalCode} onChange={handleAddressChange}
                      placeholder="400001" maxLength={6} className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm text-gray-600 mb-1">Country</label>
                    <input
                      id="country" name="country" type="text"
                      value={form.address.country} onChange={handleAddressChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  <FiLock className="inline mr-1" />
                  New Password{' '}
                  <span className="text-gray-400 font-normal">(leave blank to keep current)</span>
                </label>
                <input
                  id="password" name="password" type="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" className="input-field"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit" disabled={loading}
                  className="btn-primary flex items-center gap-2"
                  id="save-profile-btn"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <FiCheck size={16} />}
                  Save Changes
                </button>
                <button
                  type="button" onClick={handleCancel}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FiX size={16} /> Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// Small helper component for view-mode rows
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-500">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  )
}

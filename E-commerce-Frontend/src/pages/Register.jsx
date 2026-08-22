import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { registerUser, clearError } from '../store/slices/authSlice'
import { toast } from 'react-toastify'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/')
    return () => dispatch(clearError())
  }, [isAuthenticated, navigate, dispatch])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setValidationError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setValidationError('Password must be at least 6 characters')
      return
    }
    const { confirmPassword, ...submitData } = form
    const result = await dispatch(registerUser(submitData))
    if (registerUser.fulfilled.match(result)) {
      toast.success(`Welcome to StyleHive, ${result.payload.name?.split(' ')[0]}!`)
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="text-gray-500 text-sm mt-1">Join StyleHive today</p>
          </div>

          {(error || validationError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input id="name" type="text" name="name" value={form.name} onChange={handleChange}
                  required placeholder="John Doe" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input id="email" type="email" name="email" value={form.email} onChange={handleChange}
                  required placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input id="password" type={showPass ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  required placeholder="Min. 6 characters" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input id="confirmPassword" type={showPass ? 'text' : 'password'} name="confirmPassword"
                  value={form.confirmPassword} onChange={handleChange}
                  required placeholder="Repeat password" className="input-field pl-10" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2" id="register-submit">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

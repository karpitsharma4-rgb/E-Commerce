import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminRoute({ children }) {
  const { isAuthenticated, role, loading } = useSelector((state) => state.auth)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role !== 'admin') return <Navigate to="/" replace />

  return children
}

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function RouteGate({ pendingLabel = 'Checking your account...' }) {
  return (
    <div className="px-6 py-10 text-sm text-[#666666] md:px-8">
      {pendingLabel}
    </div>
  )
}

function PrivateRoute() {
  const location = useLocation()
  const { authLoading, isAuthenticated } = useAuth()

  if (authLoading) {
    return <RouteGate />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function AdminRoute() {
  const location = useLocation()
  const { authLoading, hasAdminClaim, isAuthenticated } = useAuth()

  if (authLoading) {
    return <RouteGate pendingLabel="Checking admin access..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!hasAdminClaim) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PrivateRoute

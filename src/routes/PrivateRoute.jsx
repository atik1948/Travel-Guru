import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function RouteGate({ pendingLabel = 'Checking your account...' }) {
  return (
    <div className="px-6 py-10 text-sm text-[#666666] md:px-8">
      {pendingLabel}
    </div>
  )
}

function AdminAccessDenied() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[760px] items-center px-6 py-12 text-ink md:px-8">
      <section className="w-full rounded-[28px] border border-black/8 bg-white p-7 shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:p-9">
        <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Admin Access</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-[#111111] md:text-4xl">
          Admin access required
        </h1>
        <p className="mt-4 max-w-[560px] text-sm leading-7 text-[#666666] md:text-base">
          This dashboard is only available to accounts with a Firebase admin custom claim. Your
          current account is signed in, but it does not have admin permission.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
          >
            Go Home
          </Link>
          <Link
            to="/profile"
            className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-black/[0.04]"
          >
            Open Profile
          </Link>
        </div>
      </section>
    </main>
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
    return <AdminAccessDenied />
  }

  return <Outlet />
}

export default PrivateRoute

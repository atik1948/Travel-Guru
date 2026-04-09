import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute, { AdminRoute } from './PrivateRoute'

const mockUseAuth = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

function renderWithRoutes(routeElement) {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route element={routeElement}>
          <Route path="/protected" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PrivateRoute', () => {
  afterEach(() => {
    mockUseAuth.mockReset()
  })

  it('shows a loading state while auth is pending', () => {
    mockUseAuth.mockReturnValue({
      authLoading: true,
      isAuthenticated: false,
    })

    renderWithRoutes(<PrivateRoute />)

    expect(screen.getByText('Checking your account...')).toBeInTheDocument()
  })

  it('redirects guests to the login page', () => {
    mockUseAuth.mockReturnValue({
      authLoading: false,
      isAuthenticated: false,
    })

    renderWithRoutes(<PrivateRoute />)

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders the protected content for signed-in users', () => {
    mockUseAuth.mockReturnValue({
      authLoading: false,
      isAuthenticated: true,
    })

    renderWithRoutes(<PrivateRoute />)

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})

describe('AdminRoute', () => {
  afterEach(() => {
    mockUseAuth.mockReset()
  })

  it('redirects non-admin signed-in users to the home page', () => {
    mockUseAuth.mockReturnValue({
      authLoading: false,
      isAuthenticated: true,
      hasAdminClaim: false,
    })

    renderWithRoutes(<AdminRoute />)

    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('renders the protected content for admin users', () => {
    mockUseAuth.mockReturnValue({
      authLoading: false,
      isAuthenticated: true,
      hasAdminClaim: true,
    })

    renderWithRoutes(<AdminRoute />)

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})

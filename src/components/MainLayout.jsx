import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import logoImage from '../../logo.png'

const navItems = [
  { label: 'News', href: '/news' },
  { label: 'Destination', href: '/destination' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

function HeaderNavLink({ darkNav, to, onClick, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group rounded-full px-3 py-1.5 transition ${
          darkNav
            ? isActive
              ? 'border border-white/25 bg-white/12'
              : 'border border-transparent bg-white/0 hover:border-white/20 hover:bg-white/10'
            : isActive
              ? 'border border-black/10 bg-black/[0.05]'
              : 'border border-transparent hover:border-black/8 hover:bg-black/[0.04]'
        }`
      }
    >
      {({ isActive }) => (
        <span
          className={`relative block after:absolute after:left-0 after:top-full after:mt-1 after:h-[2px] after:w-full after:origin-left after:rounded-full after:transition-transform after:content-[''] ${
            darkNav ? 'after:bg-brand/90' : 'after:bg-brand'
          } ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 group-hover:after:scale-x-100'}`}
        >
          <span className="whitespace-nowrap">{children}</span>
        </span>
      )}
    </NavLink>
  )
}

function TravelLogo({ compact = false, dark = false }) {
  return (
    <NavLink to="/" className="inline-flex items-center">
      <img
        src={logoImage}
        alt="Travel Guru"
        decoding="async"
        fetchPriority="high"
        className={`shrink-0 object-contain ${compact ? 'h-8 w-auto md:h-9' : dark ? 'h-10 w-auto md:h-[56px]' : 'h-9 w-auto md:h-10'} ${
          dark ? 'brightness-0 invert' : ''
        }`}
      />
    </NavLink>
  )
}

function SearchBar({ dark, className = '', onSubmit }) {
  const [value, setValue] = useState('')

  if (!dark) {
    return <div className="hidden md:block md:w-40" />
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(value)
      }}
      className={`hidden items-center gap-2 rounded-md border border-white/55 bg-white/10 px-4 py-2 text-sm text-white/85 md:flex md:w-[320px] ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search your Destination..."
        aria-label="Search your destination"
        className="w-full bg-transparent outline-none placeholder:text-white/70"
      />
    </form>
  )
}

function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { hasFirebaseConfig, hasAdminClaim, isAuthenticated, logout, user } = useAuth()
  const { success, error: showError } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isSearchPage = location.pathname === '/search'
  const isHeroPage = location.pathname === '/' || location.pathname.startsWith('/booking/')
  const darkNav = isHeroPage
  const pageLabel = (() => {
    if (location.pathname === '/') return 'Home'
    if (location.pathname.startsWith('/booking/')) return 'Booking'
    if (location.pathname === '/login') return 'Login'
    if (location.pathname === '/register') return 'Create account'
    if (location.pathname === '/search') return 'Search'
    return ''
  })()
  const userLabel = user?.displayName || user?.email || 'Traveler'
  const showMobileMenuButton = !isSearchPage

  const handleDestinationSearch = (value) => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      navigate('/destination')
      setMobileMenuOpen(false)
      return
    }

    navigate(`/destination?q=${encodeURIComponent(trimmedValue)}`)
    setMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setMobileMenuOpen(false)
      success('Logged out', 'Your session has been closed successfully.')
    } catch (error) {
      console.error(error)
      showError('Logout failed', error.message || 'Unable to sign out right now.')
    }
  }

  return (
    <div className="travel-shell overflow-hidden">
      {pageLabel && !darkNav && !isSearchPage && !isAuthPage ? (
        <div className="px-6 pt-3 text-[13px] text-[#9b9b9b] md:px-8 md:pt-4">
          {pageLabel}
        </div>
      ) : null}
      <div
        className={
          isSearchPage
            ? 'mx-auto max-w-[1180px] px-[40px] py-[22px]'
            : darkNav
              ? 'relative px-0 py-0'
              : 'px-6 py-6 md:px-8 md:py-6'
        }
      >
        <header
          className={`flex flex-wrap items-center md:flex-nowrap md:justify-between ${
            darkNav
              ? isAuthenticated
                ? 'absolute inset-x-0 top-0 z-20 gap-4 px-6 py-5 text-white md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-rows-[auto_auto] md:items-center md:gap-x-6 md:gap-y-4 md:px-8 md:py-8'
                : 'absolute inset-x-0 top-0 z-20 gap-4 px-6 py-5 text-white md:grid md:grid-cols-[auto_320px_minmax(0,1fr)_auto] md:items-center md:gap-5 md:px-8 md:py-8'
              : `border-b border-black/10 ${isSearchPage ? 'gap-4 pb-[14px]' : 'gap-4 pb-5'} md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-x-10`
          }`}
        >
          <div
            className={`flex w-full items-center justify-between gap-4 ${
              darkNav
                ? isAuthenticated
                  ? 'lg:col-span-3 lg:row-start-1 lg:hidden'
                  : 'lg:hidden'
                : isSearchPage
                  ? 'md:w-auto md:flex-1 md:justify-start md:gap-6'
                  : 'lg:hidden'
            }`}
          >
            <TravelLogo compact={isSearchPage} dark={darkNav} />
            {showMobileMenuButton && (
              <button
                type="button"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((current) => !current)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition lg:hidden ${
                  darkNav
                    ? 'border border-white/20 bg-white/10 text-white hover:bg-white/16'
                    : 'border border-black/10 bg-white text-[#1f1f1f] hover:bg-black/[0.04]'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                  {mobileMenuOpen ? (
                    <path d="M6 6l12 12M18 6 6 18" />
                  ) : (
                    <>
                      <path d="M4 7h16" />
                      <path d="M4 12h16" />
                      <path d="M4 17h16" />
                    </>
                  )}
                </svg>
              </button>
            )}
          </div>

          {darkNav && isAuthenticated && (
            <div className="hidden max-w-[460px] items-center gap-4 lg:col-start-1 lg:row-start-2 lg:flex lg:justify-self-start">
              <TravelLogo dark />
              <SearchBar dark onSubmit={handleDestinationSearch} />
            </div>
          )}

          {darkNav && !isAuthenticated && (
            <div className="hidden items-center gap-4 lg:col-start-1 lg:col-span-2 lg:flex lg:justify-self-start">
              <TravelLogo dark />
              <SearchBar dark onSubmit={handleDestinationSearch} />
            </div>
          )}

          {!darkNav && !isSearchPage && (
            <div className="hidden lg:block lg:justify-self-start">
              <TravelLogo compact={isSearchPage} />
            </div>
          )}

          <nav
              className={`w-full gap-4 ${
                darkNav
                  ? `${mobileMenuOpen ? 'flex' : 'hidden'} flex-col items-start rounded-2xl border border-white/12 bg-black/28 p-4 backdrop-blur-sm ${
                      isAuthenticated
                        ? 'lg:col-start-2 lg:row-start-1'
                        : 'lg:col-start-3 lg:row-start-1'
                    } lg:flex lg:w-auto lg:flex-row lg:items-center lg:justify-center lg:justify-self-center lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none`
                  : isSearchPage
                    ? 'flex md:w-auto md:flex-none md:justify-end'
                    : `${mobileMenuOpen ? 'flex' : 'hidden'} flex-col items-start rounded-2xl border border-black/8 bg-white p-4 shadow-[0_20px_40px_rgba(0,0,0,0.08)] lg:flex lg:w-auto lg:flex-none lg:flex-row lg:items-center lg:justify-self-center lg:justify-center lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`
            }`}
          >
            <div
              className={`flex items-center font-medium ${darkNav ? 'text-white' : 'text-[#252525]'} ${
                isSearchPage
                  ? 'gap-[18px] text-[12px] md:gap-[22px]'
                  : darkNav
                    ? 'flex-col items-start gap-2 text-[13px] lg:flex-row lg:flex-nowrap lg:items-center lg:gap-6 lg:text-[14px]'
                    : 'flex-col items-start gap-2 text-[13px] lg:flex-row lg:flex-nowrap lg:items-center lg:gap-6 xl:gap-7 lg:text-[14px]'
              }`}
            >
              {navItems.map((item) => (
                <HeaderNavLink
                  key={item.label}
                  darkNav={darkNav}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </HeaderNavLink>
              ))}
              {isAuthenticated && (
                <HeaderNavLink darkNav={darkNav} to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </HeaderNavLink>
              )}
              {isAuthenticated && (
                <HeaderNavLink darkNav={darkNav} to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>
                  My Bookings
                </HeaderNavLink>
              )}
              {hasAdminClaim && (
                <HeaderNavLink darkNav={darkNav} to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </HeaderNavLink>
              )}
            </div>

            {!darkNav && !isSearchPage && (
              <div className="mt-3 flex w-full flex-col items-start gap-3 border-t border-black/8 pt-4 lg:hidden">
                {isAuthenticated ? (
                  <>
                    <span className="rounded-full border border-black/6 bg-[#f7f4eb] px-3.5 py-1.5 text-sm font-medium text-[#4b4b4b]">
                      {userLabel}
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
                  >
                    Login
                  </NavLink>
                )}
              </div>
            )}

            {darkNav && (
              <div className="mt-3 flex w-full flex-col items-start gap-3 border-t border-white/12 pt-4 lg:hidden">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-white/88">{userLabel}</span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-[14px] bg-brand px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
                  >
                    Login
                  </NavLink>
                )}
              </div>
            )}
          </nav>

          {!darkNav &&
            !isSearchPage &&
            (isAuthenticated ? (
              <div className="hidden lg:flex lg:w-auto lg:flex-none lg:justify-self-end lg:flex-row lg:items-center lg:justify-end lg:gap-3">
                <span className="rounded-full border border-black/6 bg-[#f7f4eb] px-3.5 py-1.5 text-sm font-medium text-[#4b4b4b] md:max-w-[132px] md:truncate">
                  {userLabel}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden lg:w-auto lg:flex-none lg:justify-self-end">
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
                >
                  Login
                </NavLink>
              </div>
            ))}

          {!isSearchPage &&
            darkNav &&
            (isAuthenticated ? (
              <div className="hidden max-w-[220px] items-center gap-3 lg:col-start-3 lg:row-start-2 lg:flex lg:justify-self-end">
                <span className="max-w-[96px] truncate text-sm text-white/88">{userLabel}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-[14px] bg-brand px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden lg:col-start-4 lg:row-start-1 lg:flex lg:justify-self-end">
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
                >
                  Login
                </NavLink>
              </div>
            ))}
        </header>

        {!hasFirebaseConfig && (location.pathname === '/login' || location.pathname === '/register') ? (
          <div className="mx-auto mt-24 max-w-[760px] rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900 md:mt-28">
            Firebase is not configured yet. Add your `VITE_FIREBASE_*` values to an `.env` file to enable real authentication.
          </div>
        ) : null}

        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout

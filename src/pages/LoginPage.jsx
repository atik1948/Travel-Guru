import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import SocialButton from '../components/SocialButton'
import { brandAssets } from '../data/travelData'
import { useAuth } from '../hooks/useAuth'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { useToast } from '../hooks/useToast'
import { getFirebaseErrorMessage } from '../utils/firebaseErrorMessage'

function LoginPage() {
  usePageMetadata({
    title: 'Travel Guru | Login',
    description: 'Sign in to Travel Guru to save bookings, review travel activity, and manage your account.',
  })

  const navigate = useNavigate()
  const location = useLocation()
  const { authLoading, isAuthenticated, login, loginWithGoogle, hasFirebaseConfig, sendPasswordResetEmail } = useAuth()
  const { error: showError, success } = useToast()
  const [formData, setFormData] = useState({
    identity: '',
    password: '',
    remember: false,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const nextPath = location.state?.from?.pathname || '/my-bookings'

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(nextPath, { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate, nextPath])

  if (!authLoading && isAuthenticated) {
    return <Navigate to={nextPath} replace />
  }

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.identity.trim() || !formData.password.trim()) {
      setSuccessMessage('')
      setErrorMessage('Please enter both your email and password.')
      showError('Missing fields', 'Please enter both your email and password.')
      return
    }

    if (formData.password.trim().length < 6) {
      setSuccessMessage('')
      setErrorMessage('Password must be at least 6 characters long.')
      showError('Password too short', 'Password must be at least 6 characters long.')
      return
    }
    if (!hasFirebaseConfig) {
      setSuccessMessage('')
      setErrorMessage('Firebase is not configured yet. Add your environment values first.')
      showError('Firebase missing', 'Add your environment values first.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')

    login({
      email: formData.identity.trim(),
      password: formData.password,
      remember: formData.remember,
    })
      .then(() => {
        setSuccessMessage('Login successful. Redirecting to your account...')
        success('Login successful', 'Redirecting to your account.')
        navigate(nextPath, { replace: true })
      })
      .catch((error) => {
        const message = getFirebaseErrorMessage(error, 'Unable to log in right now.')
        setSuccessMessage('')
        setErrorMessage(message)
        showError('Login failed', message)
      })
  }

  const handleGoogleLogin = () => {
    if (!hasFirebaseConfig) {
      setSuccessMessage('')
      setErrorMessage('Firebase is not configured yet. Add your environment values first.')
      showError('Firebase missing', 'Add your environment values first.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')

    loginWithGoogle()
      .then(() => {
        setSuccessMessage('Google login successful. Redirecting to your account...')
        success('Google login successful', 'Redirecting to your account.')
        navigate(nextPath, { replace: true })
      })
      .catch((error) => {
        const message = getFirebaseErrorMessage(error, 'Unable to sign in with Google right now.')
        setSuccessMessage('')
        setErrorMessage(message)
        showError('Google sign-in failed', message)
      })
  }

  const handlePasswordReset = async () => {
    if (!hasFirebaseConfig) {
      setSuccessMessage('')
      setErrorMessage('Firebase is not configured yet. Add your environment values first.')
      showError('Firebase missing', 'Add your environment values first.')
      return
    }

    if (!formData.identity.trim() || !formData.identity.includes('@')) {
      setSuccessMessage('')
      setErrorMessage('Enter a valid email address first, then request a password reset.')
      showError('Email required', 'Enter a valid email address first, then request a password reset.')
      return
    }

    try {
      setResetLoading(true)
      setErrorMessage('')
      await sendPasswordResetEmail(formData.identity)
      setSuccessMessage('Password reset email sent. Check your inbox for the next steps.')
      success('Reset email sent', 'Check your inbox for the password reset link.')
    } catch (error) {
      const message = getFirebaseErrorMessage(error, 'Unable to send a password reset email right now.')
      setSuccessMessage('')
      setErrorMessage(message)
      showError('Reset failed', message)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-190px)] max-w-125 items-center py-8 md:py-10">
      <div className="w-full">
        <div className="border border-[#c7c7c7] px-8 py-10 md:px-10">
          <h1 className="text-ink text-[32px] font-bold">Login</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block">
              <span className="sr-only">Username or Email</span>
              <input
                name="identity"
                type="text"
                value={formData.identity}
                onChange={handleChange}
                placeholder="Username or Email"
                className="w-full border-0 border-b border-[#c7c7c7] px-0 py-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="sr-only">Password</span>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border-0 border-b border-[#c7c7c7] px-0 py-3 text-sm outline-none"
              />
            </label>

            <div className="text-ink flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 accent-brand"
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={resetLoading}
                className="text-brand-deep underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {resetLoading ? 'Sending reset...' : 'Forgot Password'}
              </button>
            </div>

            {errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm font-medium text-green-700">{successMessage}</p> : null}

            <button
              type="submit"
              className="w-full rounded bg-brand px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
            >
              Login
            </button>
          </form>

          <p className="text-ink mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-deep underline underline-offset-2">
              Create an account
            </Link>
          </p>
        </div>

        <div className="auth-divider text-muted my-6 flex items-center gap-3 text-sm">
          <span>Or</span>
        </div>

        <div className="space-y-4">
          <SocialButton icon={brandAssets.facebookIcon} label="Facebook sign-in unavailable" disabled />
          <SocialButton
            icon={brandAssets.googleIcon}
            label="Continue with Google"
            onClick={handleGoogleLogin}
          />
        </div>
      </div>
    </section>
  )
}

export default LoginPage

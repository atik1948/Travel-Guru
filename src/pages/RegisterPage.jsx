import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SocialButton from '../components/SocialButton'
import { brandAssets } from '../data/travelData'
import { useAuth } from '../hooks/useAuth'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { useToast } from '../hooks/useToast'
import { getFirebaseErrorMessage } from '../utils/firebaseErrorMessage'

function RegisterPage() {
  usePageMetadata({
    title: 'Travel Guru | Create Account',
    description: 'Create a Travel Guru account to save trips, manage booking history, and continue planning across destinations.',
  })

  const navigate = useNavigate()
  const { hasFirebaseConfig, loginWithGoogle, register } = useAuth()
  const { error: showError, success } = useToast()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (Object.values(formData).some((value) => !value.trim())) {
      setSuccessMessage('')
      setErrorMessage('Please complete every field before creating an account.')
      showError('Missing fields', 'Please complete every field before creating an account.')
      return
    }

    if (!formData.email.includes('@')) {
      setSuccessMessage('')
      setErrorMessage('Please enter a valid email address.')
      showError('Invalid email', 'Please enter a valid email address.')
      return
    }

    if (formData.password.length < 6) {
      setSuccessMessage('')
      setErrorMessage('Password must be at least 6 characters long.')
      showError('Password too short', 'Password must be at least 6 characters long.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setSuccessMessage('')
      setErrorMessage('Password and confirm password must match.')
      showError('Password mismatch', 'Password and confirm password must match.')
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

    register({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    })
      .then(() => {
        setSuccessMessage('Account created successfully. Redirecting to your account...')
        success('Account created', 'Redirecting to your account.')
        navigate('/my-bookings', { replace: true })
      })
      .catch((error) => {
        const message = getFirebaseErrorMessage(error, 'Unable to create the account right now.')
        setSuccessMessage('')
        setErrorMessage(message)
        showError('Registration failed', message)
      })
  }

  const handleGoogleSignup = () => {
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
        setSuccessMessage('Google sign-up successful. Redirecting to your account...')
        success('Google sign-up successful', 'Redirecting to your account.')
        navigate('/my-bookings', { replace: true })
      })
      .catch((error) => {
        const message = getFirebaseErrorMessage(error, 'Unable to continue with Google right now.')
        setSuccessMessage('')
        setErrorMessage(message)
        showError('Google sign-up failed', message)
      })
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-190px)] max-w-130 items-center py-8 md:py-10">
      <div className="w-full">
        <div className="border border-[#c7c7c7] px-8 py-10 md:px-10">
          <h1 className="text-ink text-[32px] font-bold">Create an account</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block">
              <span className="sr-only">First Name</span>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border-0 border-b border-[#c7c7c7] px-0 py-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="sr-only">Last Name</span>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full border-0 border-b border-[#c7c7c7] px-0 py-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="sr-only">Username or Email</span>
              <input
                name="email"
                type="email"
                value={formData.email}
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
            <label className="block">
              <span className="sr-only">Confirm Password</span>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full border-0 border-b border-[#c7c7c7] px-0 py-3 text-sm outline-none"
              />
            </label>

            {errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm font-medium text-green-700">{successMessage}</p> : null}

            <button
              type="submit"
              className="w-full rounded bg-brand px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
            >
              Create an account
            </button>
          </form>

          <p className="text-ink mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-deep underline underline-offset-2">
              Login
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
            onClick={handleGoogleSignup}
          />
        </div>
      </div>
    </section>
  )
}

export default RegisterPage

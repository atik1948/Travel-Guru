import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { useToast } from '../hooks/useToast'
import { createContactMessage } from '../services/contact'
import { getFirebaseErrorMessage } from '../utils/firebaseErrorMessage'

function ContactPage() {
  usePageMetadata({
    title: 'Travel Guru | Contact',
    description: 'Contact Travel Guru for booking support, destination ideas, and travel planning questions.',
  })

  const { hasFirebaseConfig, isAuthenticated, user } = useAuth()
  const { error: showError, success } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (Object.values(formData).some((value) => !value.trim())) {
      setSuccessMessage('')
      setErrorMessage('Please complete every field before sending your message.')
      showError('Missing fields', 'Please complete every field before sending your message.')
      return
    }

    if (!formData.email.includes('@')) {
      setSuccessMessage('')
      setErrorMessage('Please enter a valid email address.')
      showError('Invalid email', 'Please enter a valid email address.')
      return
    }

    if (formData.message.trim().length < 20) {
      setSuccessMessage('')
      setErrorMessage('Message should be at least 20 characters long.')
      showError('Message too short', 'Message should be at least 20 characters long.')
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

    try {
      setSubmitting(true)
      await createContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        userId: isAuthenticated ? user?.uid ?? '' : '',
        userEmail: isAuthenticated ? user?.email ?? formData.email.trim() : formData.email.trim(),
      })

      setSuccessMessage(`Thanks ${formData.name.trim()}, your message has been sent successfully.`)
      success('Message sent', `Thanks ${formData.name.trim()}, your message has been sent successfully.`)
      setFormData({
        name: '',
        email: '',
        message: '',
      })
    } catch (error) {
      const message = getFirebaseErrorMessage(error, 'Unable to send your message right now.')
      setSuccessMessage('')
      setErrorMessage(message)
      showError('Message failed', message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-8 md:py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#f5efe0_0%,#fbfaf6_34%,#dbe5df_100%)] p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[26px] bg-white/92 p-7 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:p-8">
            <p className="text-muted text-sm font-medium uppercase tracking-[0.28em]">Contact</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] md:text-[50px]">
              Let's plan your next journey
            </h1>
            <p className="text-muted mt-5 text-[15px] leading-8">
              Reach out for booking support, destination ideas or custom travel guidance. We keep responses
              simple, useful and trip-focused.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
                <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Email</p>
                <a
                  href="mailto:wahidabdul50084@gmail.com"
                  className="mt-3 inline-flex text-lg font-semibold text-ink transition hover:opacity-75"
                >
                  wahidabdul50084@gmail.com
                </a>
              </div>
              <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
                <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Phone</p>
                <a
                  href="tel:01319384451"
                  className="mt-3 inline-flex text-lg font-semibold text-ink transition hover:opacity-75"
                >
                  01319384451
                </a>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[26px] border border-black/6 bg-white p-6 shadow-[0_22px_50px_rgba(0,0,0,0.08)] md:p-8"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm text-muted">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-black/8 bg-[#fbfbfb] px-4 py-3 outline-none transition focus:border-brand/60"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm text-muted">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-black/8 bg-[#fbfbfb] px-4 py-3 outline-none transition focus:border-brand/60"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm text-muted">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-black/8 bg-[#fbfbfb] px-4 py-3 outline-none transition focus:border-brand/60"
                />
              </div>
              {errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}
              {successMessage ? <p className="text-sm font-medium text-green-700">{successMessage}</p> : null}
              {isAuthenticated ? (
                <p className="text-xs text-[#666666]">This message will also be linked to your signed-in account.</p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:opacity-92"
              >
                {submitting ? 'Sending message...' : 'Send message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactPage

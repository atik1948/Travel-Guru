import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { brandAssets, destinations, featuredTrips, getStayById } from '../data/travelData'
import { useAuth } from '../hooks/useAuth'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { useToast } from '../hooks/useToast'
import { createBooking } from '../services/bookings'
import { getFirebaseErrorMessage } from '../utils/firebaseErrorMessage'

function formatDateValue(value) {
  if (!value) {
    return ''
  }

  const [, month, day] = value.split('-')
  return `${day}/${month}`
}

function createDefaultDates() {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 7)

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 5)

  const formatLocalDate = (value) => {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return {
    from: formatLocalDate(startDate),
    to: formatLocalDate(endDate),
  }
}

function DateField({ label, value, onChange, icon }) {
  const inputRef = useRef(null)

  const openPicker = () => {
    if (!inputRef.current) {
      return
    }

    if (typeof inputRef.current.showPicker === 'function') {
      inputRef.current.showPicker()
      return
    }

    inputRef.current.focus()
    inputRef.current.click()
  }

  return (
    <div>
      <label className="mb-2 block text-sm text-[#818181]">{label}</label>
      <button
        type="button"
        onClick={openPicker}
        className="relative flex w-full items-center justify-between rounded bg-[#f2f2f2] px-4 py-3.5 text-left text-[15px] font-semibold"
      >
        <span>{formatDateValue(value)}</span>
        <img src={icon} alt="" className="h-5 w-5 shrink-0" />
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="absolute inset-0 opacity-0"
        />
      </button>
    </div>
  )
}

function BookingPage() {
  const { slug = 'coxs-bazar' } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultDates = useMemo(() => createDefaultDates(), [])
  const destination = useMemo(
    () => destinations.find((item) => item.slug === slug) ?? destinations[0],
    [slug],
  )
  const trip = featuredTrips[destination.slug]
  const defaultDestination = trip.destination
  const selectedStay = useMemo(() => {
    const stayId = searchParams.get('stayId')
    const matchedStay = stayId ? getStayById(stayId) : null
    return matchedStay?.destinationSlug === destination.slug ? matchedStay : null
  }, [destination.slug, searchParams])
  const initialOrigin = searchParams.get('origin') || trip.origin
  const initialGuests = searchParams.get('guests') || '2'
  const initialFrom = searchParams.get('from') || defaultDates.from
  const initialTo = searchParams.get('to') || defaultDates.to
  const { hasFirebaseConfig, isAuthenticated, user } = useAuth()
  const { error: showError, success } = useToast()
  const [guestCount, setGuestCount] = useState(initialGuests)
  const [fromDate, setFromDate] = useState(initialFrom)
  const [toDate, setToDate] = useState(initialTo)
  const [formError, setFormError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  usePageMetadata({
    title: `Travel Guru | Book ${destination.shortName}`,
    description: `Plan your ${destination.shortName} trip with origin, guest count, and travel dates in the Travel Guru booking flow.`,
  })

  const backgroundStyle = {
    backgroundImage: `url(${brandAssets.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const origin = String(formData.get('origin') ?? '').trim()

    if (!origin.trim()) {
      setFormError('Please enter your origin before continuing.')
      showError('Origin required', 'Please enter your origin before continuing.')
      return
    }

    if (!fromDate || !toDate) {
      setFormError('Please choose both travel dates.')
      showError('Missing dates', 'Please choose both travel dates.')
      return
    }

    if (fromDate > toDate) {
      setFormError('The start date cannot be after the end date.')
      showError('Invalid date range', 'The start date cannot be after the end date.')
      return
    }

    setFormError('')

    const nextSearchParams = new URLSearchParams({
      destination: destination.slug,
      origin: origin.trim(),
      guests: guestCount,
      from: fromDate,
      to: toDate,
      destinationName: defaultDestination,
    })

    if (selectedStay) {
      nextSearchParams.set('stayId', String(selectedStay.id))
      nextSearchParams.set('stayTitle', selectedStay.title)
      nextSearchParams.set('stayPrice', selectedStay.price)
    }

    if (isAuthenticated && hasFirebaseConfig) {
      try {
        setBookingLoading(true)
        await createBooking({
          userId: user.uid,
          userEmail: user.email ?? '',
          userName: user.displayName ?? '',
          destinationSlug: destination.slug,
          destinationName: defaultDestination,
          origin: origin.trim(),
          guests: Number(guestCount),
          fromDate,
          toDate,
          heroTitle: trip.heroTitle,
          summary: trip.summary,
          stayId: selectedStay ? String(selectedStay.id) : '',
          stayTitle: selectedStay?.title ?? '',
          stayPrice: selectedStay?.price ?? '',
        })
      } catch (error) {
        const message = getFirebaseErrorMessage(error, 'Unable to save your booking right now.')
        setFormError(message)
        showError('Booking failed', message)
        setBookingLoading(false)
        return
      }
    }

    setBookingLoading(false)
    success(
      'Booking saved',
      isAuthenticated
        ? 'Your booking was saved and the confirmation page is ready.'
        : 'Your booking summary is ready. Sign in to save future bookings.',
    )
    navigate(`/booking-confirmation?${nextSearchParams.toString()}`)
  }

  const handleDestinationChange = (nextSlug) => {
    setFormError('')

    const nextParams = new URLSearchParams()
    const originInput = document.getElementById('booking-origin')
    const currentOrigin = originInput instanceof HTMLInputElement ? originInput.value.trim() : initialOrigin

    if (currentOrigin) {
      nextParams.set('origin', currentOrigin)
    }

    if (guestCount) {
      nextParams.set('guests', guestCount)
    }

    if (fromDate) {
      nextParams.set('from', fromDate)
    }

    if (toDate) {
      nextParams.set('to', toDate)
    }

    if (selectedStay?.destinationSlug === nextSlug) {
      nextParams.set('stayId', String(selectedStay.id))
      nextParams.set('stayTitle', selectedStay.title)
      nextParams.set('stayPrice', selectedStay.price)
    }

    navigate(`/booking/${nextSlug}${nextParams.toString() ? `?${nextParams.toString()}` : ''}`)
  }

  return (
    <section className="overflow-hidden rounded-sm" style={backgroundStyle}>
      <div className="hero-overlay min-h-[calc(100vh-180px)] px-6 pb-10 pt-48 md:px-10 md:pb-14 md:pt-44">
        <div className="flex min-h-160 flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[430px] text-white">
            <h1 className="font-display text-[58px] leading-[0.9] uppercase tracking-[1px] md:text-[88px] md:leading-[0.9]">
              {trip.heroTitle}
            </h1>
            <p className="mt-5 max-w-[390px] text-sm leading-8 text-white/88">
              {trip.summary}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[390px] rounded-[6px] bg-white p-5 text-ink shadow-[0_30px_60px_rgba(0,0,0,0.18)]"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="booking-origin" className="mb-2 block text-sm text-[#818181]">
                  Origin
                </label>
                <input
                  key={destination.slug}
                  id="booking-origin"
                  name="origin"
                  defaultValue={initialOrigin}
                  className="w-full rounded bg-[#f2f2f2] px-4 py-3.5 text-[15px] font-semibold outline-none"
                />
              </div>

              <div>
                <label htmlFor="booking-destination" className="mb-2 block text-sm text-[#818181]">
                  Destination
                </label>
                <select
                  id="booking-destination"
                  value={destination.slug}
                  onChange={(event) => handleDestinationChange(event.target.value)}
                  className="w-full rounded bg-[#f2f2f2] px-4 py-3.5 text-[15px] font-semibold outline-none"
                >
                  {destinations.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.shortName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="booking-guests" className="mb-2 block text-sm text-[#818181]">
                  Guests
                </label>
                <select
                  id="booking-guests"
                  value={guestCount}
                  onChange={(event) => setGuestCount(event.target.value)}
                  className="w-full rounded bg-[#f2f2f2] px-4 py-3.5 text-[15px] font-semibold outline-none"
                >
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5 guests</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DateField
                  label="From"
                  value={fromDate}
                  onChange={setFromDate}
                  icon={brandAssets.calendarIcon}
                />

                <DateField
                  label="To"
                  value={toDate}
                  onChange={setToDate}
                  icon={brandAssets.calendarIcon}
                />
              </div>

              {selectedStay ? (
                <div className="rounded-[16px] border border-black/8 bg-[#fbfbfb] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b7b7b]">
                    Selected stay
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink">{selectedStay.title}</p>
                  <p className="mt-1 text-xs text-[#666666]">{selectedStay.price}</p>
                </div>
              ) : null}

              {formError ? <p className="text-sm font-medium text-red-600">{formError}</p> : null}
              {isAuthenticated ? (
                <p className="text-xs text-[#666666]">This booking will be saved to your account.</p>
              ) : (
                <p className="text-xs text-[#666666]">Sign in to save bookings to your account history.</p>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="mt-2 w-full rounded bg-brand px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
              >
                {bookingLoading ? 'Saving booking...' : 'Start Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default BookingPage


import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { subscribeToUserBookings, requestBookingCancellation } from '../services/bookings'
import { useToast } from '../hooks/useToast'
import { getStayById } from '../data/travelData'

function formatBookingDate(value) {
  if (!value) {
    return 'Date not set'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getStatusStyles(status) {
  if (status === 'confirmed') {
    return 'bg-emerald-100 text-emerald-700'
  }

  if (status === 'cancel-requested') {
    return 'bg-orange-100 text-orange-700'
  }

  if (status === 'cancelled') {
    return 'bg-red-100 text-red-700'
  }

  return 'bg-amber-100 text-amber-700'
}

function getStatusCopy(status) {
  if (status === 'confirmed') {
    return 'Confirmed'
  }

  if (status === 'cancel-requested') {
    return 'Awaiting Cancellation Review'
  }

  if (status === 'cancelled') {
    return 'Cancelled'
  }

  return 'Pending'
}

function MyBookingsPage() {
  usePageMetadata({
    title: 'Travel Guru | My Bookings',
    description: 'Review saved bookings, track trip status, and request cancellations from your Travel Guru account.',
  })

  const { hasFirebaseConfig, user } = useAuth()
  const { error: showError, success } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(hasFirebaseConfig)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestingId, setRequestingId] = useState('')

  useEffect(() => {
    if (!user?.uid) {
      return undefined
    }

    const unsubscribe = subscribeToUserBookings(
      user.uid,
      (nextBookings) => {
        setBookings(nextBookings)
        setLoading(false)
        setErrorMessage('')
      },
      (error) => {
        setErrorMessage(error.message || 'Unable to load your bookings right now.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user?.uid])

  const handleCancellationRequest = async (bookingId) => {
    try {
      setRequestingId(bookingId)
      await requestBookingCancellation(bookingId)
      success('Request sent', 'Your cancellation request is now waiting for admin review.')
    } catch (error) {
      console.error(error)
      showError('Request failed', error.message || 'Unable to request cancellation right now.')
    } finally {
      setRequestingId('')
    }
  }

  return (
    <section className="py-8 md:py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#f5efe0_0%,#fbfaf6_34%,#dbe5df_100%)] p-6 md:p-8">
        <div className="rounded-[26px] bg-white/92 p-7 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:p-8">
          <p className="text-muted text-sm font-medium uppercase tracking-[0.28em]">Account</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.08] md:text-[50px]">
            Welcome back{user?.displayName ? `, ${user.displayName}` : ''}.
          </h1>
          <p className="text-muted mt-5 max-w-[620px] text-[15px] leading-8">
            Review and manage your saved trips in one place. Bookings created from the reservation
            flow will appear here automatically when your Firebase and Firestore setup is active.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Signed In As</p>
              <p className="mt-3 text-lg font-semibold text-ink">{user?.email ?? 'Unknown user'}</p>
            </div>
            <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Next Upgrade</p>
              <p className="mt-3 text-lg font-semibold text-ink">Booking history is now Firestore-ready</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-ink">Saved Bookings</h2>

            {loading ? <p className="text-muted mt-4 text-sm">Loading your bookings...</p> : null}
            {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}

            {!loading && !errorMessage && bookings.length === 0 ? (
              <div className="mt-4 rounded-[20px] border border-dashed border-black/10 bg-[#fbfbfb] p-5 text-sm text-[#666666]">
                No bookings saved yet. Create one from a destination booking page while logged in.
              </div>
            ) : null}

            {!loading && !errorMessage && bookings.length > 0 ? (
              <div className="mt-5 grid gap-4">
                {bookings.map((booking) => (
                  (() => {
                    const stayImage = booking.stayId ? getStayById(booking.stayId)?.image : null

                    return (
                      <article
                        key={booking.id}
                        className="overflow-hidden rounded-[24px] border border-black/6 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
                      >
                        <div className="grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]">
                          <div className="relative min-h-[220px] bg-[linear-gradient(180deg,#f5efe0_0%,#eef4ef_100%)]">
                            {stayImage ? (
                              <img
                                src={stayImage}
                                alt={booking.stayTitle || booking.destinationName}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-end bg-[linear-gradient(160deg,#f4ebda_0%,#dde9df_100%)] p-5">
                                <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a6a49]">
                                  Saved trip
                                </span>
                              </div>
                            )}
                            <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a5d18] shadow-[0_10px_22px_rgba(0,0,0,0.06)]">
                              {booking.destinationName}
                            </div>
                          </div>

                          <div className="p-5 md:p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div className="max-w-[470px]">
                                <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">
                                  Booking Snapshot
                                </p>
                                <h3 className="mt-2 text-[28px] font-semibold leading-[1.1] text-ink">
                                  {booking.heroTitle}
                                </h3>
                                {booking.stayTitle ? (
                                  <p className="mt-3 text-sm font-medium text-[#5f5f5f]">
                                    Stay: {booking.stayTitle}
                                    {booking.stayPrice ? ` | ${booking.stayPrice}` : ''}
                                  </p>
                                ) : (
                                  <p className="mt-3 text-sm font-medium text-[#5f5f5f]">
                                    Destination-led booking without a selected stay
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-start gap-2 md:items-end">
                                <div className="rounded-full bg-brand/16 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f5c07]">
                                  {formatBookingDate(booking.fromDate)} to {formatBookingDate(booking.toDate)}
                                </div>
                                <span
                                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${getStatusStyles(
                                    booking.status,
                                  )}`}
                                >
                                  {getStatusCopy(booking.status)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-5 grid gap-3 md:grid-cols-3">
                              <div className="rounded-[18px] border border-black/6 bg-[#fbfbfb] px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b7b7b]">
                                  Route
                                </p>
                                <p className="mt-2 text-sm font-medium text-ink">
                                  {booking.origin} to {booking.destinationName}
                                </p>
                              </div>
                              <div className="rounded-[18px] border border-black/6 bg-[#fbfbfb] px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b7b7b]">
                                  Guest Fit
                                </p>
                                <p className="mt-2 text-sm font-medium text-ink">
                                  {booking.guests} guest{booking.guests === 1 ? '' : 's'}
                                </p>
                              </div>
                              <div className="rounded-[18px] border border-black/6 bg-[#fbfbfb] px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b7b7b]">
                                  Booking State
                                </p>
                                <p className="mt-2 text-sm font-medium text-ink">
                                  {booking.status === 'cancel-requested'
                                    ? 'Waiting for admin review'
                                    : booking.status === 'cancelled'
                                      ? 'No longer active'
                                      : booking.status === 'confirmed'
                                        ? 'Ready for travel'
                                        : 'Saved in your account'}
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/6 pt-4">
                              <p className="max-w-[520px] text-sm leading-7 text-[#666666]">
                                {booking.status === 'cancel-requested'
                                  ? 'Cancellation request sent. Waiting for admin approval.'
                                  : booking.status === 'cancelled'
                                    ? 'This booking was cancelled and is now kept only for history.'
                                    : booking.status === 'confirmed'
                                      ? 'Your booking is confirmed. Keep this summary ready for your trip.'
                                      : 'Need to change plans? Send a cancellation request for admin review.'}
                              </p>
                              {booking.status !== 'cancelled' && booking.status !== 'cancel-requested' ? (
                                <button
                                  type="button"
                                  disabled={requestingId === booking.id}
                                  onClick={() => handleCancellationRequest(booking.id)}
                                  className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  {requestingId === booking.id ? 'Sending...' : 'Request Cancel'}
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })()
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBookingsPage

import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { subscribeToUserBookings } from '../services/bookings'

function formatDisplayDate(value) {
  if (!value) {
    return 'Not available'
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
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

function ProfilePage() {
  usePageMetadata({
    title: 'Travel Guru | Profile',
    description: 'View your Travel Guru traveler profile, recent activity, favorite destination, and quick account actions.',
  })

  const { hasFirebaseConfig, hasAdminClaim, user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(hasFirebaseConfig)
  const [errorMessage, setErrorMessage] = useState('')

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
        setErrorMessage(error.message || 'Unable to load your profile activity right now.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user?.uid])

  const bookingCounts = useMemo(
    () => ({
      total: bookings.length,
      confirmed: bookings.filter((booking) => booking.status === 'confirmed').length,
      pending: bookings.filter((booking) => booking.status === 'pending' || !booking.status).length,
    }),
    [bookings],
  )

  const latestBooking = bookings[0] || null
  const favoriteDestination = useMemo(() => {
    if (!bookings.length) {
      return 'No trips yet'
    }

    const counts = bookings.reduce((accumulator, booking) => {
      const key = booking.destinationName || 'Unknown destination'
      accumulator[key] = (accumulator[key] || 0) + 1
      return accumulator
    }, {})

    return Object.entries(counts).sort((left, right) => right[1] - left[1])[0][0]
  }, [bookings])

  return (
    <section className="py-8 md:py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#eef2ff_0%,#f8fafc_40%,#e8f5e9_100%)] p-6 md:p-8">
        <div className="rounded-[26px] bg-white/95 p-7 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-muted text-sm font-medium uppercase tracking-[0.28em]">Profile</p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] md:text-[50px]">
                {user?.displayName || 'Traveler account'}
              </h1>
              <p className="text-muted mt-5 max-w-[640px] text-[15px] leading-8">
                Manage your account, review trip activity, and keep track of your latest booking
                updates.
              </p>
            </div>

            <div className="rounded-[22px] border border-black/6 bg-[#f8f9fb] px-5 py-4">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Role</p>
              <p className="mt-3 text-lg font-semibold text-ink">
                {hasAdminClaim ? 'Admin traveler' : 'Traveler'}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">
                Signed In As
              </p>
              <p className="mt-3 break-all text-lg font-semibold text-ink">
                {user?.email ?? 'Unknown user'}
              </p>
            </div>
            <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">
                Trips Saved
              </p>
              <p className="mt-3 text-lg font-semibold text-ink">{bookingCounts.total}</p>
            </div>
            <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">
                Confirmed Trips
              </p>
              <p className="mt-3 text-lg font-semibold text-ink">{bookingCounts.confirmed}</p>
            </div>
            <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">
                Pending Trips
              </p>
              <p className="mt-3 text-lg font-semibold text-ink">{bookingCounts.pending}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[24px] border border-black/6 bg-[#fbfbfb] p-6">
              <h2 className="text-2xl font-semibold text-ink">Travel Snapshot</h2>
              <div className="mt-5 space-y-4 text-sm text-[#555555]">
                <div className="rounded-[18px] bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777777]">
                    Favorite Destination
                  </p>
                  <p className="mt-2 text-lg font-semibold text-ink">{favoriteDestination}</p>
                </div>
                <div className="rounded-[18px] bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777777]">
                    Latest Booking
                  </p>
                  <p className="mt-2 text-lg font-semibold text-ink">
                    {latestBooking?.destinationName || 'No booking created yet'}
                  </p>
                  <p className="mt-2 leading-7">
                    {latestBooking
                      ? `${latestBooking.origin} to ${latestBooking.destinationName} for ${latestBooking.guests} guest${latestBooking.guests === 1 ? '' : 's'}`
                      : 'Your next destination will appear here once you save a booking.'}
                  </p>
                </div>
                <div className="rounded-[18px] bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777777]">
                    Most Recent Travel Dates
                  </p>
                  <p className="mt-2 text-lg font-semibold text-ink">
                    {latestBooking
                      ? `${formatDisplayDate(latestBooking.fromDate)} to ${formatDisplayDate(latestBooking.toDate)}`
                      : 'Not available'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-black/6 bg-[#fbfbfb] p-6">
              <h2 className="text-2xl font-semibold text-ink">Quick Actions</h2>
              <div className="mt-5 grid gap-3">
                <NavLink
                  to="/my-bookings"
                  className="rounded-[18px] bg-white px-4 py-4 text-sm font-semibold text-ink transition hover:bg-[#f3f3f3]"
                >
                  Open My Bookings
                </NavLink>
                <NavLink
                  to="/destination"
                  className="rounded-[18px] bg-white px-4 py-4 text-sm font-semibold text-ink transition hover:bg-[#f3f3f3]"
                >
                  Explore Destinations
                </NavLink>
                <NavLink
                  to="/contact"
                  className="rounded-[18px] bg-white px-4 py-4 text-sm font-semibold text-ink transition hover:bg-[#f3f3f3]"
                >
                  Contact Travel Guru
                </NavLink>
                {hasAdminClaim ? (
                  <NavLink
                    to="/admin"
                    className="rounded-[18px] bg-brand/20 px-4 py-4 text-sm font-semibold text-ink transition hover:bg-brand/30"
                  >
                    Open Admin Dashboard
                  </NavLink>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-ink">Recent Activity</h2>

            {loading ? <p className="text-muted mt-4 text-sm">Loading your profile activity...</p> : null}
            {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}

            {!loading && !errorMessage && bookings.length === 0 ? (
              <div className="mt-4 rounded-[20px] border border-dashed border-black/10 bg-[#fbfbfb] p-5 text-sm text-[#666666]">
                No activity yet. Save a booking to start building your travel history.
              </div>
            ) : null}

            {!loading && !errorMessage && bookings.length > 0 ? (
              <div className="mt-5 grid gap-4">
                {bookings.slice(0, 3).map((booking) => (
                  <article
                    key={booking.id}
                    className="rounded-[20px] border border-black/6 bg-[#fbfbfb] p-5 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">
                          {booking.destinationName}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-ink">{booking.heroTitle}</h3>
                        <p className="text-muted mt-3 text-sm leading-7">
                          {booking.origin} to {booking.destinationName} for {booking.guests} guest
                          {booking.guests === 1 ? '' : 's'}
                        </p>
                      </div>
                      <span className="rounded-full bg-brand/16 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f5c07]">
                        {booking.status || 'pending'}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage

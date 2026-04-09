import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePageMetadata } from '../hooks/usePageMetadata'

function formatDate(value) {
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

function BookingConfirmationPage() {
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const destination = searchParams.get('destinationName') ?? 'Your trip'
  const origin = searchParams.get('origin') ?? 'Dhaka'
  const guests = searchParams.get('guests') ?? '1'
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const stayTitle = searchParams.get('stayTitle') ?? ''
  const stayPrice = searchParams.get('stayPrice') ?? ''

  usePageMetadata({
    title: `Travel Guru | ${destination} Booking Ready`,
    description: `Review your ${destination} booking summary, guest count, and travel dates before checking matching stays.`,
  })

  return (
    <section className="py-8 md:py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#f5efe0_0%,#fbfaf6_34%,#dbe5df_100%)] p-6 md:p-8">
        <div className="rounded-[26px] bg-white/92 p-7 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:p-8">
          <p className="text-muted text-sm font-medium uppercase tracking-[0.28em]">Booking Ready</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.08] md:text-[50px]">
            Your {destination} trip is confirmed in the app flow
          </h1>
          <p className="text-muted mt-5 max-w-[620px] text-[15px] leading-8">
            Your booking summary is ready. You can now review matching stays or jump to your saved
            bookings to confirm the entry stored in your account.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Route</p>
              <p className="mt-3 text-lg font-semibold text-ink">
                {origin} to {destination}
              </p>
            </div>
            <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Travel Window</p>
              <p className="mt-3 text-lg font-semibold text-ink">
                {formatDate(from)} to {formatDate(to)}
              </p>
            </div>
            <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Guests</p>
              <p className="mt-3 text-lg font-semibold text-ink">
                {guests} guest{guests === '1' ? '' : 's'}
              </p>
            </div>
            <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Account Status</p>
              <p className="mt-3 text-lg font-semibold text-ink">
                {isAuthenticated ? 'Saved to My Bookings' : 'Guest flow only'}
              </p>
            </div>
            {stayTitle ? (
              <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5 md:col-span-2">
                <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Selected Stay</p>
                <p className="mt-3 text-lg font-semibold text-ink">
                  {stayTitle}{stayPrice ? ` (${stayPrice})` : ''}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/search?${searchParams.toString()}`}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold !text-white transition hover:opacity-90"
            >
              View matching stays
            </Link>
            <Link
              to={isAuthenticated ? '/my-bookings' : '/login'}
              className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium text-ink transition hover:bg-black/[0.04]"
            >
              {isAuthenticated ? 'Open My Bookings' : 'Sign in to save more'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookingConfirmationPage

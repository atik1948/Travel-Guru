import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { brandAssets, getDestinationBySlug, getStayById } from '../data/travelData'
import { usePageMetadata } from '../hooks/usePageMetadata'

function formatDateLabel(value) {
  if (!value) {
    return 'Choose dates in the booking form'
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

function StayDetailsPage() {
  const { stayId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const stay = getStayById(stayId)
  const destination = stay ? getDestinationBySlug(stay.destinationSlug) : null
  const destinationName = destination?.shortName || searchParams.get('destinationName') || 'Destination'
  const guests = searchParams.get('guests') ?? ''
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const origin = searchParams.get('origin') ?? ''

  usePageMetadata({
    title: stay ? `Travel Guru | ${stay.title}` : 'Travel Guru | Stay Details',
    description:
      stay?.amenities || 'Review stay details, features, and booking context for your selected destination.',
  })

  if (!stay || !destination) {
    return <Navigate to="/destination" replace />
  }

  const bookingParams = new URLSearchParams({
    ...(origin ? { origin } : {}),
    ...(guests ? { guests } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    stayId: String(stay.id),
    stayTitle: stay.title,
    stayPrice: stay.price,
  })

  return (
    <section className="py-8 md:py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#f5efe0_0%,#fbfaf6_34%,#dbe5df_100%)] p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[26px] border border-black/6 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
            <img
              src={stay.image}
              alt={stay.title}
              className="h-[320px] w-full object-cover md:h-[420px]"
              loading="lazy"
              decoding="async"
            />
            <div className="p-6 md:p-8">
              <p className="text-muted text-sm font-medium uppercase tracking-[0.28em]">{destinationName}</p>
              <h1 className="mt-4 max-w-[460px] text-3xl font-semibold leading-[1.08] text-ink md:text-[40px]">
                {stay.title}
              </h1>
              <p className="text-muted mt-5 text-[15px] leading-8">
                A stay option selected from your {destinationName} search results, designed for a calm and
                comfortable trip flow.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
                  <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Stay details</p>
                  <p className="mt-3 text-sm leading-7 text-[#555555]">{stay.details}</p>
                </div>
                <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
                  <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Amenities</p>
                  <p className="mt-3 text-sm leading-7 text-[#555555]">{stay.amenities}</p>
                </div>
                <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
                  <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Flexibility</p>
                  <p className="mt-3 text-sm leading-7 text-[#555555]">{stay.flexibility}</p>
                </div>
                <div className="rounded-[20px] border border-black/6 bg-[#f8f7f2] p-5">
                  <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Guest rating</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    <img src={brandAssets.starIcon} alt="" className="h-4 w-4" />
                    {stay.rating} ({stay.reviews} reviews)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-black/6 bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.08)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-muted text-sm font-medium uppercase tracking-[0.28em]">Booking Snapshot</p>
                <h2 className="mt-4 text-2xl font-semibold leading-[1.1] text-ink md:text-[32px]">Trip summary</h2>
              </div>
              <div className="rounded-full border border-brand/20 bg-brand/12 px-4 py-2 text-sm font-semibold text-[#8f5c07] shadow-[0_8px_18px_rgba(0,0,0,0.04)]">
                {stay.price} / night
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[20px] border border-black/6 bg-[#fbfbfb] p-5">
                <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Destination</p>
                <p className="mt-3 text-lg font-semibold text-ink">{destinationName}</p>
              </div>
              <div className="rounded-[20px] border border-black/6 bg-[#fbfbfb] p-5">
                <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Route</p>
                <p className="mt-3 text-lg font-semibold text-ink">
                  {origin ? `${origin} to ${destinationName}` : `Trip to ${destinationName}`}
                </p>
              </div>
              <div className="rounded-[20px] border border-black/6 bg-[#fbfbfb] p-5">
                <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Travel window</p>
                <p className="mt-3 text-lg font-semibold text-ink">
                  {from && to ? `${formatDateLabel(from)} to ${formatDateLabel(to)}` : 'Choose dates in the booking form'}
                </p>
              </div>
              <div className="rounded-[20px] border border-black/6 bg-[#fbfbfb] p-5">
                <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Guest fit</p>
                <p className="mt-3 text-lg font-semibold text-ink">
                  {guests ? `Planned for ${guests} guest${guests === '1' ? '' : 's'}` : stay.details}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/booking/${destination.slug}?${bookingParams.toString()}`}
                className="rounded-full bg-ink px-5 py-3 text-sm font-semibold !text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition hover:translate-y-[-1px] hover:opacity-92"
              >
                Book this stay
              </Link>
              <Link
                to={`/search?${searchParams.toString()}`}
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-black/[0.03]"
              >
                Back to matching stays
              </Link>
            </div>

            <div className="mt-8 rounded-[22px] border border-black/6 bg-[#fbfbfb] p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-[0.24em]">Stay Highlights</p>
              <div className="mt-4 grid gap-3 text-sm text-[#555555]">
                <div className="rounded-[16px] bg-white px-4 py-3">
                  <span className="font-semibold text-ink">Best for:</span> Relaxed trips, clean booking flow,
                  and easy destination access.
                </div>
                <div className="rounded-[16px] bg-white px-4 py-3">
                  <span className="font-semibold text-ink">Flexible option:</span> {stay.flexibility}
                </div>
                <div className="rounded-[16px] bg-white px-4 py-3">
                  <span className="font-semibold text-ink">Good to know:</span> This stay appears in your
                  selected destination results based on the current search filters.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StayDetailsPage

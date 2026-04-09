import { Link, useSearchParams } from 'react-router-dom'
import { destinations, stays } from '../data/travelData'
import { usePageMetadata } from '../hooks/usePageMetadata'

function buildBookingLink(destinationSlug, featuredStay) {
  const nextParams = new URLSearchParams()

  if (featuredStay) {
    nextParams.set('stayId', String(featuredStay.id))
    nextParams.set('stayTitle', featuredStay.title)
    nextParams.set('stayPrice', featuredStay.price)
  }

  return `/booking/${destinationSlug}${nextParams.toString() ? `?${nextParams.toString()}` : ''}`
}

function DestinationPage() {
  const [searchParams] = useSearchParams()
  const rawQuery = searchParams.get('q') ?? ''
  const normalizedQuery = rawQuery.trim().toLowerCase()
  const filteredDestinations = normalizedQuery
    ? destinations.filter((destination) =>
        [
          destination.shortName,
          destination.region,
          destination.location,
          destination.highlightLabel,
          destination.description,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : destinations
  const isSingleResult = filteredDestinations.length === 1
  const showFeaturedSection = !isSingleResult

  usePageMetadata({
    title: normalizedQuery
      ? `Travel Guru | Search Destinations For "${rawQuery}"`
      : 'Travel Guru | Destinations',
    description: normalizedQuery
      ? `Browse Travel Guru destination matches for ${rawQuery} across Bangladesh travel routes and moods.`
      : 'Explore destination ideas across Bangladesh, from beach stays to tea gardens and river adventures.',
  })

  return (
    <section className="py-8 md:py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#f5efe0_0%,#fbfaf6_34%,#dbe5df_100%)] p-6 md:p-8">
        <div className="max-w-[1120px] rounded-[26px] bg-white/92 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:px-8 md:py-6">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-muted text-sm font-medium uppercase tracking-[0.28em]">Explore Bangladesh</p>
              <h1 className="mt-2 max-w-[620px] text-[42px] font-semibold leading-[1.03] text-ink md:text-[46px]">
                Choose a destination that matches your mood
              </h1>
            </div>

            <p className="max-w-[430px] text-[14px] leading-[1.9] text-[#666666] lg:justify-self-start lg:self-center">
              Coastal calm, misty tea gardens or bold river adventures. Each route below keeps the same Travel
              Guru feel while offering a different kind of trip.
            </p>
          </div>
        </div>

        {normalizedQuery ? (
          <div className="mt-6 inline-flex rounded-full border border-black/6 bg-white/88 px-4 py-2 text-sm text-[#575757] shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
            {filteredDestinations.length
              ? `Showing ${filteredDestinations.length} destination result${filteredDestinations.length === 1 ? '' : 's'} for "${rawQuery}".`
              : `No destinations matched "${rawQuery}".`}
          </div>
        ) : null}

        <div className={`mt-8 grid gap-6 ${isSingleResult ? 'lg:grid-cols-1' : 'lg:grid-cols-3'}`}>
          {filteredDestinations.map((destination) => {
            const featuredStay = stays.find((stay) => stay.destinationSlug === destination.slug)
            const bookingLink = buildBookingLink(destination.slug, featuredStay)

            return (
              <article
                key={destination.slug}
                className={`group flex h-full flex-col overflow-hidden rounded-[26px] border border-black/6 bg-white shadow-[0_22px_50px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 ${
                  isSingleResult ? 'lg:grid lg:grid-cols-[0.88fr_1.12fr]' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={destination.image}
                    alt={destination.shortName}
                    loading="lazy"
                    decoding="async"
                    className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
                      isSingleResult ? 'h-[340px] lg:h-full' : 'h-[290px]'
                    }`}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/78">
                      {destination.location}
                    </p>
                    <h2 className="mt-2 text-4xl font-semibold text-white">{destination.shortName}</h2>
                  </div>
                </div>

                <div className={`flex flex-1 flex-col p-6 ${isSingleResult ? 'lg:p-9' : ''}`}>
                  <div className="mb-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b7b7b]">
                    <span className="rounded-full bg-[#f3f3f3] px-3 py-1">{destination.highlightLabel}</span>
                    <span className="rounded-full bg-[#f3f3f3] px-3 py-1">{destination.bestSeason}</span>
                  </div>
                  <p
                    className={`text-muted mt-3 text-sm leading-7 ${
                      isSingleResult ? 'max-w-[560px]' : 'min-h-[112px]'
                    }`}
                  >
                    {destination.description}
                  </p>
                  <div
                    className={`mt-6 grid gap-3 text-sm text-[#5f5f5f] ${
                      isSingleResult ? 'md:grid-cols-3 md:gap-5' : 'min-h-[138px]'
                    }`}
                  >
                    <p>
                      <span className="font-semibold text-ink">Region:</span> {destination.region}
                    </p>
                    <p>
                      <span className="font-semibold text-ink">Travel time:</span> {destination.travelTime}
                    </p>
                    <p>
                      <span className="font-semibold text-ink">Weather:</span> {destination.weather}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-3">
                    <Link
                      to={bookingLink}
                      className="inline-flex items-center self-start rounded-full bg-ink px-5 py-3 text-sm font-semibold !text-white transition hover:opacity-92"
                    >
                      Start booking
                    </Link>
                    {isSingleResult ? (
                      <Link
                        to={`/search?destination=${destination.slug}&destinationName=${destination.shortName}`}
                        className="inline-flex items-center self-start rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-black/[0.03]"
                      >
                        View matching stays
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {showFeaturedSection ? (
          <div className="mt-10 grid gap-6">
            {filteredDestinations.map((destination) => {
              const destinationStays = stays.filter((stay) => stay.destinationSlug === destination.slug)
              const featuredStay = destinationStays[0]
              const bookingLink = buildBookingLink(destination.slug, featuredStay)

              return (
                <article
                  key={`${destination.slug}-details`}
                  className="overflow-hidden rounded-[30px] border border-black/6 bg-white shadow-[0_22px_50px_rgba(0,0,0,0.08)]"
                >
                  <div className="grid gap-0 xl:grid-cols-[1fr_1fr]">
                    <div className="bg-[linear-gradient(180deg,#f8f7f2_0%,#f3f1ea_100%)] p-4 md:p-5">
                      <div className="grid gap-3 md:grid-cols-[1.12fr_0.88fr]">
                        <img
                          src={destination.gallery[0]}
                          alt={`${destination.shortName} main view`}
                          loading="lazy"
                          decoding="async"
                          className="h-[280px] w-full rounded-[24px] object-cover shadow-[0_14px_30px_rgba(0,0,0,0.08)] md:h-[520px]"
                        />

                        <div className="grid gap-3">
                          {destination.gallery.slice(1).map((image, index) => (
                            <img
                              key={`${destination.slug}-gallery-${index}`}
                              src={image}
                              alt={`${destination.shortName} gallery ${index + 2}`}
                              loading="lazy"
                              decoding="async"
                              className="h-[134px] w-full rounded-[24px] object-cover shadow-[0_14px_30px_rgba(0,0,0,0.08)] md:h-[253px]"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 rounded-[24px] bg-white/82 px-5 py-5 shadow-[0_16px_36px_rgba(0,0,0,0.05)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a8a8a]">
                          Why travelers choose it
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[#5c5c5c]">
                          {destination.shortName} brings together {destination.highlightLabel.toLowerCase()}, seasonal
                          comfort, and a route that feels distinct from the rest of the country.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#777777]">
                          <span className="rounded-full bg-[#f3f3f3] px-3 py-1.5">{destination.location}</span>
                          <span className="rounded-full bg-[#f3f3f3] px-3 py-1.5">{destination.bestSeason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 lg:p-10">
                      <div className="rounded-[24px] border border-black/6 bg-[#fbfbfb] p-5 md:p-6">
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[18px] font-semibold text-ink">Suggested stay</h3>
                            <p className="mt-1 text-sm leading-6 text-[#777777]">
                              A sample stay that fits this destination mood.
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5f5f5f] shadow-[0_8px_18px_rgba(0,0,0,0.03)]">
                            {featuredStay?.price || 'Price soon'}
                          </span>
                        </div>

                        {featuredStay ? (
                          <div className="rounded-[22px] border border-black/6 bg-white p-4 shadow-[0_14px_30px_rgba(0,0,0,0.04)]">
                            <img
                              src={featuredStay.image}
                              alt={featuredStay.title}
                              loading="lazy"
                              decoding="async"
                              className="h-[220px] w-full rounded-[18px] object-cover"
                            />

                            <div className="mt-4">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <h4 className="max-w-[360px] text-[18px] font-semibold leading-7 text-ink">
                                  {featuredStay.title}
                                </h4>
                                <span className="rounded-full bg-[#f8f7f2] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b7b7b]">
                                  {featuredStay.total}
                                </span>
                              </div>

                              <div className="mt-3 space-y-1.5 text-sm leading-7 text-[#5d5d5d]">
                                <p>{featuredStay.details}</p>
                                <p>{featuredStay.amenities}</p>
                                <p>{featuredStay.flexibility}</p>
                              </div>

                              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                                <span className="rounded-full bg-[#f8f7f2] px-3 py-1.5 font-semibold text-ink">
                                  {featuredStay.rating} rating
                                </span>
                                <span className="font-medium text-[#6a6a6a]">{featuredStay.price}</span>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <Link
                          to={bookingLink}
                          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold !text-white transition hover:opacity-92"
                        >
                          Book this destination
                        </Link>
                        <Link
                          to={`/search?destination=${destination.slug}&destinationName=${destination.shortName}`}
                          className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-black/[0.03]"
                        >
                          View matching stays
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}

        {normalizedQuery && filteredDestinations.length === 0 ? (
          <div className="mt-10 rounded-[26px] border border-dashed border-black/10 bg-white/70 p-8 text-center text-sm text-[#666666]">
            Try searching for a place like Cox&apos;s Bazar, Sreemangal, or Sundarbans.
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default DestinationPage

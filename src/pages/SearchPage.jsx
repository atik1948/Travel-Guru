import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import searchMapImage from '../../images/Map.png'
import { brandAssets, destinations, stays } from '../data/travelData'
import { usePageMetadata } from '../hooks/usePageMetadata'

function createFallbackDate(offsetDays) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parsePrice(value) {
  const match = String(value).match(/\d+/)
  return match ? Number(match[0]) : 0
}

function parseCapacity(details) {
  const match = String(details).match(/(\d+)\s+guests?/i)
  return match ? Number(match[1]) : 0
}

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const destinationSlug = searchParams.get('destination') ?? 'coxs-bazar'
  const origin = searchParams.get('origin') ?? 'Dhaka'
  const guests = searchParams.get('guests') ?? '2'
  const from = searchParams.get('from') ?? createFallbackDate(7)
  const to = searchParams.get('to') ?? createFallbackDate(12)
  const sortBy = searchParams.get('sort') ?? 'recommended'
  const minimumRating = searchParams.get('rating') ?? '0'
  const capacityFilter = searchParams.get('capacity') ?? 'all'
  const flexibleOnly = searchParams.get('flexible') === 'true'

  const updateSearchFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === false) {
        nextParams.delete(key)
        return
      }

      nextParams.set(key, String(value))
    })

    setSearchParams(nextParams)
  }

  const destination = useMemo(
    () => destinations.find((item) => item.slug === destinationSlug) ?? destinations[0],
    [destinationSlug],
  )
  const filteredStays = useMemo(() => {
    const requestedGuests = Number(guests) || 0

    let nextStays = stays.filter((stay) => stay.destinationSlug === destination.slug)

    if (capacityFilter === 'requested') {
      nextStays = nextStays.filter((stay) => parseCapacity(stay.details) >= requestedGuests)
    }

    if (minimumRating !== '0') {
      nextStays = nextStays.filter((stay) => Number(stay.rating) >= Number(minimumRating))
    }

    if (flexibleOnly) {
      nextStays = nextStays.filter((stay) => stay.flexibility.toLowerCase().includes('flex'))
    }

    const sortedStays = [...nextStays]

    if (sortBy === 'price-low') {
      sortedStays.sort((left, right) => parsePrice(left.price) - parsePrice(right.price))
    } else if (sortBy === 'price-high') {
      sortedStays.sort((left, right) => parsePrice(right.price) - parsePrice(left.price))
    } else if (sortBy === 'rating-high') {
      sortedStays.sort((left, right) => Number(right.rating) - Number(left.rating))
    }

    return sortedStays
  }, [capacityFilter, destination.slug, flexibleOnly, guests, minimumRating, sortBy])
  const formatDate = (value) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }
  const bookingSummary = `${filteredStays.length} stay${filteredStays.length === 1 ? '' : 's'} ${formatDate(from)}-${formatDate(to)} ${guests} guest${guests === '1' ? '' : 's'}`

  usePageMetadata({
    title: `Travel Guru | Stays In ${destination.shortName}`,
    description: `Browse matching stays in ${destination.shortName} for your selected route, dates, and guest count.`,
  })

  return (
    <section className="px-0 py-[22px]">
      <div className="grid items-start gap-[34px] overflow-hidden lg:grid-cols-[1.08fr_0.92fr]">
        <div className="min-w-0 max-w-[680px] pt-0">
          <p className="text-muted text-[13px]">{bookingSummary}</p>
          <h1 className="text-ink mt-[4px] text-[22px] font-bold">
            Stay in {destination.shortName}
          </h1>
          <p className="text-muted mt-2 text-[13px]">
            Route: {origin} to {destination.shortName}
          </p>

          <div className="mt-5 grid gap-3 rounded-[18px] border border-black/8 bg-[#fbfbfb] p-4 md:grid-cols-2">
            <label className="text-sm text-[#5f5f5f]">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b7b7b]">
                Sort By
              </span>
              <select
                value={sortBy}
                onChange={(event) => updateSearchFilters({ sort: event.target.value })}
                className="w-full rounded-[12px] border border-black/8 bg-white px-3 py-2.5 text-sm text-ink outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="rating-high">Top rated</option>
              </select>
            </label>

            <label className="text-sm text-[#5f5f5f]">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b7b7b]">
                Minimum Rating
              </span>
              <select
                value={minimumRating}
                onChange={(event) =>
                  updateSearchFilters({
                    rating: event.target.value === '0' ? null : event.target.value,
                  })
                }
                className="w-full rounded-[12px] border border-black/8 bg-white px-3 py-2.5 text-sm text-ink outline-none"
              >
                <option value="0">Any rating</option>
                <option value="4.5">4.5+</option>
                <option value="4.7">4.7+</option>
                <option value="4.8">4.8+</option>
              </select>
            </label>

            <label className="text-sm text-[#5f5f5f]">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b7b7b]">
                Guest Fit
              </span>
              <select
                value={capacityFilter}
                onChange={(event) =>
                  updateSearchFilters({
                    capacity: event.target.value === 'all' ? null : event.target.value,
                  })
                }
                className="w-full rounded-[12px] border border-black/8 bg-white px-3 py-2.5 text-sm text-ink outline-none"
              >
                <option value="all">All stays</option>
                <option value="requested">Fits {guests} guest{guests === '1' ? '' : 's'}</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-[12px] border border-black/8 bg-white px-3 py-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={flexibleOnly}
                onChange={(event) =>
                  updateSearchFilters({
                    flexible: event.target.checked ? 'true' : null,
                  })
                }
                className="h-4 w-4 accent-brand"
              />
              <span>Show flexible stays only</span>
            </label>
          </div>

          <div className="mt-[18px] space-y-[28px]">
            {filteredStays.length > 0 ? (
              filteredStays.map((stay) => (
                <Link
                  key={stay.id}
                  to={`/stays/${stay.id}?${searchParams.toString()}&destinationName=${encodeURIComponent(destination.shortName)}`}
                  className="grid min-w-0 gap-[16px] overflow-hidden rounded-[14px] border border-transparent p-2 transition hover:border-black/8 hover:bg-black/[0.02] md:grid-cols-[180px_minmax(0,1fr)] md:items-start"
                >
                  <img
                    src={stay.image}
                    alt={stay.title}
                    loading="lazy"
                    decoding="async"
                    className="h-[148px] w-full shrink-0 rounded-[4px] object-cover md:w-[180px]"
                  />

                  <div className="text-ink min-w-0 overflow-hidden pt-[1px]">
                    <h2 className="text-[16px] leading-[1.45]">{stay.title}</h2>
                    <p className="text-muted mt-[7px] text-[13px] leading-[1.8]">{stay.details}</p>
                    <p className="text-muted text-[13px] leading-[1.8]">{stay.amenities}</p>
                    <p className="text-muted text-[13px] leading-[1.8]">{stay.flexibility}</p>

                    <div className="mt-[9px] flex min-w-0 items-center gap-[7px] whitespace-nowrap text-[11px]">
                      <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-[#424242]">
                          <img
                            src={brandAssets.starIcon}
                            alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-[13px] w-[13px]"
                          />
                          {stay.rating} ({stay.reviews})
                        </span>
                      <span className="shrink-0 text-[18px] font-semibold tracking-[-0.01em]">{stay.price}</span>
                      <span className="text-muted shrink text-[10px]">{stay.total}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-black/10 bg-[#fbfbfb] p-5 text-sm text-[#666666]">
                No stays matched this destination yet. Try another destination or add more stay data.
              </div>
            )}
          </div>
        </div>

        <div className="pt-[8px] lg:pt-[18px]">
          <div className="relative h-[500px] w-full overflow-hidden rounded-[10px] bg-[#e8eef1] lg:h-[560px]">
            <img
              src={searchMapImage}
              alt="Search map"
              decoding="async"
              className="h-[103%] w-[103%] max-w-none object-cover object-center"
              style={{ transform: 'translate(-0.4%, 1%)' }}
            />
            <div className="absolute inset-y-0 left-0 w-[14px] bg-linear-to-r from-[#97c7ee] via-[#97c7ee]/85 to-transparent" />
          </div>

          <div className="mt-5 rounded-[22px] border border-black/8 bg-white p-5 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b7b7b]">
                  Search Summary
                </p>
                <h2 className="mt-2 text-xl font-semibold text-ink">{destination.shortName}</h2>
              </div>
              <span className="rounded-full bg-[#f7f4eb] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a5d18]">
                {filteredStays.length} match{filteredStays.length === 1 ? '' : 'es'}
              </span>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-[#5d5d5d]">
              <div className="rounded-[16px] bg-[#fbfbfb] px-4 py-3">
                <span className="font-semibold text-ink">Route:</span> {origin} to {destination.shortName}
              </div>
              <div className="rounded-[16px] bg-[#fbfbfb] px-4 py-3">
                <span className="font-semibold text-ink">Dates:</span> {formatDate(from)} to {formatDate(to)}
              </div>
              <div className="rounded-[16px] bg-[#fbfbfb] px-4 py-3">
                <span className="font-semibold text-ink">Guests:</span> {guests} guest{guests === '1' ? '' : 's'}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#666666]">
                {sortBy === 'recommended'
                  ? 'Recommended order'
                  : sortBy === 'price-low'
                    ? 'Price low to high'
                    : sortBy === 'price-high'
                      ? 'Price high to low'
                      : 'Top rated'}
              </span>
              {minimumRating !== '0' ? (
                <span className="rounded-full border border-black/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#666666]">
                  Rating {minimumRating}+
                </span>
              ) : null}
              {capacityFilter === 'requested' ? (
                <span className="rounded-full border border-black/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#666666]">
                  Fits {guests} guest{guests === '1' ? '' : 's'}
                </span>
              ) : null}
              {flexibleOnly ? (
                <span className="rounded-full border border-black/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#666666]">
                  Flexible only
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchPage

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { brandAssets, destinations } from '../data/travelData'
import { usePageMetadata } from '../hooks/usePageMetadata'

function ArrowIcon({ left = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${left ? '' : 'rotate-180'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 5 8 12l7 7" />
    </svg>
  )
}

function HomePage() {
  usePageMetadata({
    title: 'Travel Guru | Explore Bangladesh',
    description: 'Discover standout destinations in Bangladesh and start planning your next booking with Travel Guru.',
  })

  const [activeIndex, setActiveIndex] = useState(0)
  const activeDestination = destinations[activeIndex]

  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `url(${brandAssets.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
    [],
  )

  const cycleCard = (direction) => {
    setActiveIndex((current) => (current + direction + destinations.length) % destinations.length)
  }

  return (
    <section className="overflow-hidden rounded-sm" style={backgroundStyle}>
      <div className="hero-overlay min-h-[calc(100vh-180px)] px-6 pb-10 pt-44 md:px-12 md:pb-14 md:pt-32">
        <div className="flex min-h-160 flex-col justify-between gap-10 lg:flex-row lg:items-center">
          <div className="max-w-xl text-white">
            <h1 className="font-display text-[58px] leading-[0.9] uppercase tracking-[1px] md:text-[88px] md:leading-[0.9]">
              {activeDestination.title}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/88 md:text-base">
              {activeDestination.description}
            </p>
            <Link
              to={`/booking/${activeDestination.slug}`}
              className="mt-8 inline-flex items-center gap-3 rounded-md bg-brand px-8 py-3 text-sm font-semibold text-black transition hover:bg-[#ffba47]"
            >
              Booking
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-8 lg:items-end">
            <div className="flex w-full flex-col gap-5 md:flex-row">
              {destinations.map((destination, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={destination.slug}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`destination-card-shadow group relative h-95 w-full overflow-hidden rounded-[26px] text-left md:w-55 ${
                      isActive ? 'ring-4 ring-brand ring-inset' : 'ring-1 ring-white/8'
                    }`}
                  >
                    <img
                      src={destination.image}
                      alt={destination.shortName}
                      loading={isActive ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={isActive ? 'high' : 'auto'}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-5">
                      <h2 className="font-display text-4xl uppercase text-white">{destination.shortName}</h2>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => cycleCard(-1)}
                aria-label="Show previous destination"
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition hover:bg-brand"
              >
                <ArrowIcon left />
              </button>
              <button
                type="button"
                onClick={() => cycleCard(1)}
                aria-label="Show next destination"
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition hover:bg-brand"
              >
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage

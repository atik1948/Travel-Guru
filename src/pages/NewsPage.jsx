import { Link } from 'react-router-dom'
import { newsItems } from '../data/newsItems'
import { usePageMetadata } from '../hooks/usePageMetadata'

function NewsPage() {
  usePageMetadata({
    title: 'Travel Guru | News',
    description: 'Read the latest Travel Guru destination updates, travel trends, and seasonal route highlights.',
  })

  const featured = newsItems[0]
  const secondary = newsItems.slice(1)

  return (
    <section className="py-8 md:py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#f5efe0_0%,#fbfaf6_34%,#dbe5df_100%)] p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[26px] bg-white/92 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                {featured.tag}
              </span>
              <span className="text-muted text-xs font-semibold uppercase tracking-[0.22em]">
                {featured.date}
              </span>
            </div>
            <h1 className="mt-5 max-w-[520px] text-4xl font-semibold leading-[1.08] text-ink md:text-[52px]">
              {featured.title}
            </h1>
            <p className="text-muted mt-5 max-w-[560px] text-[15px] leading-8">
              {featured.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/news/${featured.slug}`}
                className="rounded-full bg-ink px-5 py-3 text-sm font-semibold !text-white transition hover:opacity-90"
              >
                Read full story
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-ink transition hover:bg-black/[0.04]"
              >
                Save update
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            {secondary.map((item) => (
              <Link
                key={item.title}
                to={`/news/${item.slug}`}
                className="rounded-[26px] border border-black/6 bg-white/88 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-black/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
                    {item.tag}
                  </span>
                  <span className="text-muted text-[11px] font-semibold uppercase tracking-[0.22em]">
                    {item.date}
                  </span>
                </div>
                <h2 className="mt-4 text-[24px] font-semibold leading-[1.22] text-ink">{item.title}</h2>
                <p className="text-muted mt-4 text-sm leading-7">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsPage

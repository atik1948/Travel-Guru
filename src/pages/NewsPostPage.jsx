import { Link, Navigate, useParams } from 'react-router-dom'
import { newsItems } from '../data/newsItems'
import { usePageMetadata } from '../hooks/usePageMetadata'

function NewsPostPage() {
  const { slug = '' } = useParams()
  const post = newsItems.find((item) => item.slug === slug)

  usePageMetadata({
    title: post ? `Travel Guru | ${post.title}` : 'Travel Guru | News Story',
    description: post?.summary || 'Read the latest destination updates and travel news from Travel Guru.',
  })

  if (!post) {
    return <Navigate to="/news" replace />
  }

  return (
    <section className="py-8 md:py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#f5efe0_0%,#fbfaf6_34%,#dbe5df_100%)] p-6 md:p-8">
        <article className="mx-auto max-w-[900px] rounded-[26px] bg-white/92 p-7 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f5c07]">
              {post.tag}
            </span>
            <span className="text-muted text-[11px] font-semibold uppercase tracking-[0.22em]">
              {post.date}
            </span>
          </div>

          <h1 className="mt-5 max-w-[760px] text-4xl font-semibold leading-[1.08] text-ink md:text-[52px]">
            {post.title}
          </h1>
          <p className="text-muted mt-5 max-w-[760px] text-[15px] leading-8">{post.summary}</p>

          <div className="mt-8 space-y-5 text-[15px] leading-8 text-[#555555]">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/news"
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold !text-white transition hover:opacity-90"
            >
              Back to news
            </Link>
            <Link
              to="/destination"
              className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-ink transition hover:bg-black/[0.04]"
            >
              Explore destinations
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

export default NewsPostPage

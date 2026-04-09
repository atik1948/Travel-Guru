import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import { usePageMetadata } from '../hooks/usePageMetadata'

const journalStats = [
  { label: 'Fresh Posts', value: '12' },
  { label: 'Short Reads', value: '08' },
  { label: 'Trip Notes', value: '05' },
]

function BlogPage() {
  usePageMetadata({
    title: 'Travel Guru | Blog',
    description: 'Browse calm, practical travel stories and short planning notes from the Travel Guru journal.',
  })

  return (
    <section className="py-8 md:py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#f5efe0_0%,#fbfaf6_34%,#dbe5df_100%)] p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="flex h-full flex-col gap-5">
            <div className="self-start rounded-[26px] bg-white/92 p-7 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:p-8">
              <p className="text-muted text-sm font-medium uppercase tracking-[0.28em]">Journal</p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] md:text-[50px]">
                Travel stories with calm, useful detail
              </h1>
              <p className="text-muted mt-5 text-[15px] leading-8">
                Short reads for travelers who want practical ideas, mood-based planning and destination context
                without too much noise.
              </p>
            </div>

            <div className="grid flex-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {journalStats.map((item) => (
                <div
                  key={item.label}
                  className="flex h-full flex-col justify-center rounded-[22px] border border-black/6 bg-white/80 px-6 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
                >
                  <p className="text-muted text-[11px] font-semibold uppercase tracking-[0.22em]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-[32px] font-semibold leading-none text-ink">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col gap-5">
            {blogPosts.map((post, index) => (
              <article
                key={post.title}
                className="flex-1 rounded-[26px] border border-black/6 bg-white px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)] md:px-8"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-[720px]">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-brand/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f5c07]">
                        Post {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-muted text-[11px] font-semibold uppercase tracking-[0.22em]">
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="mt-4 text-[26px] font-semibold leading-[1.28] text-ink">{post.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[#666666]">{post.excerpt}</p>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium !text-white transition hover:opacity-92"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogPage

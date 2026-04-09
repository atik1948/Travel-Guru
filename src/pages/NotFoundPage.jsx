import { Link } from 'react-router-dom'
import { usePageMetadata } from '../hooks/usePageMetadata'

function NotFoundPage() {
  usePageMetadata({
    title: 'Travel Guru | Page Not Found',
    description: 'The page you requested could not be found in Travel Guru. Return home or continue exploring destinations.',
  })

  return (
    <section className="flex min-h-[calc(100vh-220px)] items-center py-8 md:py-12">
      <div className="w-full rounded-[32px] bg-[linear-gradient(135deg,#f5efe0_0%,#fbfaf6_34%,#dbe5df_100%)] p-6 md:p-8">
        <div className="rounded-[26px] bg-white/92 p-8 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:p-10">
          <p className="text-muted text-sm font-medium uppercase tracking-[0.28em]">404</p>
          <h1 className="mt-4 max-w-[620px] text-4xl font-semibold leading-[1.06] md:text-[54px]">
            This route does not exist in Travel Guru
          </h1>
          <p className="text-muted mt-5 max-w-[620px] text-[15px] leading-8">
            The page may have moved, the URL may be incomplete, or the route has not been created yet.
            Use one of the actions below to continue exploring the app.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold !text-white transition hover:opacity-90"
            >
              Back to home
            </Link>
            <Link
              to="/destination"
              className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium text-ink transition hover:bg-black/[0.04]"
            >
              Browse destinations
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage

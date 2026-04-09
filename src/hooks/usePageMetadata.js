import { useEffect } from 'react'

const defaultTitle = 'Travel Guru | Explore Bangladesh'
const defaultDescription =
  'Travel Guru is a React travel booking demo for exploring destinations, planning trips, and browsing stays across Bangladesh.'

export function usePageMetadata({ title, description = defaultDescription }) {
  useEffect(() => {
    const previousTitle = document.title
    const metaDescription = document.querySelector('meta[name="description"]')
    const previousDescription = metaDescription?.getAttribute('content') ?? ''

    document.title = title || defaultTitle

    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    return () => {
      document.title = previousTitle || defaultTitle

      if (metaDescription) {
        metaDescription.setAttribute('content', previousDescription || defaultDescription)
      }
    }
  }, [description, title])
}

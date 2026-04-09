import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DestinationPage from './DestinationPage'

vi.mock('../hooks/usePageMetadata', () => ({
  usePageMetadata: () => {},
}))

describe('DestinationPage', () => {
  it('includes the featured stay context in destination booking links', () => {
    render(
      <MemoryRouter initialEntries={['/destination?q=cox']}>
        <DestinationPage />
      </MemoryRouter>,
    )

    const bookingLink = screen.getByRole('link', { name: 'Start booking' })

    expect(bookingLink).toHaveAttribute(
      'href',
      '/booking/coxs-bazar?stayId=1&stayTitle=Light+bright+airy+stylish+apt+%26+safe+peaceful+stay&stayPrice=%2434%2Fnight',
    )
  })
})

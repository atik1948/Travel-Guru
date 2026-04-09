import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    hasFirebaseConfig: false,
    isAuthenticated: false,
    user: null,
  }),
}))

vi.mock('../hooks/useToast', () => ({
  useToast: () => ({
    error: vi.fn(),
    success: vi.fn(),
  }),
}))

vi.mock('../hooks/usePageMetadata', () => ({
  usePageMetadata: () => {},
}))

import BookingPage from './BookingPage'

describe('BookingPage', () => {
  afterEach(() => {
    mockNavigate.mockReset()
  })

  it('shows the selected stay from the query string', () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/booking/coxs-bazar?stayId=5&origin=Dhaka&guests=2&from=2026-04-15&to=2026-04-20',
        ]}
      >
        <Routes>
          <Route path="/booking/:slug" element={<BookingPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Selected stay')).toBeInTheDocument()
    expect(screen.getByText('Modern coastal stay with sunset rooftop access')).toBeInTheDocument()
    expect(screen.getByText('$42/night')).toBeInTheDocument()
  })

  it('preserves trip params when changing destination', () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/booking/coxs-bazar?stayId=5&origin=Dhaka&guests=2&from=2026-04-15&to=2026-04-20',
        ]}
      >
        <Routes>
          <Route path="/booking/:slug" element={<BookingPage />} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByDisplayValue("Cox's Bazar"), {
      target: { value: 'sreemangal' },
    })

    expect(mockNavigate).toHaveBeenCalledWith(
      '/booking/sreemangal?origin=Dhaka&guests=2&from=2026-04-15&to=2026-04-20',
    )
  })
})

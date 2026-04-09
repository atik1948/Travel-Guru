import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import SearchPage from './SearchPage'

vi.mock('../hooks/usePageMetadata', () => ({
  usePageMetadata: () => {},
}))

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location-search">{location.search}</div>
}

describe('SearchPage', () => {
  it('syncs filter selections to the URL query string', () => {
    render(
      <MemoryRouter initialEntries={['/search?destination=coxs-bazar&guests=2']}>
        <Routes>
          <Route
            path="/search"
            element={
              <>
                <SearchPage />
                <LocationDisplay />
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByDisplayValue('Recommended'), {
      target: { value: 'price-high' },
    })
    fireEvent.change(screen.getByDisplayValue('Any rating'), {
      target: { value: '4.8' },
    })
    fireEvent.click(screen.getByLabelText('Show flexible stays only'))

    const search = screen.getByTestId('location-search').textContent

    expect(search).toContain('sort=price-high')
    expect(search).toContain('rating=4.8')
    expect(search).toContain('flexible=true')
  })
})

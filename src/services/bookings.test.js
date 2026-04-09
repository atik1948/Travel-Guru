import { normalizeBookingPayload } from './bookings'

describe('normalizeBookingPayload', () => {
  it('normalizes, trims, and preserves stay-specific booking fields', () => {
    const normalized = normalizeBookingPayload({
      userId: ' user-1 ',
      userEmail: ' traveler@example.com ',
      userName: ' Abdul Wahid ',
      destinationSlug: ' coxs-bazar ',
      destinationName: " Cox's Bazar ",
      origin: ' Dhaka ',
      guests: 2,
      fromDate: ' 2026-04-15 ',
      toDate: ' 2026-04-20 ',
      heroTitle: " COX'S BAZAR ",
      summary: ' Beach trip ',
      stayId: 5,
      stayTitle: ' Modern coastal stay ',
      stayPrice: ' $42/night ',
    })

    expect(normalized).toEqual({
      userId: 'user-1',
      userEmail: 'traveler@example.com',
      userName: 'Abdul Wahid',
      destinationSlug: 'coxs-bazar',
      destinationName: "Cox's Bazar",
      origin: 'Dhaka',
      guests: 2,
      fromDate: '2026-04-15',
      toDate: '2026-04-20',
      heroTitle: "COX'S BAZAR",
      summary: 'Beach trip',
      stayId: '5',
      stayTitle: 'Modern coastal stay',
      stayPrice: '$42/night',
    })
  })

  it('rejects missing origin values', () => {
    expect(() =>
      normalizeBookingPayload({
        userId: 'user-1',
        userEmail: 'traveler@example.com',
        destinationSlug: 'coxs-bazar',
        destinationName: "Cox's Bazar",
        guests: 2,
        fromDate: '2026-04-15',
        toDate: '2026-04-20',
        heroTitle: "COX'S BAZAR",
        summary: 'Beach trip',
      }),
    ).toThrow('Origin is required to create a booking.')
  })
})

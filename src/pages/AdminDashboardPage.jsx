import { useEffect, useMemo, useState } from 'react'
import { deleteBooking, subscribeToAllBookings, updateBookingStatus } from '../services/bookings'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { deleteContactMessage, subscribeToContactMessages } from '../services/contact'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

function formatDate(value) {
  if (!value) return 'Just now'

  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleString()
  }

  return new Date(value).toLocaleString()
}

function getBookingStartDate(booking) {
  return booking.fromDate || booking.from || ''
}

function getBookingEndDate(booking) {
  return booking.toDate || booking.to || ''
}

function SectionCard({ title, count, subtitle, children }) {
  return (
    <section className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#1f1f1f]">{title}</h2>
          <p className="mt-1 text-sm text-[#6a6a6a]">{subtitle}</p>
        </div>
        <span className="rounded-full bg-[#f3f3f3] px-3 py-1 text-sm font-semibold text-[#333333]">
          {count}
        </span>
      </div>
      {children}
    </section>
  )
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 bg-[#fafafa] px-4 py-8 text-center text-sm text-[#737373]">
      {message}
    </div>
  )
}

function getStatusStyles(status) {
  if (status === 'confirmed') {
    return 'bg-emerald-100 text-emerald-700'
  }

  if (status === 'cancel-requested') {
    return 'bg-orange-100 text-orange-700'
  }

  if (status === 'cancelled') {
    return 'bg-red-100 text-red-700'
  }

  return 'bg-amber-100 text-amber-700'
}

const adminStatusActions = ['pending', 'confirmed', 'cancelled']

function AdminDashboardPage() {
  usePageMetadata({
    title: 'Travel Guru | Admin Dashboard',
    description: 'Monitor bookings, cancellation requests, travelers, and contact messages from the Travel Guru admin dashboard.',
  })

  const { authLoading, canManageAdminData, hasAdminClaim, refreshClaims } = useAuth()
  const { error: showError, success } = useToast()
  const [bookings, setBookings] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingQuery, setBookingQuery] = useState('')
  const [messageQuery, setMessageQuery] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('all')
  const [updatingBookingId, setUpdatingBookingId] = useState('')
  const [deletingBookingId, setDeletingBookingId] = useState('')
  const [deletingMessageId, setDeletingMessageId] = useState('')

  useEffect(() => {
    if (authLoading || hasAdminClaim) {
      return undefined
    }

    refreshClaims().catch((error) => {
      console.error(error)
    })

    return undefined
  }, [authLoading, hasAdminClaim, refreshClaims])

  useEffect(() => {
    if (authLoading) {
      return undefined
    }

    if (!hasAdminClaim) {
      setBookings([])
      setMessages([])
      setLoading(false)
      return undefined
    }

    let bookingsLoaded = false
    let messagesLoaded = false

    const markLoaded = () => {
      if (bookingsLoaded && messagesLoaded) {
        setLoading(false)
      }
    }

    const unsubscribeBookings = subscribeToAllBookings(
      (nextBookings) => {
        bookingsLoaded = true
        setBookings(nextBookings)
        markLoaded()
      },
      (error) => {
        bookingsLoaded = true
        markLoaded()
        console.error(error)
        showError('Bookings unavailable', error.message || 'Unable to load booking activity.')
      },
    )

    const unsubscribeMessages = subscribeToContactMessages(
      (nextMessages) => {
        messagesLoaded = true
        setMessages(nextMessages)
        markLoaded()
      },
      (error) => {
        messagesLoaded = true
        markLoaded()
        console.error(error)
        showError('Messages unavailable', error.message || 'Unable to load contact messages.')
      },
    )

    return () => {
      unsubscribeBookings()
      unsubscribeMessages()
    }
  }, [authLoading, hasAdminClaim, showError])

  const destinationOptions = useMemo(() => {
    const destinations = Array.from(
      new Set(bookings.map((booking) => booking.destinationName).filter(Boolean)),
    )

    return ['all', ...destinations]
  }, [bookings])

  const filteredBookings = useMemo(() => {
    const normalizedQuery = bookingQuery.trim().toLowerCase()

    return bookings.filter((booking) => {
      const matchesDestination =
        selectedDestination === 'all' || booking.destinationName === selectedDestination

      if (!matchesDestination) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      const haystack = [
        booking.destinationName,
        booking.origin,
        booking.userEmail,
        booking.userId,
        getBookingStartDate(booking),
        getBookingEndDate(booking),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [bookingQuery, bookings, selectedDestination])

  const filteredMessages = useMemo(() => {
    const normalizedQuery = messageQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return messages
    }

    return messages.filter((message) => {
      const haystack = [message.name, message.email, message.message, message.userEmail]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [messageQuery, messages])

  const activeTravelers = useMemo(
    () => new Set(bookings.map((booking) => booking.userEmail || booking.userId).filter(Boolean)).size,
    [bookings],
  )
  const confirmedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === 'confirmed').length,
    [bookings],
  )
  const cancellationRequests = useMemo(
    () => bookings.filter((booking) => booking.status === 'cancel-requested').length,
    [bookings],
  )

  const handleStatusChange = async (bookingId, status) => {
    if (!canManageAdminData) {
      showError(
        'Admin claim required',
        'Your account can open this dashboard, but Firestore updates require a Firebase admin custom claim.',
      )
      return
    }

    try {
      setUpdatingBookingId(bookingId)
      await updateBookingStatus(bookingId, status)
      success('Booking updated', `Booking status changed to ${status}.`)
    } catch (error) {
      console.error(error)
      showError('Update failed', error.message || 'Unable to update booking status right now.')
    } finally {
      setUpdatingBookingId('')
    }
  }

  const handleDeleteBooking = async (bookingId, destinationName) => {
    if (!canManageAdminData) {
      showError(
        'Admin claim required',
        'Your account can open this dashboard, but Firestore deletes require a Firebase admin custom claim.',
      )
      return
    }

    const confirmed = window.confirm(
      `Delete the booking for ${destinationName}? This will remove it from Firestore and My Bookings too.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingBookingId(bookingId)
      await deleteBooking(bookingId)
      success('Booking deleted', 'The booking was removed from Firestore successfully.')
    } catch (error) {
      console.error(error)
      showError('Delete failed', error.message || 'Unable to delete the booking right now.')
    } finally {
      setDeletingBookingId('')
    }
  }

  const handleDeleteMessage = async (messageId, senderName) => {
    if (!canManageAdminData) {
      showError(
        'Admin claim required',
        'Your account can open this dashboard, but Firestore deletes require a Firebase admin custom claim.',
      )
      return
    }

    const confirmed = window.confirm(
      `Delete the contact message from ${senderName || 'this sender'}? This will remove it from Firestore.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingMessageId(messageId)
      await deleteContactMessage(messageId)
      success('Message deleted', 'The contact message was removed from Firestore successfully.')
    } catch (error) {
      console.error(error)
      showError('Delete failed', error.message || 'Unable to delete the message right now.')
    } finally {
      setDeletingMessageId('')
    }
  }

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-14 pt-28 md:px-8 md:pt-32">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a5400]">
            Admin
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-[#111111] md:text-4xl">Operations dashboard</h1>
          <p className="mt-2 max-w-[680px] text-sm leading-7 text-[#5e5e5e] md:text-base">
            Review recent trip bookings and incoming contact requests from one place.
          </p>
        </div>
      </div>

      {!hasAdminClaim ? (
        <div className="mb-6 rounded-[20px] border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-[0_12px_26px_rgba(0,0,0,0.04)]">
          This account does not currently have a Firebase admin custom claim, so admin data and moderation controls stay locked.
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] bg-[#111111] px-5 py-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
          <p className="text-sm text-white/70">Total bookings</p>
          <p className="mt-3 text-3xl font-semibold">{bookings.length}</p>
        </div>
        <div className="rounded-[24px] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <p className="text-sm text-[#6a6a6a]">Confirmed trips</p>
          <p className="mt-3 text-3xl font-semibold text-[#181818]">{confirmedBookings}</p>
        </div>
        <div className="rounded-[24px] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <p className="text-sm text-[#6a6a6a]">Cancel requests</p>
          <p className="mt-3 text-3xl font-semibold text-[#181818]">{cancellationRequests}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_1fr_0.95fr]">
        <label className="rounded-[20px] border border-black/8 bg-white px-4 py-3 shadow-[0_14px_30px_rgba(0,0,0,0.04)]">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#7b7b7b]">
            Search bookings
          </span>
          <input
            type="text"
            value={bookingQuery}
            onChange={(event) => setBookingQuery(event.target.value)}
            placeholder="Search by traveler, origin, destination, or date"
            className="w-full bg-transparent text-sm text-[#1f1f1f] outline-none placeholder:text-[#9b9b9b]"
          />
        </label>
        <label className="rounded-[20px] border border-black/8 bg-white px-4 py-3 shadow-[0_14px_30px_rgba(0,0,0,0.04)]">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#7b7b7b]">
            Destination filter
          </span>
          <select
            value={selectedDestination}
            onChange={(event) => setSelectedDestination(event.target.value)}
            className="w-full bg-transparent text-sm text-[#1f1f1f] outline-none"
          >
            {destinationOptions.map((destination) => (
              <option key={destination} value={destination}>
                {destination === 'all' ? 'All destinations' : destination}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-[20px] border border-black/8 bg-white px-4 py-3 shadow-[0_14px_30px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b7b7b]">Status</p>
          <p className="mt-3 text-base font-semibold text-[#181818]">
            {loading ? 'Syncing dashboard...' : 'Live Firestore data connected'}
          </p>
          <p className="mt-2 text-sm text-[#666666]">{activeTravelers} active travelers</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Recent bookings"
          count={`${filteredBookings.length} trips`}
          subtitle="Newest trips appear first. Each entry includes route, dates, and the traveler account."
        >
          {filteredBookings.length ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[20px] border border-black/8 bg-[#fafafa] px-4 py-4 md:px-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1b1b1b]">{booking.destinationName}</h3>
                      <p className="mt-1 text-sm text-[#5f5f5f]">
                        {booking.origin} to {booking.destinationName} for {booking.guests} guest
                        {booking.guests > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#5f5f5f]">
                        {formatDate(booking.createdAt)}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusStyles(
                          booking.status,
                        )}`}
                      >
                        {booking.status || 'pending'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-[#525252] md:grid-cols-3">
                    <p>
                      <span className="font-semibold text-[#222222]">From:</span>{' '}
                      {getBookingStartDate(booking) || 'Not set'}
                    </p>
                    <p>
                      <span className="font-semibold text-[#222222]">To:</span>{' '}
                      {getBookingEndDate(booking) || 'Not set'}
                    </p>
                    <p className="break-all">
                      <span className="font-semibold text-[#222222]">Traveler:</span>{' '}
                      {booking.userEmail || booking.userId}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {adminStatusActions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={
                          !canManageAdminData || updatingBookingId === booking.id || booking.status === status
                        }
                        onClick={() => handleStatusChange(booking.id, status)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                          booking.status === status
                            ? 'bg-[#111111] text-white'
                            : 'bg-white text-[#333333] hover:bg-[#f1f1f1]'
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        {updatingBookingId === booking.id && booking.status !== status
                          ? 'Updating...'
                          : status}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={!canManageAdminData || deletingBookingId === booking.id}
                      onClick={() => handleDeleteBooking(booking.id, booking.destinationName)}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deletingBookingId === booking.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  {booking.status === 'cancel-requested' ? (
                    <p className="mt-3 text-xs font-medium text-orange-700">
                      This traveler has requested a cancellation. Use `cancelled` if you want to approve it.
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState message="No bookings match the current search or destination filter." />
          )}
        </SectionCard>

        <SectionCard
          title="Contact inbox"
          count={`${filteredMessages.length} messages`}
          subtitle="Public contact requests are stored in Firestore and surfaced here for quick follow-up."
        >
          <div className="mb-4">
            <label className="block rounded-[18px] border border-black/8 bg-[#fafafa] px-4 py-3">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#7b7b7b]">
                Search messages
              </span>
              <input
                type="text"
                value={messageQuery}
                onChange={(event) => setMessageQuery(event.target.value)}
                placeholder="Search by sender, email, or message text"
                className="w-full bg-transparent text-sm text-[#1f1f1f] outline-none placeholder:text-[#9b9b9b]"
              />
            </label>
          </div>
          {filteredMessages.length ? (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <article
                  key={message.id}
                  className="rounded-[20px] border border-black/8 bg-[#fafafa] px-4 py-4 md:px-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-[#1b1b1b]">{message.name}</h3>
                      <p className="mt-1 break-all text-sm text-[#5f5f5f]">{message.email}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#5f5f5f]">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#4f4f4f]">{message.message}</p>
                  {message.userEmail ? (
                    <p className="mt-3 text-xs text-[#6a6a6a]">Sent while signed in as {message.userEmail}</p>
                  ) : null}
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!canManageAdminData || deletingMessageId === message.id}
                      onClick={() => handleDeleteMessage(message.id, message.name)}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deletingMessageId === message.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState message="No contact messages match the current search." />
          )}
        </SectionCard>
      </div>
    </main>
  )
}

export default AdminDashboardPage

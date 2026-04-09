import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, hasFirebaseConfig } from '../lib/firebase'

function ensureFirestore() {
  if (!hasFirebaseConfig || !db) {
    throw new Error('Firebase is not configured yet. Add your VITE_FIREBASE_* values to continue.')
  }
}

export function normalizeBookingPayload(bookingData) {
  const {
    destinationName,
    destinationSlug,
    fromDate,
    guests,
    heroTitle,
    origin,
    summary,
    stayId,
    stayPrice,
    stayTitle,
    toDate,
    userEmail,
    userId,
    userName,
  } = bookingData || {}

  if (!userId?.trim()) {
    throw new Error('User id is required to create a booking.')
  }

  if (!userEmail?.trim()) {
    throw new Error('User email is required to create a booking.')
  }

  if (!destinationSlug?.trim() || !destinationName?.trim()) {
    throw new Error('Destination details are required to create a booking.')
  }

  if (!origin?.trim()) {
    throw new Error('Origin is required to create a booking.')
  }

  if (!heroTitle?.trim() || !summary?.trim()) {
    throw new Error('Trip details are required to create a booking.')
  }

  if (!Number.isInteger(guests) || guests < 1) {
    throw new Error('Guest count must be a positive whole number.')
  }

  if (!fromDate?.trim() || !toDate?.trim()) {
    throw new Error('Travel dates are required to create a booking.')
  }

  return {
    userId: userId.trim(),
    userEmail: userEmail.trim(),
    userName: userName?.trim() || '',
    destinationSlug: destinationSlug.trim(),
    destinationName: destinationName.trim(),
    origin: origin.trim(),
    guests,
    fromDate: fromDate.trim(),
    toDate: toDate.trim(),
    heroTitle: heroTitle.trim(),
    summary: summary.trim(),
    stayId: stayId ? String(stayId).trim() : '',
    stayTitle: stayTitle?.trim() || '',
    stayPrice: stayPrice?.trim() || '',
  }
}

export async function createBooking(bookingData) {
  ensureFirestore()
  const normalizedBooking = normalizeBookingPayload(bookingData)

  return addDoc(collection(db, 'bookings'), {
    ...normalizedBooking,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
}

export function subscribeToUserBookings(userId, callback, errorCallback) {
  if (!hasFirebaseConfig || !db || !userId) {
    callback([])
    return () => {}
  }

  const bookingsQuery = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(
    bookingsQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    },
    errorCallback,
  )
}

export function subscribeToAllBookings(callback, errorCallback) {
  if (!hasFirebaseConfig || !db) {
    callback([])
    return () => {}
  }

  const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))

  return onSnapshot(
    bookingsQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    },
    errorCallback,
  )
}

export async function updateBookingStatus(bookingId, status) {
  ensureFirestore()

  if (!bookingId) {
    throw new Error('Booking id is required to update status.')
  }

  await updateDoc(doc(db, 'bookings', bookingId), {
    status,
    statusUpdatedAt: serverTimestamp(),
  })
}

export async function requestBookingCancellation(bookingId) {
  ensureFirestore()

  if (!bookingId) {
    throw new Error('Booking id is required to request cancellation.')
  }

  await updateDoc(doc(db, 'bookings', bookingId), {
    status: 'cancel-requested',
    cancelRequestedAt: serverTimestamp(),
    statusUpdatedAt: serverTimestamp(),
  })
}

export async function deleteBooking(bookingId) {
  ensureFirestore()

  if (!bookingId) {
    throw new Error('Booking id is required to delete a booking.')
  }

  await deleteDoc(doc(db, 'bookings', bookingId))
}

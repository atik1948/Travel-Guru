import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db, hasFirebaseConfig } from '../lib/firebase'

function ensureFirestore() {
  if (!hasFirebaseConfig || !db) {
    throw new Error('Firebase is not configured yet. Add your VITE_FIREBASE_* values to continue.')
  }
}

function normalizeContactMessage(messageData) {
  const { email, message, name, userEmail, userId } = messageData || {}

  if (!name?.trim()) {
    throw new Error('Name is required to send a message.')
  }

  if (!email?.trim()) {
    throw new Error('Email is required to send a message.')
  }

  if (!message?.trim()) {
    throw new Error('Message content is required to send a message.')
  }

  return {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    userId: userId?.trim() || '',
    userEmail: userEmail?.trim() || email.trim(),
  }
}

export async function createContactMessage(messageData) {
  ensureFirestore()
  const normalizedMessage = normalizeContactMessage(messageData)

  return addDoc(collection(db, 'contactMessages'), {
    ...normalizedMessage,
    createdAt: serverTimestamp(),
  })
}

export function subscribeToContactMessages(callback, errorCallback) {
  if (!hasFirebaseConfig || !db) {
    callback([])
    return () => {}
  }

  const messagesQuery = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'))

  return onSnapshot(
    messagesQuery,
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

export async function deleteContactMessage(messageId) {
  ensureFirestore()

  if (!messageId) {
    throw new Error('Message id is required to delete a contact message.')
  }

  await deleteDoc(doc(db, 'contactMessages', messageId))
}

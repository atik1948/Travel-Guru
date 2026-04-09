import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getIdTokenResult,
  GoogleAuthProvider,
  onIdTokenChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, hasFirebaseConfig } from '../lib/firebase'

function ensureFirebase() {
  if (!hasFirebaseConfig || !auth) {
    throw new Error('Firebase is not configured yet. Add your VITE_FIREBASE_* values to continue.')
  }
}

export function subscribeToAuthState(callback) {
  if (!hasFirebaseConfig || !auth) {
    callback(null)
    return () => {}
  }

  return onIdTokenChanged(auth, async (user) => {
    if (!user) {
      callback(null)
      return
    }

    try {
      const tokenResult = await getIdTokenResult(user, true)
      callback({
        ...user,
        customClaims: tokenResult.claims || {},
      })
    } catch {
      callback(user)
    }
  })
}

export async function getCurrentUserWithClaims(forceRefresh = true) {
  ensureFirebase()

  const user = auth.currentUser
  if (!user) {
    return null
  }

  const tokenResult = await getIdTokenResult(user, forceRefresh)
  return {
    ...user,
    customClaims: tokenResult.claims || {},
  }
}

async function applyAuthPersistence(remember = false) {
  ensureFirebase()

  return setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)
}

export async function loginWithEmail({ email, password, remember = false }) {
  ensureFirebase()
  await applyAuthPersistence(remember)
  return signInWithEmailAndPassword(auth, email, password)
}

export async function registerWithEmail({ firstName, lastName, email, password }) {
  ensureFirebase()
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const displayName = `${firstName} ${lastName}`.trim()

  if (displayName) {
    await updateProfile(credential.user, { displayName })
  }

  return credential
}

export async function loginWithGoogle() {
  ensureFirebase()
  await applyAuthPersistence(true)
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return signInWithPopup(auth, provider)
}

export async function logoutUser() {
  ensureFirebase()
  return signOut(auth)
}

export async function sendResetPasswordEmail(email) {
  ensureFirebase()

  if (!email?.trim()) {
    throw new Error('Enter your email address before requesting a password reset.')
  }

  return sendPasswordResetEmail(auth, email.trim())
}

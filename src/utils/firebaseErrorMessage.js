const firebaseErrorMap = {
  'auth/email-already-in-use': 'This email is already in use. Try logging in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/invalid-credential': 'Incorrect email or password. Please try again.',
  'auth/user-not-found': 'No account was found with that email address.',
  'auth/wrong-password': 'Incorrect email or password. Please try again.',
  'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
  'auth/popup-closed-by-user': 'The sign-in popup was closed before the login completed.',
  'auth/cancelled-popup-request': 'Another sign-in popup is already open. Please finish that one first.',
  'auth/popup-blocked': 'Your browser blocked the sign-in popup. Please allow popups and try again.',
  'auth/too-many-requests': 'Too many attempts were made. Please wait a moment and try again.',
  'auth/network-request-failed': 'A network error occurred. Check your connection and try again.',
  'permission-denied': 'You do not have permission to perform this action.',
  unavailable: 'The service is temporarily unavailable. Please try again in a moment.',
}

export function getFirebaseErrorMessage(error, fallbackMessage) {
  if (!error) {
    return fallbackMessage
  }

  if (typeof error === 'string') {
    return firebaseErrorMap[error] || fallbackMessage
  }

  const code = error.code || error.name || ''

  if (code && firebaseErrorMap[code]) {
    return firebaseErrorMap[code]
  }

  return fallbackMessage
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import { hasFirebaseConfig } from '../lib/firebase'
import {
  getCurrentUserWithClaims,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  registerWithEmail,
  sendResetPasswordEmail,
  subscribeToAuthState,
} from '../services/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(hasFirebaseConfig)
  const hasAdminClaim = Boolean(user?.customClaims?.admin)
  const isAdmin = hasAdminClaim
  const canManageAdminData = hasAdminClaim

  useEffect(() => {
    if (!hasFirebaseConfig) {
      return undefined
    }

    const unsubscribe = subscribeToAuthState((nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
    })

    return unsubscribe
  }, [])

  const refreshClaims = useCallback(async () => {
    if (!hasFirebaseConfig) {
      return null
    }

    const nextUser = await getCurrentUserWithClaims(true)
    setUser(nextUser)
    return nextUser
  }, [])

  const value = useMemo(
    () => ({
      user,
      authLoading,
      isAuthenticated: Boolean(user),
      isAdmin,
      hasAdminClaim,
      canManageAdminData,
      hasFirebaseConfig,
      login: loginWithEmail,
      loginWithGoogle,
      register: registerWithEmail,
      logout: logoutUser,
      refreshClaims,
      sendPasswordResetEmail: sendResetPasswordEmail,
    }),
    [authLoading, canManageAdminData, hasAdminClaim, isAdmin, refreshClaims, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

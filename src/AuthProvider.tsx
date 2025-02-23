import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'

import {
  AuthenticationCredentials,
  getAuthenticatedUser,
  loginAuthentication,
  logout,
  register, SignUpFormData,
  UnauthorizedError,
} from '@/api'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { addCookie, removeCookie } from '@/services/cookies.ts'
import { toLocalSession } from '@/services/localSession.ts'
import { appService } from '@/singletons'
import { AuthContext } from '@/useAuth.ts'
import { getLocalSession } from '@/utils/localSession.ts'
import { LocalSessionType } from '@/utils/LocalSessionType.ts'
import { clearLocalStorage } from '@/utils/localStorage.ts'

export interface AuthProviderProps {
  children: React.ReactNode;
}
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticationLoading, setIsAuthenticationLoading] = useState<boolean>(true)
  const [localSession, setLocalSession] = useState<LocalSessionType | null>(null)
  const updateSession = useCallback(async (session: LocalSessionType | null) => {
    if (session) {
      setLocalSession(session)
      toLocalSession(session)
    } else {
      setLocalSession(null)
      clearLocalStorage()
      removeCookie('access-token')
      removeCookie('refresh-token')
    }
  }, [])

  const refreshUserData = useCallback(async ( session: LocalSessionType) => {
    try {
      const user = await getAuthenticatedUser()
      appService.setUserData(user)
      const sessionData: LocalSessionType = {
        userId: user.id,
        parentUserId: user.parentUserId,
        groupId: user.groupId,
        role: user.role,
        currentTeamId: session.currentTeamId || undefined,
      }
      await updateSession(sessionData)
      return user
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        await updateSession(null)
      } else {
        console.error('Unhandled error refreshing user data:', e)
      }
      return undefined
    }
  }, [updateSession])

  const signIn = useCallback(
    async (credentials: AuthenticationCredentials) => {
      try {
        const { user, token, refreshToken, tokenExpires } = await loginAuthentication(credentials)
        addCookie('access-token', token, tokenExpires.toString())
        addCookie('refresh-token', refreshToken, tokenExpires.toString())
        appService.setUserData(user)
        const sessionData: LocalSessionType = {
          userId: user.id,
          parentUserId: user.parentUserId,
          groupId: user.groupId,
          role: user.role,
          currentTeamId: undefined,
        }
        await updateSession(sessionData)
      } catch (e) {
        console.error('Error during sign-in:', e)
        throw e
      }
    },
    [updateSession],
  )

  const signUp = useCallback(async (data: SignUpFormData) => {
    try {
      const res = await register(data)
      if (res.status === 204) {
        const loginData = { email: data.email, password: data.password }
        await signIn(loginData)
      } else {
        console.log('Unexpected response from registration')
      }
    } catch (e) {
      console.error('Registration failed', e)
      throw e
    }
  }, [signIn])

  const signOut = useCallback(async () => {
    try {
      logout().then(() => {
        removeCookie('access-token')
        removeCookie('refresh-token')
        clearLocalStorage()
      })
      await updateSession(null)
    } catch (e) {
      console.error('Error during sign-out:', e)
      throw e
    }
  }, [updateSession])

  useEffect(() => {
    setIsAuthenticationLoading(true)
    const fetchLocalSession = async () => {
      const data = await getLocalSession()
      if (data) {
        try {
          await refreshUserData(data)
        } catch {
          console.error('Error refreshing user data on app load')
        }
      }
      setIsAuthenticationLoading(false)
    }
    fetchLocalSession()
  }, [refreshUserData, updateSession])

  if (isAuthenticationLoading) {
    return <LoadingPage message='Authenticating user...' />
  }

  return (
    <AuthContext.Provider value={{ localSession, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

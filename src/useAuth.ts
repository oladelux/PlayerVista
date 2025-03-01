import { createContext, useContext } from 'react'

import { AuthenticationCredentials, SignUpFormData } from '@/api'
import { LocalSessionType } from '@/utils/LocalSessionType.ts'

export type AuthContextType = {
  localSession: LocalSessionType | null
  signIn: (credentials: AuthenticationCredentials) => Promise<void>
  signOut: () => void
  signUp: (data: SignUpFormData) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    console.warn('useAuth must be used within an AuthProvider')
    return {
      localSession: null,
      signIn: async () => {
        throw new Error('useAuth not properly initialized')
      },
      signOut: () => {
        throw new Error('useAuth not properly initialized')
      },
      signUp: async () => {
        throw new Error('useAuth not properly initialized')
      },
    } satisfies AuthContextType
  }
  return context
}

export default useAuth

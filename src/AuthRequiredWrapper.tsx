import { ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import useAuth from '@/useAuth.ts'

export interface AuthRequiredWrapperProps {
  children: ReactNode
}

export function AuthRequiredWrapper({ children }: AuthRequiredWrapperProps) {
  const { localSession } = useAuth()

  if (!localSession) {
    const redirectTo = window.location.pathname + window.location.search
    return <Navigate to={'/login?redirectTo=' + redirectTo} />
  }

  return children
}

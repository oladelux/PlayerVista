import { useState } from 'react'

import * as api from '../api'
import { isAccessToken } from '../services/helper'
import { RegistrationDetails } from '@/api'
import { useToast } from '@/hooks/use-toast.ts'
import { removeCookie } from '@/services/cookies.ts'
import { LocalSessionType } from '@/utils/LocalSessionType.ts'
import { clearLocalStorage } from '@/utils/localStorage.ts'

export type UserHook = ReturnType<typeof useUser>

export function useUser() {
  const [data, setData] = useState<api.AuthenticatedUserData>()
  const [localSession, setLocalSession] = useState<LocalSessionType | null>(null)
  const { toast } = useToast()

  async function refreshUserData(): Promise<api.AuthenticatedUserData | undefined> {
    try {
      const user = await api.getAuthenticatedUser()
      setData(user)
      return user
    } catch (e) {
      if (e instanceof api.UnauthorizedError) {
        setLocalSession(null)
        removeCookie('access-token')
        removeCookie('refresh-token')
        clearLocalStorage()
      } else {
        console.error('Unhandled error getting user data', e)
      }
      return undefined
    }

  }

  async function getSubscriptionData(): Promise<api.Subscription | undefined> {
    try {
      return await api.getSubscription()
    } catch (e) {
      console.error('Unhandled error getting subscription data', e)
      return undefined
    }
  }

  async function getUserName(id: string): Promise<string> {
    try {
      const user = await api.getUserDetails(id)
      return user.firstName + ' ' + user.lastName
    } catch (e) {
      console.error('Unable to get user full name', e)
      return ''
    }
  }

  async function updateUserData(
    data: Partial<RegistrationDetails>): Promise<api.AuthenticatedUserData | undefined> {
    return api.updateUser(data)
      .then(user => {
        setData(user)
        toast({
          variant: 'success',
          description: 'User updated successfully!',
        })
        return user
      })
      .catch(e => {
        console.error('Unhandled error updating user data', e)
        toast({
          variant: 'error',
          description: 'Error updating user profile!',
        })
        return undefined
      })
  }

  async function initializeApp (): Promise<api.AuthenticatedUserData | undefined> {
    console.debug('Initially loading user data')
    if(isAccessToken()) {
      const user = await refreshUserData()
      if (user) {
        console.log('User is logged in' )
      }
      console.debug('Initial user data loaded')
      return user
    }
  }

  return {
    data,
    localSession,
    refreshUserData,
    getSubscriptionData,
    /**
     * Effect to run at application startup
     */
    initializeApp,
    getUserName,
    updateUserData,
  }
}

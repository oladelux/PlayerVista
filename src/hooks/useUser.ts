import { useState } from 'react'
import * as api from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import { routes } from '../constants/routes'
import { isAccessToken } from '../services/helper'

export type UserHook = ReturnType<typeof useUser>

export function useUser() {
  const [data, setData] = useState<api.AuthenticatedUserData>()
  const navigate = useNavigate()

  function refreshUserData(): Promise<api.AuthenticatedUserData | undefined> {
    return api.getAuthenticatedUser()
      .then(user => {
        setData(user)
        return user
      })
      .catch(e => {
        if (e instanceof api.UnauthorizedError) {
          navigate(routes.login)
        } else {
          console.error('Unhandled error getting user data', e)
        }
        return undefined
      })

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

  async function initializeApp (): Promise<api.AuthenticatedUserData | undefined> {
    console.debug('Initially loading user data')
    if(isAccessToken()) {
      const user = await refreshUserData()
      if (user) {
        console.log('User is logged in' )
      }
      console.debug('Initial user data loaded')
      console.log('usss', user)
      return user
    }
  }

  return {
    data,
    refreshUserData,
    /**
     * Effect to run at application startup
     */
    initializeApp,
    getUserName,
  }
}

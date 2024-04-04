import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import * as api from '../api'
import { ApiError, AuthenticationCredentials, RegistrationDetails } from '../api'
import { routes } from '../constants/routes'
import { UserHook } from './useUser'
import { addCookie, getCookie, removeCookie } from '../services/cookies'
import { useAppDispatch } from '../store/types.ts'
import { clearSettingsState } from '../store/slices/SettingsSlice.ts'
import { clearTeamState } from '../store/slices/TeamSlice.ts'
import { clearPlayerState } from '../store/slices/PlayersSlice.ts'
import { clearEventState } from '../store/slices/EventsSlice.ts'
import { clearLocalStorage } from '../utils/localStorage.ts'

export function useAuthentication (
  user: UserHook,
  afterLogin: (user: api.AuthenticatedUserData) => Promise<void>,
) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const refreshToken = getCookie('refresh-token')

  const [loggingIn, setLoggingIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function register(data: RegistrationDetails) {
    setIsSubmitting(true)
    return api.register(data)
      .then(async (res) => {
        addCookie('access-token', res.tokens.access.token, res.tokens.access.expires)
        addCookie('refresh-token', res.tokens.refresh.token, res.tokens.refresh.expires)
        const userData = await user.refreshUserData()
        if (!userData) {
          throw new Error('Unexpected no user data after registration')
        }
        navigate(routes.team, { replace: true })
      })
      .catch(e => {
        throw e
      })
      .finally(() => setIsSubmitting(false))
  }

  async function loginUser(data: AuthenticationCredentials) {
    setLoggingIn(true)
    api.loginAuthentication(data)
      .then(async res => {
        addCookie('access-token', res.tokens.access.token, res.tokens.access.expires)
        addCookie('refresh-token', res.tokens.refresh.token, res.tokens.refresh.expires)
        const userData = await user.refreshUserData()
        if (!userData) {
          throw new Error('Unexpected no user data after logging in')
        }
        await afterLogin(userData)
        navigate(routes.team)
      })
      .catch(e => {
        console.log('Logging in failed', e)
      })
      .finally(() => setLoggingIn(false))
  }

  function logout() {
    if(refreshToken) {
      api.logout({ refreshToken })
        .then(() => {
          removeCookie('access-token')
          removeCookie('refresh-token')
          clearLocalStorage()
          dispatch(clearSettingsState())
          dispatch(clearTeamState())
          dispatch(clearPlayerState())
          dispatch(clearEventState())
          navigate(routes.login)
        })
        .catch(e => {
          if (e instanceof ApiError) {
            console.error({ message: 'Logout failed', reason: e })
          } else {
            console.error('Unhandled error logging out', e)
          }
        })
    }
  }

  return {
    isSubmitting,
    register,
    loggingIn,
    loginUser,
    logout,
  }
}

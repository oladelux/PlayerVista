import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import * as api from '../api'
import { ApiError, AuthenticationCredentials, SignUpFormData } from '@/api'
import { routes } from '../constants/routes'
import { UserHook } from './useUser'
import { addCookie, removeCookie } from '../services/cookies'
import { useAppDispatch } from '../store/types.ts'
import {
  clearSettingsState,
} from '../store/slices/SettingsSlice.ts'
import { clearTeamState } from '../store/slices/TeamSlice.ts'
import { clearPlayerState } from '../store/slices/PlayersSlice.ts'
import { clearEventState } from '../store/slices/EventsSlice.ts'
import { clearLocalStorage } from '../utils/localStorage.ts'
import { clearStaffState } from '../store/slices/StaffSlice.ts'
import { clearReporterState } from '../store/slices/ReporterSlice.ts'
import { SubscriptionStatus } from '../api'

export type AuthenticationHook = ReturnType<typeof useAuthentication>

export function useAuthentication (
  user: UserHook,
  afterLogin: (user: api.AuthenticatedUserData) => Promise<void>,
) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [loggingIn, setLoggingIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)

  async function register(data: SignUpFormData) {
    setIsSubmitting(true)
    try {
      const res = await api.register(data)
      if (res.status === 204) {
        const loginData = { email: data.email, password: data.password }
        await loginUser(loginData)
      } else {
        console.log('Unexpected response from registration')
      }
    } catch (e) {
      console.error('Registration failed', e)
      throw e
    } finally {
      setIsSubmitting(false)
    }
  }

  async function loginUser(data: AuthenticationCredentials) {
    setLoggingIn(true)
    api.loginAuthentication(data)
      .then(async res => {
        addCookie('access-token', res.token, res.tokenExpires.toString())
        addCookie('refresh-token', res.refreshToken, res.tokenExpires.toString())
        const userData = await user.refreshUserData()
        if (!userData) {
          throw new Error('Unexpected no user data after logging in')
        }
        const parentUserId = userData.parentUserId || userData.id
        await afterLogin(userData)
        const subscription = await user.getSubscriptionData(parentUserId)
        if(subscription){
          if(subscription.status === SubscriptionStatus.ACTIVE){
            navigate(routes.team)
          } else if(subscription.status === SubscriptionStatus.PENDING){
            sessionStorage.setItem('userData', JSON.stringify(userData))
            navigate(routes.selectPlan)
          }
        } else {
          sessionStorage.setItem('userData', JSON.stringify(userData))
          navigate(routes.selectPlan)
        }
      })
      .catch(e => {
        console.log('Logging in failed', e)
      })
      .finally(() => setLoggingIn(false))
  }

  function logout() {
    api.logout()
      .then(() => {
        removeCookie('access-token')
        removeCookie('refresh-token')
        clearLocalStorage()
        dispatch(clearSettingsState())
        dispatch(clearTeamState())
        dispatch(clearPlayerState())
        dispatch(clearEventState())
        dispatch(clearStaffState())
        dispatch(clearReporterState())
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

  function sendEmailVerification() {
    api.sendEmailVerification()
      .then(() => {
        setEmailVerificationSent(true)

        setTimeout(() => {
          setEmailVerificationSent(false)
        }, 3000)
      })
      .catch(e => {
        if (e instanceof ApiError) {
          console.error({ message: 'sending email verification failed', reason: e })
        } else {
          console.error('Unhandled error sending email verification', e)
        }
      })
  }

  return {
    isSubmitting,
    register,
    loggingIn,
    loginUser,
    logout,
    sendEmailVerification,
    emailVerificationSent,
  }
}

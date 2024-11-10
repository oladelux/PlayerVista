import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useAppDispatch } from '../store/types.ts'
import { setCurrentTeam } from '../utils/localStorage.ts'
import { getEventsByTeamThunk } from '../store/slices/EventsSlice.ts'
import { getStaffsThunk } from '../store/slices/StaffSlice.ts'
import { teamSelector } from '../store/slices/TeamSlice.ts'
import { AuthenticatedUserData, verifyEmail } from '@/api'
import { getPlayersByTeamIdThunk } from '@/store/slices/PlayersSlice.ts'

const EMAIL_VERIFICATION_TIMEOUT = 5000

export type CountdownHook = ReturnType<typeof useCountdown>

export const useCountdown = (
  refreshUserData: () => Promise<AuthenticatedUserData | undefined>, token: string | undefined,
) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { teams } = useSelector(teamSelector)
  const [secondsRemaining, setSecondsRemaining] = useState(Math
    .floor(EMAIL_VERIFICATION_TIMEOUT / 1000))
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailVerificationFailed, setEmailVerificationFailed] = useState(false)

  const navigateToDashboard = () => {
    if(token) {
      try {
        verifyEmail(token)
          .then(async () => {
            await refreshUserData()
            setEmailVerified(true)
            setCurrentTeam(teams[0].id)
            await dispatch(getPlayersByTeamIdThunk({ teamId: teams[0].id }))
            await dispatch(getEventsByTeamThunk({ teamId: teams[0].id }))
            await dispatch(getStaffsThunk({ groupId: teams[0].id }))
            // await dispatch(getReportersThunk({ teamId: teams[0].id }))
            navigate(`/team/${teams[0].id}`)
          })
          .catch((error) => {
            console.error('Error verifying email:', error)
            setEmailVerified(false)
            setEmailVerificationFailed(true)
          })
      }
      catch (e) {
        console.error('Unable to verify email address', e)
        setEmailVerified(false)
      }
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 0) {
          return prev - 1
        } else {
          clearInterval(intervalId)
          navigateToDashboard()
          return 0
        }
      })

    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return {
    secondsRemaining,
    navigateToDashboard,
    emailVerified,
    emailVerificationFailed,
  }
}

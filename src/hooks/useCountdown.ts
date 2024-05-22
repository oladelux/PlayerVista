import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useAppDispatch } from '../store/types.ts'
import { setCurrentTeam } from '../utils/localStorage.ts'
import { getPlayersThunk } from '../store/slices/PlayersSlice.ts'
import { getEventsThunk } from '../store/slices/EventsSlice.ts'
import { getStaffsThunk } from '../store/slices/StaffSlice.ts'
import { teamSelector } from '../store/slices/TeamSlice.ts'
import { getReportersThunk } from '../store/slices/ReporterSlice.ts'
import { AuthenticatedUserData, verifyEmail } from '../api'

const EMAIL_VERIFICATION_TIMEOUT = 5000

export type CountdownHook = ReturnType<typeof useCountdown>

export const useCountdown = (
  refreshUserData: () => Promise<AuthenticatedUserData | undefined>,
) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { teams } = useSelector(teamSelector)
  const { token } = useParams()
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
            await dispatch(getPlayersThunk({ teamId: teams[0].id }))
            await dispatch(getEventsThunk({ teamId: teams[0].id }))
            await dispatch(getStaffsThunk({ teamId: teams[0].id }))
            await dispatch(getReportersThunk({ teamId: teams[0].id }))
            navigate(`/team/${teams[0].id}`)
            console.log('Inside Navigation function')
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
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1)
      } else {
        clearInterval(intervalId)
        navigateToDashboard()
      }

    }, 1000)

    return () => clearInterval(intervalId)
  }, [ secondsRemaining ])

  return {
    secondsRemaining,
    navigateToDashboard,
    emailVerified,
    emailVerificationFailed,
  }
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthenticatedUserData, confirmEmail } from '@/api'
import { routes } from '@/constants/routes.ts'

const EMAIL_VERIFICATION_TIMEOUT = 5000

export type CountdownHook = ReturnType<typeof useCountdown>

export const useCountdown = (
  refreshUserData: () => Promise<AuthenticatedUserData | undefined>, hash: string | undefined,
) => {
  const navigate = useNavigate()
  const [secondsRemaining, setSecondsRemaining] = useState(Math
    .floor(EMAIL_VERIFICATION_TIMEOUT / 1000))
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailVerificationFailed, setEmailVerificationFailed] = useState(false)

  const navigateToDashboard = () => {
    if(hash) {
      try {
        confirmEmail({ hash })
          .then(async () => {
            await refreshUserData()
            setEmailVerified(true)
            navigate(routes.team)
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

import { FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthenticatedUserData, TeamResult } from '../../api'
import { CountdownHook } from '../../hooks/useCountdown.ts'

import { DashboardHeader } from '../../component/DashboardLayout/DashboardLayout'

import './EmailVerification.scss'

type EmailVerificationProps = {
  teams: TeamResult[]
  user: AuthenticatedUserData
  countdown: CountdownHook
}

export const EmailVerification: FC<EmailVerificationProps> = ({ teams, user, countdown }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (teams.length > 0) {
      if(user.isEmailVerified) {
        navigate(`/team/${teams[0].id}`)
      }
    }
  }, [teams, user.isEmailVerified])

  return (
    <>
      <DashboardHeader teams={teams}/>
      <div className='Email-verification'>
        {!countdown.emailVerified &&
            <div className='Email-verification__wrapper'>
              <div className='Email-verification__wrapper-title'>Verifying Email Address</div>
              <div className='Email-verification__wrapper-text'>Redirecting to dashboard in {countdown.secondsRemaining}</div>
              <div className='Email-verification__wrapper-text'>
                Click <Link
                  to='#'
                  onClick={countdown.navigateToDashboard}
                  className='Email-verification__wrapper-text--link'
                >here</Link> if it doesn't automatically redirect
              </div>
              {countdown.emailVerificationFailed &&
                <div className='Email-verification__wrapper-failed'>Email verification unsuccessful...</div>
              }
            </div>
        }
      </div>
    </>
  )
}

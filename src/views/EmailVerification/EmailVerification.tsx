import { FC, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { AuthenticatedUserData, TeamResult } from '../../api'
import { useCountdown } from '../../hooks/useCountdown.ts'
import { UserHook } from '../../hooks/useUser.ts'

import { DashboardHeader } from '../../component/DashboardLayout/DashboardLayout'

import './EmailVerification.scss'

type EmailVerificationProps = {
  teams: TeamResult[]
  user: AuthenticatedUserData
  userHook: UserHook
}

export const EmailVerification: FC<EmailVerificationProps> = ({ teams, user, userHook }) => {
  const navigate = useNavigate()
  const { token } = useParams()
  const countdown = useCountdown(userHook.refreshUserData, token)

  useEffect(() => {
    if (teams.length > 0 && user.isEmailVerified) {
      navigate(`/team/${teams[0].id}`)
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

import { FC } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import SendIcon from '@mui/icons-material/Send'
import { Snackbar } from '@mui/material'

import { AuthenticatedUserData, Fixtures, LogType, TeamResult } from '../../api'
import { AuthenticationHook } from '../../hooks/useAuthentication.ts'

import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { Card } from '../../component/Card/Card'
import { UpcomingMatch } from '../../component/UpcomingMatch/UpcomingMatch'
import { StatsCard } from '../../component/StatsCard/StatsCard'
import { PlayerMetrics } from '../../component/PlayerMetrics/PlayerMetrics'
import { Update } from '../../component/Update/Update'

import PointIcon from '../../assets/images/icons/point.png'

import './Dashboard.scss'

type DashboardProps = {
  teamResult: Fixtures[]
  teams: TeamResult[]
  applicationLogs: LogType[]
  user: AuthenticatedUserData
  authentication: AuthenticationHook
}

export const Dashboard: FC<DashboardProps> = props => {
  const { teamId } = useParams()
  const currentTeam = props.teams.find((team) => team.id === teamId)
  const { sendEmailVerification, emailVerificationSent } = props.authentication

  return (
    <DashboardLayout>
      <div className='Dashboard'>
        {!props.user.isEmailVerified &&
          <div className='Dashboard__notification'>
            <div className='Dashboard__notification-icon'>
              <img src={PointIcon} alt='pointIcon' width={40} />
            </div>
            <div className='Dashboard__notification-content'>
              <div className='Dashboard__notification-content--title'>Please confirm your account</div>
              <div className='Dashboard__notification-content--text'>
                You have signed up with <span
                  className='Dashboard__notification-content--text-bold'>{props.user.email}</span>
              </div>
              <div className='Dashboard__notification-content--text'>Check your email inbox and confirm the link sent to
                you
              </div>
              <div className='Dashboard__notification-content--action'>
                <Link to='#' className='Dashboard__notification-content--action-link'>
                  <EmailOutlinedIcon className='Dashboard__notification-content--action-link--icon'/>Change email</Link>
                <div onClick={sendEmailVerification} className='Dashboard__notification-content--action-link'>
                  <SendIcon className='Dashboard__notification-content--action-link--icon'/> Resend link</div>
              </div>
            </div>
          </div>
        }
        <div className='Dashboard__content'>
          <Card className='Dashboard__content-first'>
            <Update applicationLogs={props.applicationLogs} />
          </ Card>
          <Card className='Dashboard__content-second'>
            <UpcomingMatch team={currentTeam} />
          </Card>
        </div>
        <div className='Dashboard__section'>
          <Card className='Dashboard__section-card'>
            <StatsCard team={currentTeam} />
          </Card>
          {/*<Card className='Dashboard__section-card'>
            <PlayerMetrics team={currentTeam} />
          </Card>*/}
        </div>
      </div>
      <Snackbar
        open={emailVerificationSent}
        message='Email sent'
        className='Dashboard__snackbar'
      />
    </DashboardLayout>
  )
}

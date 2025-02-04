import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import SendIcon from '@mui/icons-material/Send'
import { Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import PointIcon from '../../assets/images/icons/point.png'
import { Card } from '../../component/Card/Card'
import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { StatsCard } from '../../component/StatsCard/StatsCard'
import { UpcomingMatch } from '../../component/UpcomingMatch/UpcomingMatch'
import { Update } from '../../component/Update/Update'
import { ApiError, LogType } from '@/api'
import * as api from '@/api'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { useTeam } from '@/hooks/useTeam.ts'
import { appService, logService } from '@/singletons'
import './Dashboard.scss'

export function Dashboard() {
  const { teamId } = useParams()
  const userData = appService.getUserData()
  const { team: currentTeam, error, loading } = useTeam(teamId)

  const [ logs, setLogs ] = useState<LogType[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsError, setLogsError] = useState<string | undefined>(undefined)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)

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

  useEffect(() => {
    const logSubscription = logService.log$.subscribe(state => {
      setLogs(state.logs)
      setLogsLoading(state.loading)
      setLogsError(state.error)
    })
    logService.getLogs()

    return () => {
      logSubscription.unsubscribe()
    }
  }, [])

  console.log('logsLoading', logsLoading)
  console.log('loading', loading)
  if (loading) return <LoadingPage />
  //TODO: Create Error Page
  if (error || logsError || !userData) return 'This is an error page'

  return (
    <DashboardLayout>
      <div className='Dashboard'>
        {!userData.isEmailVerified &&
          <div className='Dashboard__notification'>
            <div className='Dashboard__notification-icon'>
              <img src={PointIcon} alt='pointIcon' width={40} />
            </div>
            <div className='Dashboard__notification-content'>
              <div className='Dashboard__notification-content--title'>Please confirm your account</div>
              <div className='Dashboard__notification-content--text'>
                You have signed up with <span
                  className='Dashboard__notification-content--text-bold'>{userData.email}</span>
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
            <Update applicationLogs={logs} />
          </ Card>
          <Card className='Dashboard__content-second'>
            <UpcomingMatch team={currentTeam} />
          </Card>
        </div>
        <div className='Dashboard__section'>
          <Card className='Dashboard__section-card'>
            <StatsCard team={currentTeam} />
          </Card>
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

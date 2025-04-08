import { Fragment, useEffect, useState } from 'react'

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import SendIcon from '@mui/icons-material/Send'
import { Snackbar } from '@mui/material'
import { Calendar, Trophy, UserCog, Users } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'

import * as api from '@/api'
import { ApiError, LogType } from '@/api'
import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { UpcomingMatches } from '@/component/UpcomingMatches/UpcomingMatches'
import { appService, logService } from '@/singletons'
import { SessionInstance } from '@/utils/SessionInstance.ts'

import PointIcon from '../../assets/images/icons/point.png'
import { RecentActivity } from '../../component/RecentActivity/RecentActivity'
import { StatsCard } from '../../component/StatsCard/StatsCard'
import './Dashboard.scss'
// eslint-disable-next-line import/order
import { PlayerPerformanceCard } from './PlayerPerformanceCard'

export function Dashboard() {
  const teamId = SessionInstance.getTeamId()
  const userData = appService.getUserData()
  const {
    teams,
    teamsError: error,
    teamsLoading: loading,
  } = useOutletContext<DashboardLayoutOutletContext>()
  const currentTeam = teams.find(team => team.id === teamId)

  const [logs, setLogs] = useState<LogType[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsError, setLogsError] = useState<string | undefined>(undefined)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)

  function sendEmailVerification() {
    api
      .sendEmailVerification()
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

  if (loading || logsLoading) return <LoadingPage />
  //TODO: Create Error Page
  if (error || logsError || !userData) return 'This is an error page'

  return (
    <Fragment>
      <div className='Dashboard'>
        {!userData.isEmailVerified && (
          <div className='Dashboard__notification'>
            <div className='Dashboard__notification-icon'>
              <img src={PointIcon} alt='pointIcon' width={40} />
            </div>
            <div className='Dashboard__notification-content'>
              <div className='Dashboard__notification-content--title'>
                Please confirm your account
              </div>
              <div className='Dashboard__notification-content--text'>
                You have signed up with{' '}
                <span className='Dashboard__notification-content--text-bold'>{userData.email}</span>
              </div>
              <div className='Dashboard__notification-content--text'>
                Check your email inbox and confirm the link sent to you
              </div>
              <div className='Dashboard__notification-content--action'>
                <Link to='#' className='Dashboard__notification-content--action-link'>
                  <EmailOutlinedIcon className='Dashboard__notification-content--action-link--icon' />
                  Change email
                </Link>
                <div
                  onClick={sendEmailVerification}
                  className='Dashboard__notification-content--action-link'
                >
                  <SendIcon className='Dashboard__notification-content--action-link--icon' /> Resend
                  link
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='space-y-6 p-4 md:p-6'>
          <div className='dash-section grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <StatsCard
              title='Total Teams'
              value={teams.length}
              description='Active football teams'
              icon={<Users size={20} className='text-primary' />}
              //TODO: Add trend
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatsCard
              title='Total Players'
              value='2'
              description='Across all teams'
              icon={<UserCog size={20} className='text-indigo-500' />}
              //TODO: Add trend
              trend={{ value: 4.2, isPositive: true }}
            />
            <StatsCard
              title='Upcoming Matches'
              value='12'
              description='In the next 30 days'
              icon={<Calendar size={20} className='text-amber-500' />}
            />
            <StatsCard
              title='Win Rate'
              value='64%'
              description='Season average'
              icon={<Trophy size={20} className='text-emerald-500' />}
              trend={{ value: 2.8, isPositive: true }}
            />
          </div>
          <div className='dash-section grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <PlayerPerformanceCard />
            <RecentActivity applicationLogs={logs} />
          </div>
          <div className='dash-section grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <UpcomingMatches team={currentTeam} />
          </div>
        </div>
      </div>
      <Snackbar open={emailVerificationSent} message='Email sent' className='Dashboard__snackbar' />
    </Fragment>
  )
}

import { Fragment, useEffect, useState } from 'react'

import { Snackbar } from '@mui/material'
import { Calendar, Trophy, UserCog, Users } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

import * as api from '@/api'
import { ApiError, LogType } from '@/api'
import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { UpcomingMatches } from '@/component/UpcomingMatches/UpcomingMatches'
import { useEvents } from '@/hooks/useEvents'
import { usePlayer } from '@/hooks/usePlayer'
import { appService, logService } from '@/singletons'
import { combineDateAndTime } from '@/utils/dateObject'
import { SessionInstance } from '@/utils/SessionInstance.ts'

import { RecentActivity } from '../../component/RecentActivity/RecentActivity'
import { StatsCard } from '../../component/StatsCard/StatsCard'
// eslint-disable-next-line import/order
import { PlayerPerformanceCard } from './PlayerPerformanceCard'

import './Dashboard.scss'

// eslint-disable-next-line import/order
import { VerificationAlert } from '@/component/VerificationAlert/VerificationAlert'

export function Dashboard() {
  const teamId = SessionInstance.getTeamId()
  const userData = appService.getUserData()
  const { allUserPlayers, loading: playersLoading, error: playersError } = usePlayer()
  const { events } = useEvents(teamId, undefined)
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

  const [showVerificationAlert, setShowVerificationAlert] = useState(false)

  useEffect(() => {
    const alertDismissed = localStorage.getItem('verification_alert_dismissed') === 'true'
    setShowVerificationAlert(!alertDismissed && !userData?.isEmailVerified)
  }, [userData?.isEmailVerified])

  const handleDismissAlert = () => {
    localStorage.setItem('verification_alert_dismissed', 'true')
    setShowVerificationAlert(false)
  }

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

  // Get upcoming matches in the next 30 days
  const matches = events.filter(event => event.type === 'match')
  const currentTimestamp = new Date().getTime()
  const thirtyDaysFromNow = currentTimestamp + 30 * 24 * 60 * 60 * 1000

  const upcomingMatches = matches.filter(match => {
    const matchTimestamp = new Date(combineDateAndTime(match.date, match.time)).getTime()
    return matchTimestamp > currentTimestamp && matchTimestamp <= thirtyDaysFromNow
  })

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

  if (loading || logsLoading || playersLoading) return <LoadingPage />
  //TODO: Create Error Page
  if (error || logsError || playersError || !userData) return 'This is an error page'

  return (
    <Fragment>
      <div className='space-y-6 p-4 md:p-6'>
        {!userData.isEmailVerified && showVerificationAlert && (
          <VerificationAlert onDismiss={handleDismissAlert} onResend={sendEmailVerification} />
        )}
        <div className='dash-section grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatsCard
            title='Total Teams'
            value={teams.length}
            description='Active football teams'
            icon={<Users size={20} className='text-primary' />}
          />
          <StatsCard
            title='Total Players'
            value={allUserPlayers.length}
            description='Across all teams'
            icon={<UserCog size={20} className='text-indigo-500' />}
          />
          <StatsCard
            title='Upcoming Matches'
            value={upcomingMatches.length}
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
      <Snackbar open={emailVerificationSent} message='Email sent' className='Dashboard__snackbar' />
    </Fragment>
  )
}

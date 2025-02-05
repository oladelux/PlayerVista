import { useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'

import ClubLogo from '../../../assets/images/club.png'
import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { useEvents } from '@/hooks/useEvents.ts'
import { usePlayer } from '@/hooks/usePlayer.ts'
import { AttackingStats } from '@/views/SingleEventView/EventSummary/stats/AttackingStats.tsx'
import { DefendingStats } from '@/views/SingleEventView/EventSummary/stats/DefendingStats.tsx'
import { GeneralStats } from '@/views/SingleEventView/EventSummary/stats/GeneralStats.tsx'
import { GoalKeeperStats } from '@/views/SingleEventView/EventSummary/stats/GoalKeeperStats.tsx'
import { OtherStats } from '@/views/SingleEventView/EventSummary/stats/OtherStats.tsx'

import './EventSummary.scss'

export function EventSummary() {
  const [value, setValue] = useState('general')
  const { teamId, eventId } = useParams()
  const { teams, teamsError: error, teamsLoading: loading } =
    useOutletContext<DashboardLayoutOutletContext>()
  const team = teams.find(team => team.id === teamId)
  const { event, error: eventError, loading: eventLoading } = useEvents(undefined, eventId)
  const { players, loading: playerLoading, error: playerError } = usePlayer(undefined, teamId)

  if (loading || playerLoading || eventLoading) return <LoadingPage />
  //TODO: Create Error Page
  if (error || playerError || eventError) return 'This is an error page'

  return (
    <div className='Event-summary'>
      <div className='Event-summary__header'>
        <div className='Event-summary__header-home'>
          <div className='Event-summary__header-home--media'>
            <img src={team?.logo} width={64} alt='club-logo' />
          </div>
          <div className='Event-summary__header-home--name'>
            {team?.teamName}
          </div>
        </div>
        <div className='Event-summary__header-score'>
            vs
        </div>
        <div className='Event-summary__header-away'>
          <div className='Event-summary__header-away--name'>
            {event?.opponent}
          </div>
          <div className='Event-summary__header-away--media'>
            <img src={ClubLogo} alt='club-logo'/>
          </div>
        </div>
      </div>
      <div className='Event-summary__content'>
        <div className='mb-8 bg-white p-4'>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue defaultValue={value} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='general'>General Info</SelectItem>
              <SelectItem value='goalkeeping'>Goalkeeping</SelectItem>
              <SelectItem value='defending'>Defending</SelectItem>
              <SelectItem value='attacking'>Attacking</SelectItem>
              <SelectItem value='otherstats'>Other Stats</SelectItem>
            </SelectContent>
          </Select>
          {value === 'general' && <GeneralStats players={players} />}
          {value === 'goalkeeping' && <GoalKeeperStats players={players} />}
          {value === 'defending' && <DefendingStats players={players} />}
          {value === 'attacking' && <AttackingStats players={players} />}
          {value === 'otherstats' && <OtherStats players={players} />}
        </div>
      </div>
    </div>
  )
}

import { useParams } from 'react-router-dom'

import { EventCalender } from '../../component/EventCalender/EventCalender.tsx'
import { useEvents } from '@/hooks/useEvents.ts'
import { useUpdates } from '@/hooks/useUpdates.ts'

import './EventsView.scss'
import { SessionInstance } from '@/utils/SessionInstance.ts'


export function EventsView() {
  const teamId = SessionInstance.getTeamId()
  const { events } = useEvents(teamId, undefined)
  const logger = useUpdates()
  const pastMatches = events.filter(match => new Date(match.endDate) < new Date())
  const upcomingMatches = events.filter(match => new Date(match.endDate) > new Date())

  return (
    <div className='Events-view'>
      <div className='Events-view__header'>
        <div className='Events-view__header-card'>
          <div className='Events-view__header-card-title'>Total Matches Created</div>
          <div className='Events-view__header-card-value'>{events.length}</div>
        </div>
        <div className='Events-view__header-card'>
          <div className='Events-view__header-card-title'>Total Matches Played</div>
          <div className='Events-view__header-card-value'>{pastMatches.length}</div>
        </div>
        <div className='Events-view__header-card'>
          <div className='Events-view__header-card-title'>Upcoming Matches</div>
          <div className='Events-view__header-card-value'>{upcomingMatches.length}</div>
        </div>
      </div>
      <div className='Events-view__content'>
        <EventCalender events={events} logger={logger} />
      </div>
    </div>
  )
}

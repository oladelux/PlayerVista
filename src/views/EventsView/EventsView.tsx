import React, { FC } from 'react'

import { AuthenticatedUserData } from '../../api'
import { UseUpdates } from '../../hooks/useUpdates.ts'
import { useEvents } from '../../hooks/useEvents.ts'

import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { EventCalender } from '../../component/EventCalender/EventCalender.tsx'

import './EventsView.scss'

type EventsViewProps = {
  logger: UseUpdates
  user: AuthenticatedUserData
}

export const EventsView: FC<EventsViewProps> = props => {
  const { currentEvents } = useEvents()
  const pastMatches = currentEvents.filter(match => new Date(match.endDate) < new Date())
  const upcomingMatches = currentEvents.filter(match => new Date(match.endDate) > new Date())

  return (
    <DashboardLayout>
      <div className='Events-view'>
        <div className='Events-view__header'>
          <div className='Events-view__header-card'>
            <div className='Events-view__header-card-title'>Total Matches Created</div>
            <div className='Events-view__header-card-value'>{currentEvents.length}</div>
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
          <EventCalender events={currentEvents} user={props.user} logger={props.logger} />
        </div>
      </div>
    </DashboardLayout>
  )
}

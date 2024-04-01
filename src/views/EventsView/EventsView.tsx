import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

import { Event } from '../../api'

import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { EventCalender } from '../../component/EventCalender/EventCalender.tsx'

import './EventsView.scss'

type EventsViewProps = {
  events: Record<string, Event[]>
}

export const EventsView: FC<EventsViewProps> = props => {
  const { teamId } = useParams()

  const currentEvents = teamId && Object.prototype.hasOwnProperty.call(props.events, teamId)
    ? props.events[teamId]
    : []

  return (
    <DashboardLayout>
      <div className='Events-view'>
        <div className='Events-view__header'>
          <div className='Events-view__header-card'>
            <div className='Events-view__header-card-title'>Total Events Created</div>
            <div className='Events-view__header-card-value'>{currentEvents.length}</div>
            <div></div>
          </div>
          <div className='Events-view__header-card'>
            <div className='Events-view__header-card-title'>Total Matches Played</div>
            <div className='Events-view__header-card-value'>82</div>
            <div className='Events-view__header-card-info'>
              <div className='Events-view__header-card-info-metric'>
                <div
                  className={'Events-view__header-card-info-metric--value Events-view__header-card-info-metric--value-up'}>
                  <ArrowUpwardIcon /> 24%
                </div>
                <div className='Events-view__header-card-info-metric--text'>vs last month</div>
              </div>
              <div className='Events-view__header-card-info-media'>
                <TrendingUpIcon
                  className={'Events-view__header-card-info-media--icon Events-view__header-card-info-media--icon-up'}
                />
              </div>
            </div>
          </div>
          <div className='Events-view__header-card'>
            <div className='Events-view__header-card-title'>Total Trainings Done</div>
            <div className='Events-view__header-card-value'>10</div>
            <div className='Events-view__header-card-info'>
              <div className='Events-view__header-card-info-metric'>
                <div
                  className={'Events-view__header-card-info-metric--value Events-view__header-card-info-metric--value-down'}
                >
                  <ArrowDownwardIcon /> 6.9%
                </div>
                <div className='Events-view__header-card-info-metric--text'>vs last month</div>
              </div>
              <div className='Events-view__header-card-info-media'>
                <TrendingDownIcon className={'Events-view__header-card-info-media--icon Events-view__header-card-info-media--icon-down'} />
              </div>
            </div>
          </div>
        </div>
        <div className='Events-view__content'>
          <EventCalender events={currentEvents} />
        </div>
      </div>
    </DashboardLayout>
  )
}

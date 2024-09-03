import React, { FC } from 'react'
import { useSelector } from 'react-redux'

import { eventsSelector } from '@/store/slices/EventsSlice.ts'
import { Event, TeamResult } from '@/api'
import { formatSingleEventDate, formatSingleEventTime } from '@/utils/date.ts'

import ClubLogo from '../../assets/images/club.png'

import './UpcomingMatch.scss'

// Get current time in UTC for comparison
const now = new Date().toISOString()

// Function to find upcoming match
function findUpcomingFixture(events: Event[] | undefined) {
  if(events) {
    return events.find(
      (event) => event.type === 'match' && new Date(event.startDate) > new Date(now),
    )
  }
}

const NoUpcomingMatch = () => {
  return (
    <div className='No-upcoming-match'>No matches available</div>
  )
}

type UpcomingMatchProps = {
  team: TeamResult | undefined
}

export const UpcomingMatch:FC<UpcomingMatchProps> = props => {
  const { events } = useSelector(eventsSelector)

  const upcomingFixture = findUpcomingFixture(events)

  return (
    <div className='Upcoming-match'>
      <div className='Upcoming-match__content'>
        <div className='Upcoming-match__content-tile'>Upcoming Match</div>
        {
          upcomingFixture ?
            <div className='Upcoming-match__content-details'>
              <div className='Upcoming-match__content-details-date'>
                {formatSingleEventDate(upcomingFixture.startDate)} /
                {formatSingleEventTime(upcomingFixture.startDate)}</div>
              <div className='Upcoming-match__content-details-board'>
                <div className='Upcoming-match__content-details-board--home'>
                  <div className='Upcoming-match__content-details-board--home-media'>
                    <img src={props.team?.logo} alt='team-logo' />
                  </div>
                  <div className='Upcoming-match__content-details-board--home-name'>
                    {props.team?.teamName}
                  </div>
                </div>
                <div className='Upcoming-match__content-details-board--versus'>vs</div>
                <div className='Upcoming-match__content-details-board--away'>
                  <div className='Upcoming-match__content-details-board--away-media'>
                    <img src={ClubLogo} alt='team-logo' />
                  </div>
                  <div className='Upcoming-match__content-details-board--away-name'>
                    {upcomingFixture.opponent}
                  </div>
                </div>
              </div>
              <div className='Upcoming-match__content-details-location'>
                {upcomingFixture.eventLocation}
              </div>
            </div>
            : <NoUpcomingMatch />
        }
      </div>
    </div>
  )
}

import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { eventsSelector } from '../../store/slices/EventsSlice.ts'
import { renderUpcomingFixtureDate } from '../../services/helper.ts'
import { Event } from '../../api'

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

export const UpcomingMatch = () => {
  const { teamId } = useParams()
  const { events } = useSelector(eventsSelector)

  const currentTeamEvents = events[teamId!]
  const upcomingFixture = findUpcomingFixture(currentTeamEvents)

  return (
    <div className='Upcoming-match'>
      <div className='Upcoming-match__content'>
        <div className='Upcoming-match__content-tile'>Upcoming Match</div>
        {
          upcomingFixture ?
            <div className='Upcoming-match__content-details'>
              <div>{renderUpcomingFixtureDate(upcomingFixture.startDate)}</div>
              <div>Match</div>
              <div>{upcomingFixture.eventLocation}</div>
            </div>
            : <NoUpcomingMatch />
        }
      </div>
    </div>
  )
}

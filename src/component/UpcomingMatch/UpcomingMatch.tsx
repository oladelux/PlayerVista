import React from 'react'

import './UpcomingMatch.scss'

const NoUpcomingMatch = () => {
  return (
    <div className='No-upcoming-match'>No matches available</div>
  )
}

export const UpcomingMatch = () => {
  const isMatchAvailable = false
  return (
    <div className='Upcoming-match'>
      <div className='Upcoming-match__content'>
        <div className='Upcoming-match__content-tile'>Upcoming Match</div>
        {
          isMatchAvailable ?
            <div className='Upcoming-match__content-details'>
              <div>Wed, Feb 14/ 12:00pm</div>
              <div>Match</div>
              <div>Emirate Stadium</div>
            </div>
            : <NoUpcomingMatch />
        }
      </div>
    </div>
  )
}

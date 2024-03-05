import React, { FC } from 'react'

import { Fixtures } from '../../api'

import './RecentlyPlayed.scss'

type RecentlyPlayedProps = {
  teamResult: Fixtures[]
}

const NoMatches = () => {
  return (
    <div className='No-matches'>No matches available</div>
  )
}

export const RecentlyPlayed: FC<RecentlyPlayedProps> = props => {
  const isResultAvailable = props.teamResult.length > 0
  return (
    <div className='Recently-played'>
      <div className='Recently-played__title'>Recently Played</div>
      {isResultAvailable ? <div>
        {
          props.teamResult.map(result => (
            <div></div>
          ))
        }
      </div>
      : <NoMatches />
      }
    </div>
  )
}

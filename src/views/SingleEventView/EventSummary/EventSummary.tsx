import { FC, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'

import { Player, TeamResult } from '../../../api'
import { getPerformanceDataThunk } from '../../../store/slices/PlayerPerformanceSlice.ts'
import { useAppDispatch } from '../../../store/types.ts'
import { EventsHook } from '../../../hooks/useEvents.ts'

import { DashboardLayout } from '../../../component/DashboardLayout/DashboardLayout.tsx'
import { TabButton } from '../../../component/TabButton/TabButton.tsx'
import { TabContent } from '../../../component/TabContent/TabContent.tsx'
import { PlayerSummaryStats } from './PlayerSummaryStats/PlayerSummaryStats.tsx'

import ClubLogo from '../../../assets/images/club.png'

import './EventSummary.scss'

const tabCategory = ['Player Stats']

type EventSummaryProps = {
  players: Player[]
  events: EventsHook
  teams: TeamResult[]
}

export const EventSummary:FC<EventSummaryProps> = ({ players, events, teams }) => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const { teamId, eventId } = useParams()
  const dispatch = useAppDispatch()

  const activeCategory = selectedCategory || tabCategory[0]

  const isEvent = useMemo(() => {
    if(teamId) {
      return events.events[teamId] && events.events[teamId].find(event => event.id === eventId)
    }
  }, [teamId, events, eventId])

  const isTeam = useMemo(() => {
    if(teams) {
      return teams.find(team => team.id === teamId)
    }
  }, [teamId, teams])

  useEffect(() => {
    if(eventId) {
      dispatch(getPerformanceDataThunk({ eventId }))
    }
  }, [ eventId ])

  return (
    <DashboardLayout>
      <div className='Event-summary'>
        <div className='Event-summary__header'>
          <div className='Event-summary__header-home'>
            <div className='Event-summary__header-home--media'>
              <img src={isTeam?.logo} width={64} alt='club-logo' />
            </div>
            <div className='Event-summary__header-home--name'>
              {isTeam?.teamName}
            </div>
          </div>
          <div className='Event-summary__header-score'>
            vs
          </div>
          <div className='Event-summary__header-away'>
            <div className='Event-summary__header-away--name'>
              {isEvent?.opponent}
            </div>
            <div className='Event-summary__header-away--media'>
              <img src={ClubLogo} alt='club-logo'/>
            </div>
          </div>
        </div>
        <div className='Event-summary__content'>
          <div className='Event-summary__content-tab'>
            {tabCategory.map(category =>
              <TabButton
                className='Event-summary__content-tab-category'
                key={category}
                isActive={activeCategory === category}
                onClick={() => setSelectedCategory(category)}>{category}
              </TabButton>,
            )}
          </div>
          <div className='Event-summary__content-section'>
            {tabCategory.map(category =>
              <TabContent key={category} isActive={activeCategory === category}>
                {/*{category === 'Summary' && <SummaryContent />}*/}
                {category === 'Player Stats' && <PlayerSummaryStats players={players} />}
              </TabContent>,
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

const SummaryContent = () => {
  return (
    <div className='Summary-wrapper'>
      <div className='Summary-wrapper__content'>
        <div className='Summary-wrapper__content-box'>
          <div className='Summary-wrapper__content-box-data'>
            <div className='Summary-wrapper__content-box-data--home'>34%</div>
            <div className='Summary-wrapper__content-box-data--title'>Possession</div>
            <div className='Summary-wrapper__content-box-data--away'>66%</div>
          </div>
          <div className='Summary-wrapper__content-box-bar'>
            <div className='Summary-wrapper__content-box-bar--home'>
              <LinearProgress
                className='Summary-wrapper__content-box-bar--home-signal'
                value={34}
                sx={{
                  '.MuiLinearProgress-bar': {
                    transform: `translateX(${100 - 34}%)!important`,
                  },
                }}
                variant='determinate'
              />
            </div>
            <div className='Summary-wrapper__content-box-bar--away'>
              <LinearProgress className='Summary-wrapper__content-box-bar--away-signal' value={66}
                variant='determinate'/>
            </div>
          </div>
        </div>
        <div className='Summary-wrapper__content-box'>
          <div className='Summary-wrapper__content-box-data'>
            <div className='Summary-wrapper__content-box-data--home'>10</div>
            <div className='Summary-wrapper__content-box-data--title'>Total Shots</div>
            <div className='Summary-wrapper__content-box-data--away'>7</div>
          </div>
          <div className='Summary-wrapper__content-box-bar'>
            <div className='Summary-wrapper__content-box-bar--home'>
              <LinearProgress
                className='Summary-wrapper__content-box-bar--home-signal'
                value={54}
                sx={{
                  '.MuiLinearProgress-bar': {
                    transform: `translateX(${100 - 46}%)!important`,
                  },
                }}
                variant='determinate'
              />
            </div>
            <div className='Summary-wrapper__content-box-bar--away'>
              <LinearProgress className='Summary-wrapper__content-box-bar--away-signal' value={46}
                variant='determinate'/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

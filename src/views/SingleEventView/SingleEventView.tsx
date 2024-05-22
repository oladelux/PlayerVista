import { FC, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'

import { TeamResult, Event } from '../../api'
import { formatDate } from '../../services/helper.ts'
import { formatSingleEventDate, formatSingleEventTime } from '../../utils/date.ts'
import { EventsHook } from '../../hooks/useEvents.ts'

import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout.tsx'
import { Button } from '../../component/Button/Button.tsx'

import ClubLogo from '../../assets/images/club.png'

import './SingleEventView.scss'

type SingleEventViewProps = {
  events: EventsHook
  teams: TeamResult[]
}

const now = new Date()

export const SingleEventView: FC<SingleEventViewProps> = props => {
  const { events, teams } = props
  const { teamId, eventId } = useParams()

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

  const isMatches = useMemo(() => {
    if(teamId) {
      return events.events[teamId] && events.events[teamId].filter(event =>
        event.type === 'match' && new Date(event.startDate) > now)
    }
  }, [teamId, events])

  const isTraining = useMemo(() => {
    if(teamId) {
      return events.events[teamId] && events.events[teamId].filter(event =>
        event.type === 'training' && new Date(event.startDate) > now)
    }
  }, [teamId, events])

  return (
    <DashboardLayout>
      <div className='Single-event'>
        <div className='Single-event__header'>
          <div className='Single-event__header-title'>Event Updates</div>
        </div>
        {isEvent && isTeam && isTraining && isEvent.type === 'training' &&
          <SingleTraining isEvent={isEvent} isTeam={isTeam} isTraining={isTraining} />}
        {isEvent && isTeam && isMatches && isEvent.type === 'match' &&
          <SingleMatch isEvent={isEvent} isTeam={isTeam} isMatches={isMatches} />}
      </div>
    </DashboardLayout>
  )
}

type SingleTrainingProps = {
  isEvent: Event
  isTeam: TeamResult
  isTraining: Event[]
}

const SingleTraining:FC<SingleTrainingProps> = props => {
  const { isEvent, isTeam, isTraining } = props
  return (
    <div className='Single-event__wrapper'>
      <div className='Single-event__wrapper-content'>
        <div className='Single-event__wrapper-content-header'>
          <div className='Single-event__wrapper-content-header-nav'>Training</div>
        </div>
        <div className='Single-event__wrapper-content-match'>
          <div className='Single-event__wrapper-content-match-info'>
            {`${formatDate(isEvent.startDate)} - ${isEvent.eventLocation}`}
          </div>
          <div className='Single-event__wrapper-content-match-board'>
            <div className='Single-event__wrapper-content-match-board__home'>
              <div className='Single-event__wrapper-content-match-board__home--media'>
                <img src={isTeam.logo} alt='club-logo'/>
              </div>
              <div className='Single-event__wrapper-content-match-board__home--name'>{isTeam.teamName}</div>
              <div className='Single-event__wrapper-content-match-board__home--time'>
                {formatSingleEventTime(isEvent.startDate)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='Single-event__wrapper-similar'>
        <div className='Single-event__wrapper-similar-title'>Scheduled Trainings</div>
        <div className='Single-event__wrapper-similar-list'>
          {isTraining.map(training => (
            <div
              key={training.id}
              className='Single-event__wrapper-similar-list__item
                  Single-event__wrapper-similar-list__item--training'>
              <div className='Single-event__wrapper-similar-list__item--date'>
                {formatSingleEventDate(training.startDate)}
              </div>
              <div className='Single-event__wrapper-similar-list__item--info'>
                <div className='Single-event__wrapper-similar-list__item--info-address'>
                  {training.eventLocation}
                </div>
                <div className='Single-event__wrapper-similar-list__item--info-address'>
                  {formatSingleEventTime(training.startDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

type SingleMatchProps = {
  isEvent: Event
  isTeam: TeamResult
  isMatches: Event[]
}

const SingleMatch: FC<SingleMatchProps> = props => {
  const { teamId, eventId } = useParams()
  const { isEvent, isTeam, isMatches } = props

  return (
    <div className='Single-event__wrapper'>
      <div className='Single-event__wrapper-content'>
        <div className='Single-event__wrapper-content-header'>
          <div className='Single-event__wrapper-content-header-nav'>Match</div>
          <Link
            to={`/team/${teamId}/events/${eventId}/summary`}
            className='Single-event__wrapper-content-header-nav'
          >
            View Summary
          </Link>
        </div>
        <div className='Single-event__wrapper-content-match'>
          <div className='Single-event__wrapper-content-match-info'>
            {`${formatDate(isEvent.startDate)} - ${isEvent.eventLocation}`}
          </div>
          <div className='Single-event__wrapper-content-match-board'>
            <div className='Single-event__wrapper-content-match-board__home'>
              <div className='Single-event__wrapper-content-match-board__home--media'>
                <img src={isTeam.logo} alt='club-logo'/>
              </div>
              <div className='Single-event__wrapper-content-match-board__home--name'>{isTeam.teamName}</div>
            </div>
            <div className='Single-event__wrapper-content-match-board__score'>
              vs
            </div>
            <div className='Single-event__wrapper-content-match-board__away'>
              <div className='Single-event__wrapper-content-match-board__away--media'>
                <img src={ClubLogo} alt='club-logo'/>
              </div>
              <div className='Single-event__wrapper-content-match-board__away--name'>{isEvent.opponent}</div>
            </div>
          </div>
          {/*<Button className='Single-event__wrapper-content-match-btn'>
          <AddIcon/> Add Statistics</Button>*/}
        </div>
      </div>
      <div className='Single-event__wrapper-similar'>
        <div className='Single-event__wrapper-similar-title'>Scheduled match</div>
        <div className='Single-event__wrapper-similar-list'>
          {isMatches.map(match => (
            <div
              key={match.id}
              className={`Single-event__wrapper-similar-list__item 
                  Single-event__wrapper-similar-list__item--${match.location}`}>
              <div className='Single-event__wrapper-similar-list__item--date'>
                {formatSingleEventDate(match.startDate)}
              </div>
              <div className='Single-event__wrapper-similar-list__item--info'>
                <div className='Single-event__wrapper-similar-list__item--info-title'>
                  {match.opponent}
                </div>
                <div className='Single-event__wrapper-similar-list__item--info-address'>
                  {match.eventLocation}
                </div>
              </div>
              <div className='Single-event__wrapper-similar-list__item--location'>
                {match.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

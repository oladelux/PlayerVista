import { FC, useMemo } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'

import ClubLogo from '../../assets/images/club.png'
import { TeamResponse, Event } from '@/api'
import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { useEvents } from '@/hooks/useEvents.ts'
import { formatDate } from '@/services/helper.ts'
import { appService } from '@/singletons'
import {
  formatSingleEventDate,
  formatSingleEventTime,
} from '@/utils/date.ts'

import './SingleEventView.scss'
import { SessionInstance } from '@/utils/SessionInstance.ts'
const now = new Date()

export function SingleEventView() {
  const { events } = useEvents()
  const { eventId } = useParams()
  const teamId = SessionInstance.getTeamId()
  const { teams, teamsError: error, teamsLoading: loading } =
    useOutletContext<DashboardLayoutOutletContext>()
  const team = teams.find(team => team.id === teamId)
  const userData = appService.getUserData()

  const isEvent = useMemo(() => {
    if (teamId) {
      return (
        events &&
        events.find((event) => event.id === eventId)
      )
    }
  }, [teamId, events, eventId])

  const isMatches = useMemo(() => {
    if (teamId) {
      return (
        events &&
        events.filter(
          (event) => event.type === 'match' && new Date(event.startDate) > now,
        )
      )
    }
  }, [teamId, events])

  const isTraining = useMemo(() => {
    if (teamId) {
      return (
        events &&
        events.filter(
          (event) =>
            event.type === 'training' && new Date(event.startDate) > now,
        )
      )
    }
  }, [teamId, events])

  if (loading) return <LoadingPage />
  //TODO: Create Error Page
  if (error || !userData) return 'This is an error page'

  return (
    <div className='Single-event'>
      <div className='Single-event__header'>
        <div className='Single-event__header-title'>Event Updates</div>
      </div>
      {isEvent && team && isTraining && isEvent.type === 'training' && (
        <SingleTraining
          isEvent={isEvent}
          isTeam={team}
          isTraining={isTraining}
        />
      )}
      {isEvent && team && isMatches && isEvent.type === 'match' && (
        <SingleMatch
          isEvent={isEvent}
          isTeam={team}
          isMatches={isMatches}
        />
      )}
    </div>
  )
}

type SingleTrainingProps = {
  isEvent: Event;
  isTeam: TeamResponse;
  isTraining: Event[];
};

const SingleTraining: FC<SingleTrainingProps> = (props) => {
  const { isEvent, isTeam, isTraining } = props
  return (
    <div className='Single-event__wrapper'>
      <div className='Single-event__wrapper-content'>
        <div className='Single-event__wrapper-content-header'>
          <div className='Single-event__wrapper-content-header-nav'>
            Training
          </div>
        </div>
        <div className='Single-event__wrapper-content-match'>
          <div className='Single-event__wrapper-content-match-info'>
            {`${formatDate(isEvent.startDate)} - ${isEvent.eventLocation}`}
          </div>
          <div className='Single-event__wrapper-content-match-board'>
            <div className='Single-event__wrapper-content-match-board__home'>
              <div className='Single-event__wrapper-content-match-board__home--media'>
                <img src={isTeam.logo} alt='club-logo' />
              </div>
              <div className='Single-event__wrapper-content-match-board__home--name'>
                {isTeam.teamName}
              </div>
              <div className='Single-event__wrapper-content-match-board__home--time'>
                {formatSingleEventTime(isEvent.startDate)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='Single-event__wrapper-similar'>
        <div className='Single-event__wrapper-similar-title'>
          Scheduled Trainings
        </div>
        <div className='Single-event__wrapper-similar-list'>
          {isTraining.map((training) => (
            <div
              key={training.id}
              className='Single-event__wrapper-similar-list__item
                  Single-event__wrapper-similar-list__item--training'
            >
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
  isEvent: Event;
  isTeam: TeamResponse;
  isMatches: Event[];
};

const SingleMatch: FC<SingleMatchProps> = (props) => {
  const { isEvent, isTeam, isMatches } = props

  return (
    <div className='Single-event__wrapper'>
      <div className='Single-event__wrapper-content'>
        <div className='Single-event__wrapper-content-header'>
          <div className='Single-event__wrapper-content-header-nav'>Match</div>
        </div>
        <div className='Single-event__wrapper-content-match'>
          <div className='Single-event__wrapper-content-match-info'>
            {`${formatDate(isEvent.startDate)} - ${isEvent.eventLocation}`}
          </div>
          <div className='Single-event__wrapper-content-match-board'>
            <div className='Single-event__wrapper-content-match-board__home'>
              <div className='Single-event__wrapper-content-match-board__home--media'>
                <img src={isTeam.logo} alt='club-logo' />
              </div>
              <div className='Single-event__wrapper-content-match-board__home--name'>
                {isTeam.teamName}
              </div>
            </div>
            <div className='Single-event__wrapper-content-match-board__score'>
              vs
            </div>
            <div className='Single-event__wrapper-content-match-board__away'>
              <div className='Single-event__wrapper-content-match-board__away--media'>
                <img src={ClubLogo} alt='club-logo' />
              </div>
              <div className='Single-event__wrapper-content-match-board__away--name'>
                {isEvent.opponent}
              </div>
            </div>
          </div>
          {/*<Button className='Single-event__wrapper-content-match-btn'>
          <AddIcon/> Add Statistics</Button>*/}
        </div>
      </div>
      <div className='Single-event__wrapper-similar'>
        <div className='Single-event__wrapper-similar-title'>
          Scheduled match
        </div>
        <div className='Single-event__wrapper-similar-list'>
          {isMatches.map((match) => (
            <div
              key={match.id}
              className={`Single-event__wrapper-similar-list__item 
                  Single-event__wrapper-similar-list__item--${match.location}`}
            >
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

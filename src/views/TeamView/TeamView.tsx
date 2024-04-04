import { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { routes } from '../../constants/routes'
import { useAppDispatch } from '../../store/types'
import { getPlayersThunk } from '../../store/slices/PlayersSlice.ts'
import { getEventsThunk } from '../../store/slices/EventsSlice.ts'
import { setCurrentTeam } from '../../utils/localStorage.ts'
import { TeamResult } from '../../api'

import { DashboardHeader } from '../../component/DashboardLayout/DashboardLayout'

import './TeamView.scss'

type TeamViewProps = {
  teams: TeamResult[]
}

const NoTeamView: FC = () => {
  return (
    <div className='No-team-view'>
      <div className='No-team-view__title'>You have no team created</div>
      <Link to={routes.createTeam} className='No-team-view__link'>Create team</Link>
    </div>
  )
}

export const TeamView: FC<TeamViewProps> = props => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isTeamsAvailable = props.teams.length > 0

  const setActiveTeam = (teamId: string) => {
    navigate(`/team/${teamId}`)
    setCurrentTeam(teamId)
    dispatch(getPlayersThunk({ teamId }))
    dispatch(getEventsThunk({ teamId }))
  }
  return (
    <>
      <DashboardHeader />
      <div className='Team-view'>
        { isTeamsAvailable ?
          <div className='Team-view__team'>
            {props.teams.map(team => (
              <div key={team.id} onClick={() => setActiveTeam(team.id)} className='Team-view__team-card'>
                <div className='Team-view__team-card--media' >
                  <img className='Team-view__team-card--media-image' src={team.logo} alt='team-logo'/>
                </div>
                <div className='Team-view__team-card--title'>{team.teamName}</div>
                <div className='Team-view__team-card--footer'>
                  <div className='Team-view__team-card--footer-players'>
                    Players: <span className='Team-view__team-card--footer-players-value'>{team.players.length}</span>
                  </div>
                  <div className='Team-view__team-card--footer-age-group'>
                    <span>{team.ageGroup}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          :
          <div className='Team-view__no-team'>
            <NoTeamView />
          </div>
        }
      </div>
    </>
  )
}

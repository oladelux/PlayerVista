import { FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { routes } from '@/constants/routes.ts'
import { useAppDispatch } from '@/store/types.ts'
import { getPlayersByTeamIdThunk, getPlayersByUserIdThunk, playersSelector } from '@/store/slices/PlayersSlice.ts'
import { getStaffsThunk } from '@/store/slices/StaffSlice.ts'
import { getEventsByTeamThunk } from '@/store/slices/EventsSlice.ts'
import { setCurrentTeam } from '@/utils/localStorage.ts'
import { getTeamThunk, teamSelector } from '@/store/slices/TeamSlice.ts'
import { AuthenticatedUserData, Player, TeamResult } from '@/api'
import { setActiveTeamId, settingsSelector } from '@/store/slices/SettingsSlice.ts'

import { DashboardHeader } from '../../component/DashboardLayout/DashboardLayout'

import './TeamView.scss'
import { usePermission } from '@/hooks/usePermission.ts'

type TeamViewProps = {
  teams: TeamResult[]
  user: AuthenticatedUserData
}

const NoTeamView: FC = () => {

  const { userRole } = useSelector(settingsSelector)
  const { canCreateTeam } = usePermission(userRole)
  return (
    <div className='No-team-view'>
      <div className='No-team-view__title'>You have no team created</div>
      {canCreateTeam && <Link to={routes.createTeam} className='No-team-view__link'>Create team</Link>}
    </div>
  )
}

export const TeamView: FC<TeamViewProps> = props => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { teams } = useSelector(teamSelector)
  const { allPlayers } = useSelector(playersSelector)
  const isTeamsAvailable = props.teams.length > 0

  const setActiveTeam = (teamId: string) => {
    navigate(`/team/${teamId}`)
    setCurrentTeam(teamId)
    dispatch(setActiveTeamId({ teamId }))
    dispatch(getTeamThunk({ id: teamId }))
    dispatch(getPlayersByTeamIdThunk({ teamId }))
    dispatch(getEventsByTeamThunk({ teamId }))
    dispatch(getStaffsThunk({ groupId: props.user.groupId }))
    // dispatch(getReportersThunk({ teamId }))
  }

  useEffect(() => {
    dispatch(getPlayersByUserIdThunk({ userId: props.user.id }))
  }, [dispatch, props.user.id])

  return (
    <>
      <DashboardHeader teams={teams}/>
      <div className='Team-view'>
        { isTeamsAvailable ?
          <div className='flex flex-col md:flex-row gap-3'>
            {props.teams.map(team =>
              <TeamViewCard
                key={team.id}
                team={team}
                players={allPlayers.filter(player => player.teamId === team.id)}
                setActiveTeam={setActiveTeam}
              />,
            )}
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

interface TeamViewCardProps {
  team: TeamResult
  setActiveTeam: (teamId: string) => void
  players: Player[]
}
const TeamViewCard: FC<TeamViewCardProps> = ({ team, players, setActiveTeam }) => {

  return (
    <div onClick={() => setActiveTeam(team.id)} className='Team-view__team-card md:w-1/4'>
      <div className='Team-view__team-card--media'>
        <img className='Team-view__team-card--media-image' src={team.logo} alt='team-logo'/>
      </div>
      <div className='Team-view__team-card--title'>{team.teamName}</div>
      <div className='Team-view__team-card--footer'>
        <div className='Team-view__team-card--footer-players'>
          Players: <span className='Team-view__team-card--footer-players-value'>{players.length}</span>
        </div>
        <div className='Team-view__team-card--footer-age-group'>
          <span>{team.ageGroup}</span>
        </div>
      </div>
    </div>
  )
}

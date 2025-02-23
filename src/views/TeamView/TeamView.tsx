import { FC } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { Player, TeamResponse } from '@/api'
import { DashboardHeader } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { routes } from '@/constants/routes.ts'
import { usePermission } from '@/hooks/usePermission.ts'
import { useTeams } from '@/hooks/useTeams.ts'
import { playersSelector } from '@/store/slices/PlayersSlice.ts'
import './TeamView.scss'
import { toLocalSession } from '@/utils/localSession.ts'

const NoTeamView: FC = () => {
  const { canCreateTeam } = usePermission()
  return (
    <div className='No-team-view'>
      <div className='No-team-view__title'>You have no team created</div>
      {canCreateTeam && <Link to={routes.addTeam} className='No-team-view__link'>Create team</Link>}
    </div>
  )
}

export function TeamView() {
  const { allPlayers } = useSelector(playersSelector)
  const { teams, error, loading } = useTeams()
  const isTeamsAvailable = teams.length > 0

  if (loading) return <LoadingPage />
  //TODO: Create Error Page
  if (error) return 'This is an error page'

  return (
    <>
      <DashboardHeader teams={teams}/>
      <div className='Team-view'>
        { isTeamsAvailable ?
          <div className='grid grid-cols-1 gap-3 md:grid-cols-4 '>
            {teams.map(team =>
              <TeamViewCard
                key={team.id}
                team={team}
                players={allPlayers.filter(player => player.teamId === team.id)}
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
  team: TeamResponse
  players: Player[]
}
const TeamViewCard: FC<TeamViewCardProps> = ({ team, players }) => {
  const navigate = useNavigate()
  function handleTeamClick() {
    toLocalSession({ currentTeamId: team.id }).catch(e => console.error('Error setting current team id:', e))
    navigate('/dashboard')
  }
  return (
    <div className='Team-view__team-card' onClick={handleTeamClick}>
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

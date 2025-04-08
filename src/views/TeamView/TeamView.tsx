import { FC } from 'react'

import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { Player, TeamResponse } from '@/api'
import PlayerVistaLogo from '@/assets/images/icons/playervista.png'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { routes } from '@/constants/routes.ts'
import { usePermission } from '@/hooks/usePermission.ts'
import { useTeams } from '@/hooks/useTeams.ts'
import { appService } from '@/singletons'
import { playersSelector } from '@/store/slices/PlayersSlice.ts'
import useAuth from '@/useAuth.ts'
import { toLocalSession } from '@/utils/localSession.ts'
import './TeamView.scss'

const NoTeamView: FC = () => {
  const { canCreateTeam } = usePermission()
  return (
    <div className='No-team-view'>
      <div className='No-team-view__title'>You have no team created</div>
      {canCreateTeam && (
        <Link to={routes.addTeam} className='No-team-view__link'>
          Create team
        </Link>
      )}
    </div>
  )
}

export function TeamView() {
  const { allPlayers } = useSelector(playersSelector)
  const { teams, error, loading } = useTeams()
  const navigate = useNavigate()
  const isTeamsAvailable = teams.length > 0
  const userData = appService.getUserData()
  const { signOut } = useAuth()

  function getUserInitials(): string {
    if (!userData) return ''
    const firstInitial = userData.firstName.charAt(0).toUpperCase()
    const lastInitial = userData.lastName.charAt(0).toUpperCase()
    return `${firstInitial}${lastInitial}`
  }

  function handleLogout() {
    signOut()
    navigate('/login')
  }

  if (loading) return <LoadingPage />
  //TODO: Create Error Page
  if (error) return 'This is an error page'

  return (
    <>
      <div className='Dashboard-Layout__header'>
        <div className='Dashboard-Layout__header-media'>
          <img src={PlayerVistaLogo} alt='playervista' width={150} />
        </div>
        <div className='Dashboard-Layout__header-nav'>
          <div className='Dashboard-Layout__header-nav-profile mr-[30px]'>
            <DropdownMenu>
              <DropdownMenuTrigger className='focus-visible:outline-none'>
                <Avatar>
                  <AvatarImage src='' />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className='cursor-pointer hover:bg-dark-purple hover:text-white'>
                  <div onClick={handleLogout}>Log out</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className='Team-view'>
        {isTeamsAvailable ? (
          <div className='grid grid-cols-1 gap-3 md:grid-cols-4 '>
            {teams.map(team => (
              <TeamViewCard
                key={team.id}
                team={team}
                players={allPlayers.filter(player => player.teamId === team.id)}
              />
            ))}
          </div>
        ) : (
          <div className='Team-view__no-team'>
            <NoTeamView />
          </div>
        )}
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
    toLocalSession({ currentTeamId: team.id }).catch(e =>
      console.error('Error setting current team id:', e),
    )
    navigate('/dashboard')
  }

  return (
    <div className='Team-view__team-card' onClick={handleTeamClick}>
      <div className='Team-view__team-card--media'>
        <img className='Team-view__team-card--media-image' src={team.logo} alt='team-logo' />
      </div>
      <div className='Team-view__team-card--title'>{team.teamName}</div>
      <div className='Team-view__team-card--footer'>
        <div className='Team-view__team-card--footer-players'>
          Players:{' '}
          <span className='Team-view__team-card--footer-players-value'>{players.length}</span>
        </div>
        <div className='Team-view__team-card--footer-age-group'>
          <span>{team.ageGroup}</span>
        </div>
      </div>
    </div>
  )
}

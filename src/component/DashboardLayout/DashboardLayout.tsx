import { useMediaQuery } from '@mui/material'
import * as React from 'react'
import { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Outlet } from 'react-router-dom'

import PlayerVistaLogo from '../../assets/images/icons/playervista.png'
import { Sidebar } from '../Sidebar/SidebarMenu'
import { Roles, TeamResponse } from '@/api'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { MobileNav } from '@/component/MobileNav/MobileNav.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { useTeams } from '@/hooks/useTeams.ts'
import { appService } from '@/singletons'
import { getEventsByTeamThunk } from '@/store/slices/EventsSlice.ts'
import { getPlayersByTeamIdThunk } from '@/store/slices/PlayersSlice.ts'
import { setActiveTeamId } from '@/store/slices/SettingsSlice.ts'
import { getStaffsThunk } from '@/store/slices/StaffSlice.ts'
import { AppDispatch } from '@/store/types.ts'
import useAuth from '@/useAuth.ts'
import { setCurrentTeam } from '@/utils/localStorage.ts'
import './DashboardLayout.scss'
import { useRole } from '@/hooks/useRoles.ts'
import { toLocalSession } from '@/utils/localSession.ts'
import { SessionInstance } from '@/utils/SessionInstance.ts'

type DashboardHeaderProps = {
  teams: TeamResponse[]
}

export type DashboardLayoutOutletContext = {
  teams: TeamResponse[]
  roles: Roles[]
  userRole: string
  teamsLoading: boolean
  teamsError: string | undefined
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({ teams }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const userData = appService.getUserData()
  const { signOut } = useAuth()
  const teamId = SessionInstance.getTeamId()
  const activeTeamName = teams ? teams.find((team) => team.id === teamId)?.teamName : ''

  const handleTeamChange = useCallback( async (id: string) => {
    //navigate(`/${id}`)
    toLocalSession({ currentTeamId: id })
      .then(() => { window.location.reload() })
      .catch(e => console.error('Error setting current team id:', e))
    appService.setActiveTeam(id)
    setCurrentTeam(id)
    dispatch(setActiveTeamId({ teamId: id }))
    dispatch(getPlayersByTeamIdThunk({ teamId: id }))
    dispatch(getEventsByTeamThunk({ teamId: id }))
    userData && dispatch(getStaffsThunk({ groupId: userData.groupId }))
  }, [dispatch, userData])

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

  return (
    <div className='Dashboard-Layout__header'>
      <div className='Dashboard-Layout__header-media'>
        <img src={PlayerVistaLogo} alt='playervista' width={150} />
      </div>
      <div className='Dashboard-Layout__header-nav'>
        {teamId && <form className='Dashboard-Layout__header-nav-form'>
          {teams.length > 1 &&
            <Select value={teamId} onValueChange={(id: string) => handleTeamChange(id)}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue defaultValue={teamId}>{activeTeamName}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  team.id !== teamId && (
                    <SelectItem key={team.id} className='cursor-pointer' value={team.id}>{team.teamName}</SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>}
        </form>}
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
  )
}

export function DashboardLayout() {
  const { localSession } = useAuth()
  const { teams, error, loading } = useTeams()
  const { roles } = useRole(localSession?.groupId)
  const isMobile = useMediaQuery('(max-width:767px)')

  if (loading) return <LoadingPage />
  //TODO: Create Error Page
  if (error) return 'This is an error page'

  return (
    <div className='Dashboard-Layout'>
      <DashboardHeader teams={teams}/>
      <div className='Dashboard-Layout__wrapper'>
        <div className='Dashboard-Layout__wrapper-content'>
          {!isMobile && <div className='Dashboard-Layout__wrapper-content--sidebar'>
            <Sidebar />
          </div>}
          {isMobile && <MobileNav/>}
          <div className='Dashboard-Layout__wrapper-content--current-body'>
            <Outlet context={
              {
                teams: teams,
                roles: roles,
                userRole: localSession?.role || '',
                teamsLoading: loading,
                teamsError: error,
              } satisfies DashboardLayoutOutletContext
            } />
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { FC, PropsWithChildren } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import PlayerVistaLogo from '../../assets/images/icons/playervista.png'
import { Sidebar } from '../Sidebar/SidebarMenu'
import { TeamResponse } from '@/api'
import { MobileNav } from '@/component/MobileNav/MobileNav.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { useAppController } from '@/hooks/useAppController.ts'
import { getEventsByTeamThunk } from '@/store/slices/EventsSlice.ts'
import { getStaffsThunk } from '@/store/slices/StaffSlice.ts'
import { teamSelector } from '@/store/slices/TeamSlice.ts'
import { AppDispatch } from '@/store/types.ts'
import { setCurrentTeam } from '@/utils/localStorage.ts'

import './DashboardLayout.scss'
import { useMediaQuery } from '@mui/material'

import { getPlayersByTeamIdThunk } from '@/store/slices/PlayersSlice.ts'
import { setActiveTeamId } from '@/store/slices/SettingsSlice.ts'
import { userSelector } from '@/store/slices/UserSlice.ts'
import { appService } from '@/singletons'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'

type DashboardHeaderProps = {
  teams: TeamResponse[]
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({ teams }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector(userSelector)
  const { authentication } = useAppController()
  const { teamId } = useParams()
  const activeTeamName = teams ? teams.find((team) => team.id === teamId)?.teamName : ''

  const handleTeamChange = (id: string) => {
    navigate(`/${id}`)
    appService.setActiveTeam(id)
    setCurrentTeam(id)
    dispatch(setActiveTeamId({ teamId: id }))
    dispatch(getPlayersByTeamIdThunk({ teamId: id }))
    dispatch(getEventsByTeamThunk({ teamId: id }))
    user && dispatch(getStaffsThunk({ groupId: user.groupId }))
  }

  function getUserInitials(): string {
    if (!user) return ''
    const firstInitial = user.firstName.charAt(0).toUpperCase()
    const lastInitial = user.lastName.charAt(0).toUpperCase()
    return `${firstInitial}${lastInitial}`
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
                <div onClick={authentication.logout}>Log out</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export const DashboardLayout: FC<PropsWithChildren> = props => {
  const controller = useAppController()
  const { pathname } = useLocation()
  const { teams } = useSelector(teamSelector)
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:767px)')

  // Check if the current route matches the team dashboard pattern
  const isTeamDashboard = /^\/team\/[a-zA-Z0-9_-]+$/i.test(pathname)

  return (
    <div className='Dashboard-Layout'>
      <DashboardHeader teams={teams}/>
      <div className='Dashboard-Layout__wrapper'>
        <div className='Dashboard-Layout__wrapper-content'>
          {!isMobile && <div className='Dashboard-Layout__wrapper-content--sidebar'>
            <Sidebar controller={controller} />
          </div>}
          {isMobile && <MobileNav/>}
          <div className='Dashboard-Layout__wrapper-content--current-body'>
            {!isTeamDashboard &&
              <div className='Dashboard-Layout__wrapper-content--current-body-back' onClick={() => navigate(-1)}>
                <FiArrowLeft />
                <span className='Dashboard-Layout__wrapper-content--current-body-back--text'>Back</span>
              </div>
            }
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}

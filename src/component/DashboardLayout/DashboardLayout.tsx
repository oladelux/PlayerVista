import React, { FC, PropsWithChildren } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import { useAppController } from '@/hooks/useAppController.ts'
import { TeamResponse } from '@/api'
import { setCurrentTeam } from '@/utils/localStorage.ts'
import { getEventsByTeamThunk } from '@/store/slices/EventsSlice.ts'
import { getStaffsThunk } from '@/store/slices/StaffSlice.ts'
import { teamSelector } from '@/store/slices/TeamSlice.ts'
import { AppDispatch } from '@/store/types.ts'

import { Sidebar } from '../Sidebar/SidebarMenu'

import PlayerVistaLogo from '../../assets/images/icons/playervista.png'

import './DashboardLayout.scss'
import { useMediaQuery } from '@mui/material'
import { MobileNav } from '@/component/MobileNav/MobileNav.tsx'
import { getPlayersByTeamIdThunk } from '@/store/slices/PlayersSlice.ts'
import { setActiveTeamId } from '@/store/slices/SettingsSlice.ts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { userSelector } from '@/store/slices/UserSlice.ts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'

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

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    navigate(`/team/${id}`)
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
            <select name='team' className='Dashboard-Layout__header-nav-form--select' onChange={handleTeamChange}>
              {activeTeamName && (
                <option value={teamId}>{activeTeamName}</option>
              )}
              {teams
                ? teams.map((team) => (
                  team.id !== teamId && (
                    <option key={team.id} value={team.id}>
                      {team.teamName}
                    </option>
                  )
                ))
                : <option>Select team</option>}
            </select>}
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
              <DropdownMenuItem className='hover:bg-dark-purple hover:text-white cursor-pointer'>
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

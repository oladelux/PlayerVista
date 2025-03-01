import { useMediaQuery } from '@mui/material'
import * as React from 'react'
import { FC } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'

import { Roles, TeamResponse } from '@/api'
import { AppSidebar } from '@/component/AppSidebar/AppSidebar.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { MobileNav } from '@/component/MobileNav/MobileNav.tsx'
import TeamSwitcher from '@/component/Spinner/TeamSwitcher/TeamSwitcher.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx'
import { useRole } from '@/hooks/useRoles.ts'
import { useTeams } from '@/hooks/useTeams.ts'
import { appService } from '@/singletons'
import useAuth from '@/useAuth.ts'
import './DashboardLayout.scss'

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
  const navigate = useNavigate()
  const userData = appService.getUserData()
  const { signOut } = useAuth()
  const isMobile = useMediaQuery('(max-width:767px)')
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
    <div className='sticky top-0 z-10 flex items-center justify-between border-b border-at-background bg-white py-4'>
      {isMobile ? <div></div> : <SidebarTrigger/>}
      <div className='Dashboard-Layout__header-nav'>
        {teams.length > 0 && <TeamSwitcher teams={teams}/>}
        <div className='Dashboard-Layout__header-nav-profile mr-5'>
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
    <SidebarProvider>
      {!isMobile && <div>
        <AppSidebar/>
      </div>}
      {isMobile && <MobileNav/>}
      <div className='w-full bg-at-background'>
        <DashboardHeader teams={teams}/>
        <div className='p-5'>
          <Outlet context={
            {
              teams: teams,
              roles: roles,
              userRole: localSession?.role || '',
              teamsLoading: loading,
              teamsError: error,
            } satisfies DashboardLayoutOutletContext
          }/>
        </div>
      </div>
    </SidebarProvider>
  )
}

import { FC } from 'react'

import { useMediaQuery } from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

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
import { SidebarProvider } from '@/components/ui/sidebar.tsx'
import { useBackLink } from '@/hooks/useBackLink'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import { useRole } from '@/hooks/useRoles.ts'
import { useTeams } from '@/hooks/useTeams.ts'
import { cn } from '@/lib/utils'
import { appService } from '@/singletons'
import useAuth from '@/useAuth.ts'
import './DashboardLayout.scss'

type DashboardHeaderProps = {
  teams: TeamResponse[]
  title: string
  description: string
  backLink: string | undefined
}

export interface TitleDescription {
  title: string
  description: string
}

export type DashboardLayoutOutletContext = {
  teams: TeamResponse[]
  roles: Roles[]
  userRole: string
  teamsLoading: boolean
  teamsError: string | undefined
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  teams,
  title,
  description,
  backLink,
}) => {
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
    <div
      className={cn(
        'px-6 flex items-center justify-between py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'sticky top-0 z-10',
      )}
    >
      {isMobile ? (
        <div></div>
      ) : (
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              {backLink && (
                <Link to={backLink} className='mr-2'>
                  <ArrowLeft
                    size={18}
                    className='text-muted-foreground transition-colors hover:text-foreground'
                  />
                </Link>
              )}
              <h1 className='text-xl font-semibold leading-none tracking-tight'>{title}</h1>
            </div>
            {description && <p className='text-sm text-muted-foreground'>{description}</p>}
          </div>
        </div>
      )}
      <div className='Dashboard-Layout__header-nav'>
        {teams.length > 0 && <TeamSwitcher teams={teams} />}
        <div className='Dashboard-Layout__header-nav-profile'>
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
  const backLink = useBackLink()
  const { title, description } = usePageMetadata()

  if (loading) return <LoadingPage />
  //TODO: Create Error Page
  if (error) return 'This is an error page'

  return (
    <SidebarProvider>
      {!isMobile && (
        <div>
          <AppSidebar />
        </div>
      )}
      {isMobile && <MobileNav />}
      <div className='w-full bg-at-background'>
        <DashboardHeader
          teams={teams}
          title={title}
          description={description}
          backLink={backLink}
        />
        <div className='p-5'>
          <Outlet
            context={
              {
                teams: teams,
                roles: roles,
                userRole: localSession?.role || '',
                teamsLoading: loading,
                teamsError: error,
              } satisfies DashboardLayoutOutletContext
            }
          />
        </div>
      </div>
    </SidebarProvider>
  )
}

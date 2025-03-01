import React, { useId } from 'react'
import { Link } from 'react-router-dom'


import DashboardActiveIcon from '@/assets/images/icons/dashboard-active.svg'
import DashboardIcon from '@/assets/images/icons/dashboard.svg'
import EventActiveIcon from '@/assets/images/icons/event-active.svg'
import EventIcon from '@/assets/images/icons/event.svg'
import PlayerActiveIcon from '@/assets/images/icons/player-active.svg'
import PlayerIcon from '@/assets/images/icons/player.svg'
import PlayerVistaIcon from '@/assets/images/icons/playervista-icon.png'
import PlayerVistaLogo from '@/assets/images/icons/playervista.png'
import SettingsIcon from '@/assets/images/icons/settingsIcon.svg'
import StatisticsActiveIcon from '@/assets/images/icons/statistics-active-icon.svg'
import StatisticsIcon from '@/assets/images/icons/statistics-icon.svg'
import TeamsActiveIcon from '@/assets/images/icons/teams-active.svg'
import TeamsIcon from '@/assets/images/icons/teams.svg'
import UserManagementActiveIcon from '@/assets/images/icons/user-management-active.svg'
import UserManagementIcon from '@/assets/images/icons/user-management.svg'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, SidebarSeparator, useSidebar,
} from '@/components/ui/sidebar'

const footerItems = [
  {
    title: 'Settings',
    icon: SettingsIcon,
    url: '/settings',
  },
]

const items = [
  {
    title: 'Dashboard',
    tabType: 'DASHBOARD',
    icon: DashboardIcon,
    activeImage: DashboardActiveIcon,
    url: '/dashboard',
  },
  {
    title: 'Teams',
    tabType: 'TEAMS',
    icon: TeamsIcon,
    activeImage: TeamsActiveIcon,
    url: '/manage-teams',
  },
  {
    title: 'Players',
    tabType: 'PLAYERS',
    icon: PlayerIcon,
    activeImage: PlayerActiveIcon,
    url: '/players',
  },
  {
    title: 'Calender',
    tabType: 'CALENDER',
    icon: EventIcon,
    activeImage: EventActiveIcon,
    url: '/events',
  },
  {
    title: 'Statistics',
    tabType: 'STATISTICS',
    icon: StatisticsIcon,
    activeImage: StatisticsActiveIcon,
    url: '/statistics',
  },
  {
    title: 'Staff',
    tabType: 'STAFF',
    icon: UserManagementIcon,
    activeImage: UserManagementActiveIcon,
    url: '/staffs',
  },
]

export function AppSidebar() {
  const keyId = useId()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className={state === 'expanded' ? 'p-5' : 'p-2'}>
        {state === 'expanded' ?
          <img src={PlayerVistaLogo} alt='playervista' width={150}/> :
          <img src={PlayerVistaIcon} alt='playervista' width={30} className='rounded-lg ' />}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={keyId} className='mb-2'>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <img
                        className='Sidebar__item-menu-content-media-icon'
                        src={item.icon}
                        width={24}
                        alt='menu-icon'
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={keyId} className='mb-4'>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <img
                    className='Sidebar__item-menu-content-media-icon'
                    src={item.icon}
                    width={24}
                    alt='menu-icon'
                  />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

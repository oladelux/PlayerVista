import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import DashboardIcon from '../../assets/images/icons/dashboard.svg'
import TeamsIcon from '../../assets/images/icons/teams.svg'
import UserManagementIcon from '../../assets/images/icons/user-management.svg'
import EventIcon from '../../assets/images/icons/event.svg'
import PlayerIcon from '../../assets/images/icons/player.svg'
import StatisticsIcon from '../../assets/images/icons/statistics-icon.svg'

import './MobileNav.scss'
import { useSelector } from 'react-redux'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'

export const MobileNav: FC = () => {
  const { activeTeamId } = useSelector(settingsSelector)

  const sideBarTabs = [
    { tabName: 'Dashboard', icon: DashboardIcon, link: `/team/${activeTeamId}` },
    { tabName: 'Team', icon: TeamsIcon, link: `/team/${activeTeamId}/manage-teams` },
    { tabName: 'Staff', icon: UserManagementIcon, link: `/team/${activeTeamId}/staffs` },
    { tabName: 'Players', icon: PlayerIcon, link: `/team/${activeTeamId}/players` },
    { tabName: 'Calender', icon: EventIcon, link: `/team/${activeTeamId}/events` },
    { tabName: 'Statistics', icon: StatisticsIcon, link: `/team/${activeTeamId}/statistics` },
  ]

  return (
    <div className='MobileNav'>
      {sideBarTabs.map((item) => (
        <Link key={item.tabName} to={item.link} className='MobileNav__item'>
          <img src={item.icon} alt={`${item.tabName} icon`} className='MobileNav__item-icon' />
          <span className='MobileNav__item-label'>{item.tabName}</span>
        </Link>
      ))}
    </div>
  )
}

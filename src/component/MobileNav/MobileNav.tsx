import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import DashboardIcon from '../../assets/images/icons/dashboard.svg'
import EventIcon from '../../assets/images/icons/event.svg'
import PlayerIcon from '../../assets/images/icons/player.svg'
import StatisticsIcon from '../../assets/images/icons/statistics-icon.svg'
import TeamsIcon from '../../assets/images/icons/teams.svg'
import UserManagementIcon from '../../assets/images/icons/user-management.svg'

import './MobileNav.scss'

export const MobileNav: FC = () => {
  const sideBarTabs = [
    { tabName: 'Dashboard', icon: DashboardIcon, link: '/dashboard' },
    { tabName: 'Team', icon: TeamsIcon, link: '/manage-teams' },
    { tabName: 'Staff', icon: UserManagementIcon, link: '/staffs' },
    { tabName: 'Players', icon: PlayerIcon, link: '/players' },
    { tabName: 'Calender', icon: EventIcon, link: '/events' },
    { tabName: 'Statistics', icon: StatisticsIcon, link: '/statistics' },
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

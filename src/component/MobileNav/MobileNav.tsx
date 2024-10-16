import React, { FC } from 'react'
import { Link, useParams } from 'react-router-dom'

import DashboardIcon from '../../assets/images/icons/dashboard.svg'
import TeamsIcon from '../../assets/images/icons/teams.svg'
import UserManagementIcon from '../../assets/images/icons/user-management.svg'
import EventIcon from '../../assets/images/icons/event.svg'
import PlayerIcon from '../../assets/images/icons/player.svg'
import StatisticsIcon from '../../assets/images/icons/statistics-icon.svg'

import './MobileNav.scss'

export const MobileNav: FC = () => {
  const { teamId } = useParams()

  const sideBarTabs = [
    { tabName: 'Dashboard', icon: DashboardIcon, link: `/team/${teamId}` },
    { tabName: 'Team', icon: TeamsIcon, link: `/team/${teamId}/manage-teams` },
    { tabName: 'Staff', icon: UserManagementIcon, link: `/team/${teamId}/staffs` },
    { tabName: 'Players', icon: PlayerIcon, link: `/team/${teamId}/players` },
    { tabName: 'Event', icon: EventIcon, link: `/team/${teamId}/events` },
    { tabName: 'Statistics', icon: StatisticsIcon, link: `/team/${teamId}/statistics` },
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

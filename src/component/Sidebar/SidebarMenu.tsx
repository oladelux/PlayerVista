import React, { FC, useState } from 'react'
import classnames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { FaAngleRight, FaAngleDown } from 'react-icons/fa'

import { AppController } from '@/hooks/useAppController.ts'

import DashboardIcon from '../../assets/images/icons/dashboard.svg'
import DashboardActiveIcon from '../../assets/images/icons/dashboard-active.svg'
import TeamsIcon from '../../assets/images/icons/teams.svg'
import TeamsActiveIcon from '../../assets/images/icons/teams-active.svg'
import UserManagementIcon from '../../assets/images/icons/user-management.svg'
import UserManagementActiveIcon from '../../assets/images/icons/user-management-active.svg'
import EventIcon from '../../assets/images/icons/event.svg'
import EventActiveIcon from '../../assets/images/icons/event-active.svg'
import SettingsIcon from '../../assets/images/icons/settingsIcon.svg'
import LogoutIcon from '../../assets/images/icons/logoutIcon.svg'
import PlayerIcon from '../../assets/images/icons/player.svg'
import PlayerActiveIcon from '../../assets/images/icons/player-active.svg'
import StatisticsIcon from '../../assets/images/icons/statistics-icon.svg'
import StatisticsActiveIcon from '../../assets/images/icons/statistics-active-icon.svg'

import './SidebarMenu.scss'
import { useSelector } from 'react-redux'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'

type SidebarMenuProps = {
  menu: SideBarTabsType;
  onClick: () => void;
  isActive: boolean;
};

type TabType =
  | 'DASHBOARD'
  | 'TEAM'
  | 'PLAYERS'
  | 'STAFF'
  | 'EVENT'
  | 'STATISTICS'
  | 'MESSAGE'
  | 'REPORTERS';
const sidebarMenu = [
  'DASHBOARD',
  'TEAM',
  'PLAYERS',
  'STAFF',
  'EVENT',
  'STATISTICS',
  'MESSAGE',
  'REPORTERS',
]

export type SideBarTabsType = {
  /**
   * The display name of the tab
   */
  tabName: string;
  /**
   * The type of the tab, using the predefined types
   */
  tabType: TabType;
  /**
   * The image associated with the tab, assumed to be a PNG element
   */
  image: string;
  activeImage: string;
  link?: string;
  subMenu?: {
    text: string;
    link: string;
  }[];
};

const SidebarMenu: FC<SidebarMenuProps> = (props) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  const openSubMenu = () => {
    if (props.menu.subMenu) {
      setIsSubMenuOpen((prev) => !prev)
    }
    props.onClick()
  }

  return (
    <div
      className={classnames('Sidebar__item', {
        'Sidebar__item--active': props.isActive,
      })}
    >
      {props.menu.link && (
        <Link
          to={props.menu.link}
          onClick={openSubMenu}
          className='Sidebar__item-menu'
        >
          <div className='Sidebar__item-menu-content'>
            <div
              className={classnames('Sidebar__item-menu-content-media', {
                'Sidebar__item-menu-content-media--active': props.isActive,
              })}
            >
              <img
                className='Sidebar__item-menu-content-media-icon'
                src={props.isActive ? props.menu.activeImage : props.menu.image}
                width={24}
                alt='menu-icon'
              />
            </div>
            <div className='Sidebar__item-menu-content-link'>
              {props.menu.tabName}
            </div>
          </div>
          {props.menu.subMenu && (
            <div className='Sidebar__item-arrow'>
              {isSubMenuOpen ? <FaAngleDown /> : <FaAngleRight />}
            </div>
          )}
        </Link>
      )}
      {isSubMenuOpen && (
        <ul className='Sidebar__item-submenu'>
          {props.menu.subMenu?.map((menu) => (
            <li key={menu.text} className='Sidebar__item-submenu--item'>
              <Link className='Sidebar__item-submenu--item-link' to={menu.link}>
                {menu.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

type SidebarFooterMenuProps = {
  onClick: () => void;
};

const SidebarFooterMenu: FC<SidebarFooterMenuProps> = (props) => {
  return (
    <div className='Sidebar-footer-menu'>
      <Link to='/settings' className='Sidebar-footer-menu__nav'>
        <img
          className='Sidebar-footer-menu__nav-image'
          alt='settings-icon'
          src={SettingsIcon}
        />
        <span className='Sidebar-footer-menu__nav-title'>Settings</span>
      </Link>
      <div className='Sidebar-footer-menu__nav' onClick={props.onClick}>
        <img
          className='Sidebar-footer-menu__nav-image'
          alt='logout-icon'
          src={LogoutIcon}
        />
        <span className='Sidebar-footer-menu__nav-title'>Log out</span>
      </div>
    </div>
  )
}

type SidebarProps = {
  controller: AppController;
};

export const Sidebar: FC<SidebarProps> = (props) => {
  const { pathname } = useLocation()
  const { activeTeamId, userRole } = useSelector(settingsSelector)

  const sideBarTabs: SideBarTabsType[] = [
    {
      tabName: 'Dashboard',
      tabType: 'DASHBOARD',
      image: DashboardIcon,
      activeImage: DashboardActiveIcon,
      link: `/team/${activeTeamId}`,
    },
    {
      tabName: 'Team',
      tabType: 'TEAM',
      image: TeamsIcon,
      activeImage: TeamsActiveIcon,
      link: `/team/${activeTeamId}/manage-teams`,
    },
    {
      tabName: 'Players',
      tabType: 'PLAYERS',
      image: PlayerIcon,
      activeImage: PlayerActiveIcon,
      link: `/team/${activeTeamId}/players`,
    },
    {
      tabName: 'Event',
      tabType: 'EVENT',
      image: EventIcon,
      activeImage: EventActiveIcon,
      link: `/team/${activeTeamId}/events`,
    },
    {
      tabName: 'Statistics',
      tabType: 'STATISTICS',
      image: StatisticsIcon,
      activeImage: StatisticsActiveIcon,
      link: `/team/${activeTeamId}/statistics`,
    },
    /*{
      tabName: 'Message',
      tabType: 'MESSAGE',
      image: MessageIcon,
      activeImage: MessageActiveIcon,
      link: `/team/${teamId}/message`,
    },
    {
      tabName: 'Reporters',
      tabType: 'REPORTERS',
      image: ReporterIcon,
      activeImage: ReporterActiveIcon,
      link: `/team/${teamId}/reporters`,
    },*/
  ]

  if (userRole === 'Admin' || userRole === 'admin') {
    sideBarTabs.push({
      tabName: 'Staff',
      tabType: 'STAFF',
      image: UserManagementIcon,
      activeImage: UserManagementActiveIcon,
      link: `/team/${activeTeamId}/staffs`,
    })
  }

  const [activeTab, setActiveTab] = useState('')

  const getBasePath = (path: string) => {
    const segments = path.split('/')
    return segments.length > 3 ? `/${segments[1]}/${segments[2]}/${segments[3]}` : path
  }

  const basePath = getBasePath(pathname)

  const browserActiveTab = sideBarTabs.find(
    (item) =>
      item.link === basePath || item.subMenu?.some((l) => l.link === basePath),
  )

  const activeSidebarMenu = activeTab
    ? activeTab
    : browserActiveTab
      ? browserActiveTab.tabType
      : sidebarMenu[0]

  return (
    <div className='Sidebar'>
      <div className='Sidebar__nav'>
        {sideBarTabs.map((item) => (
          <SidebarMenu
            key={item.tabName}
            menu={item}
            isActive={item.tabType === activeSidebarMenu}
            onClick={() => setActiveTab(item.tabType)}
          />
        ))}
      </div>
      <div className='Sidebar__nav-footer-nav'>
        <SidebarFooterMenu onClick={props.controller.authentication.logout} />
      </div>
    </div>
  )
}

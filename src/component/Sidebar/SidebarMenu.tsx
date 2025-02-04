import classnames from 'classnames'
import React, { FC, useState } from 'react'
import { FaAngleRight, FaAngleDown } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'

import DashboardActiveIcon from '../../assets/images/icons/dashboard-active.svg'
import DashboardIcon from '../../assets/images/icons/dashboard.svg'
import EventActiveIcon from '../../assets/images/icons/event-active.svg'
import EventIcon from '../../assets/images/icons/event.svg'
import LogoutIcon from '../../assets/images/icons/logoutIcon.svg'
import PlayerActiveIcon from '../../assets/images/icons/player-active.svg'
import PlayerIcon from '../../assets/images/icons/player.svg'
import SettingsIcon from '../../assets/images/icons/settingsIcon.svg'
import StatisticsActiveIcon from '../../assets/images/icons/statistics-active-icon.svg'
import StatisticsIcon from '../../assets/images/icons/statistics-icon.svg'
import TeamsActiveIcon from '../../assets/images/icons/teams-active.svg'
import TeamsIcon from '../../assets/images/icons/teams.svg'
import UserManagementActiveIcon from '../../assets/images/icons/user-management-active.svg'
import UserManagementIcon from '../../assets/images/icons/user-management.svg'
import './SidebarMenu.scss'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import useAuth from '@/useAuth.ts'

type SidebarMenuProps = {
  menu: SideBarTabsType;
  onClick: () => void;
  isActive: boolean;
};

type TabType =
  | 'DASHBOARD'
  | 'TEAMS'
  | 'PLAYERS'
  | 'STAFF'
  | 'CALENDER'
  | 'STATISTICS'
  | 'MESSAGE'
  | 'REPORTERS';
const sidebarMenu = [
  'DASHBOARD',
  'TEAMS',
  'PLAYERS',
  'STAFF',
  'CALENDER',
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
  const { teamId } = useParams()
  return (
    <div className='Sidebar-footer-menu'>
      <Link to={`/${teamId}/settings`} className='Sidebar-footer-menu__nav'>
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

export const Sidebar: FC = () => {
  const { pathname } = useLocation()
  const { teamId } = useParams()
  const { userRole } = useSelector(settingsSelector)
  const { signOut } = useAuth()

  const sideBarTabs: SideBarTabsType[] = [
    {
      tabName: 'Dashboard',
      tabType: 'DASHBOARD',
      image: DashboardIcon,
      activeImage: DashboardActiveIcon,
      link: `/${teamId}`,
    },
    {
      tabName: 'Teams',
      tabType: 'TEAMS',
      image: TeamsIcon,
      activeImage: TeamsActiveIcon,
      link: `/${teamId}/teams`,
    },
    {
      tabName: 'Players',
      tabType: 'PLAYERS',
      image: PlayerIcon,
      activeImage: PlayerActiveIcon,
      link: `/${teamId}/players`,
    },
    {
      tabName: 'Calender',
      tabType: 'CALENDER',
      image: EventIcon,
      activeImage: EventActiveIcon,
      link: `/${teamId}/events`,
    },
    {
      tabName: 'Statistics',
      tabType: 'STATISTICS',
      image: StatisticsIcon,
      activeImage: StatisticsActiveIcon,
      link: `/${teamId}/statistics`,
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
      link: `/${teamId}/staffs`,
    })
  }

  const [activeTab, setActiveTab] = useState('')

  const getBasePath = (path: string) => {
    const segments = path.split('/')
    return segments.length > 2 ? `/${segments[1]}/${segments[2]}` : path
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
        <SidebarFooterMenu onClick={signOut} />
      </div>
    </div>
  )
}

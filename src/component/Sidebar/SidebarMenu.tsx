import React, { FC, useState } from 'react'
import classnames from 'classnames'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaAngleRight, FaAngleDown } from 'react-icons/fa'

import { AppController } from '../../hooks/useAppController'
import { teamSelector } from '../../store/slices/TeamSlice'
import { getPlayersThunk } from '../../store/slices/PlayersSlice'
import { getStaffsThunk } from '../../store/slices/StaffSlice.ts'
import { AppDispatch } from '../../store/types'
import { getEventsThunk } from '../../store/slices/EventsSlice.ts'
import { setCurrentTeam } from '../../utils/localStorage.ts'

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

import './SidebarMenu.scss'

type SidebarMenuProps = {
  menu: SideBarTabsType
  onClick: () => void
  isActive: boolean
}

type TabType = 'DASHBOARD' | 'TEAM MANAGEMENT' | 'STAFF MANAGEMENT' | 'EVENT' | 'MESSAGE'
const sidebarMenu = ['DASHBOARD', 'TEAM MANAGEMENT', 'STAFF MANAGEMENT', 'EVENT', 'MESSAGE']

export type SideBarTabsType = {
  /**
   * The display name of the tab
   */
  tabName: string
  /**
   * The type of the tab, using the predefined types
   */
  tabType: TabType
  /**
   * The image associated with the tab, assumed to be a PNG element
   */
  image: string
  activeImage: string
  link?: string
  subMenu?: {
    text: string
    link: string
  }[]
}

const SidebarMenu:FC<SidebarMenuProps> = props => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  const openSubMenu = () => {
    if(props.menu.subMenu) {
      setIsSubMenuOpen((prev) => !prev)
    }
    props.onClick()
  }

  return (
    <div className={classnames('Sidebar__item', { 'Sidebar__item--active': props.isActive })}>
      {props.menu.link &&
        <Link
          to={props.menu.link}
          onClick={openSubMenu}
          className='Sidebar__item-menu'
        >
          <div className='Sidebar__item-menu-content'>
            <div
              className={classnames('Sidebar__item-menu-content-media',
                { 'Sidebar__item-menu-content-media--active': props.isActive })}>
              <img
                className='Sidebar__item-menu-content-media-icon'
                src={props.isActive ? props.menu.activeImage : props.menu.image}
                width={24}
                alt='menu-icon'
              />
            </div>
            <div className='Sidebar__item-menu-content-link'>{props.menu.tabName}</div>
          </div>
          {props.menu.subMenu &&
            <div className='Sidebar__item-arrow'>
              {isSubMenuOpen ?
                <FaAngleDown/>
                : <FaAngleRight/>}
            </div>
          }
        </Link>
      }
      {isSubMenuOpen && (
        <ul className='Sidebar__item-submenu'>
          {props.menu.subMenu?.map(menu =>
            <li key={menu.text} className='Sidebar__item-submenu--item'>
              <Link className='Sidebar__item-submenu--item-link' to={menu.link}>{menu.text}</Link>
            </li>)
          }
        </ul>
      )}
    </div>
  )
}

type SidebarFooterMenuProps = {
  onClick: () => void
}

const SidebarFooterMenu: FC<SidebarFooterMenuProps> = props => {
  return (
    <div className='Sidebar-footer-menu'>
      <Link to='' className='Sidebar-footer-menu__nav'>
        <img className='Sidebar-footer-menu__nav-image' alt='settings-icon' src={SettingsIcon}/>
        <span className='Sidebar-footer-menu__nav-title'>Settings</span>
      </Link>
      <div className='Sidebar-footer-menu__nav' onClick={props.onClick}>
        <img className='Sidebar-footer-menu__nav-image' alt='logout-icon' src={LogoutIcon}/>
        <span className='Sidebar-footer-menu__nav-title'>Log out</span>
      </div>
    </div>
  )
}

type SidebarProps = {
  controller: AppController
}

export const Sidebar: FC<SidebarProps> = props => {
  const dispatch = useDispatch<AppDispatch>()
  const { pathname } = useLocation()
  const { teamId } = useParams()
  const { teams } = useSelector(teamSelector)
  const navigate = useNavigate()

  const sideBarTabs: SideBarTabsType[] = [
    {
      tabName: 'Dashboard',
      tabType: 'DASHBOARD',
      image: DashboardIcon,
      activeImage: DashboardActiveIcon,
      link: `/team/${teamId}`,
    },
    {
      tabName: 'Team Management',
      tabType: 'TEAM MANAGEMENT',
      image: TeamsIcon,
      activeImage: TeamsActiveIcon,
      link: '#',
      subMenu: [
        {
          text: 'Manage Teams',
          link: `/team/${teamId}/manage-teams`,
        },
        {
          text: 'Players',
          link: `/team/${teamId}/players`,
        },
      ],
    },
    {
      tabName: 'Staff Management',
      tabType: 'STAFF MANAGEMENT',
      image: UserManagementIcon,
      activeImage: UserManagementActiveIcon,
      link: `/team/${teamId}/staffs`,
    },
    {
      tabName: 'Event',
      tabType: 'EVENT',
      image: EventIcon,
      activeImage: EventActiveIcon,
      link: `/team/${teamId}/events`,
    },
    /*{
      tabName: 'Message',
      tabType: 'MESSAGE',
      image: MessageIcon,
      activeImage: MessageActiveIcon,
      link: `/team/${teamId}/message`,
    },*/
  ]

  const [activeTab, setActiveTab] = useState('')

  //This is created to get the active tab if a user just goes directly to a page by its URL
  const browserActiveTab = sideBarTabs
    .find(item => item.link === pathname || item.subMenu?.some(l => l.link === pathname))

  const activeSidebarMenu = activeTab ||
    (browserActiveTab && browserActiveTab.tabType) || sidebarMenu[0]

  const activeTeamName = teams.find((team) => team.id === teamId)?.teamName

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    navigate(`/team/${id}`)
    setCurrentTeam(id)
    dispatch(getPlayersThunk({ teamId: id }))
    dispatch(getEventsThunk({ teamId: id }))
    dispatch(getStaffsThunk({ teamId: id }))
  }

  return (
    <div className='Sidebar'>
      <div className='Sidebar__nav'>
        <div className='Sidebar__nav-search'>
          <form>
            <div className='Sidebar__nav-search-title'>Team</div>
            <select name='team' className='Sidebar__nav-search-select' onChange={handleTeamChange}>
              { activeTeamName && (
                <option value={teamId}>{activeTeamName}</option>
              )}
              {teams.map((team) => (
                team.id !== teamId && (
                  <option key={team.id} value={team.id}>
                    {team.teamName}
                  </option>
                )
              ))}
            </select>
          </form>
        </div>
        {sideBarTabs.map(item => (
          <SidebarMenu
            key={item.tabName}
            menu={item}
            isActive={item.tabType === activeSidebarMenu}
            onClick={() => setActiveTab(item.tabType)}
          />
        ))
        }
      </div>
      <div className='Sidebar__nav-footer-nav'>
        <SidebarFooterMenu onClick={props.controller.authentication.logout} />
      </div>
    </div>
  )
}

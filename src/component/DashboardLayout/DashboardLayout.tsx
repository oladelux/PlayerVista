import React, { FC, PropsWithChildren } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import { useAppController } from '../../hooks/useAppController'

import { Sidebar } from '../Sidebar/SidebarMenu'

import Logo from '../../assets/images/home/logo.png'

import './DashboardLayout.scss'

export const DashboardHeader: FC = () => {
  return (
    <div className='Dashboard-Layout__header'>
      <div className='Dashboard__header-media'><img src={Logo} width={24} alt='Team-Logo'/></div>
      <div className='Dashboard__header-title'>Team 1</div>
    </div>
  )
}

export const DashboardLayout: FC<PropsWithChildren> = props => {
  const controller = useAppController()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Check if the current route matches the team dashboard pattern
  const isTeamDashboard = /^\/team\/[a-zA-Z0-9_-]+$/i.test(pathname)

  return (
    <div className='Dashboard-Layout'>
      <DashboardHeader />
      <div className='Dashboard-Layout__wrapper'>
        <div className='Dashboard-Layout__wrapper-content'>
          <div className='Dashboard-Layout__wrapper-content--sidebar'>
            <Sidebar controller={controller} />
          </div>
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

import React, { FC, PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom'

import MetaHead from '../MetaHead/MetaHead'
import { title } from '../../config/constants'

import './Layout.scss'

const Layout: FC<PropsWithChildren> = props => {
  const location = useLocation()

  return (
    <div className='Layout'>
      <MetaHead title={title} />
      {props.children}
    </div>
  )
}

export default Layout

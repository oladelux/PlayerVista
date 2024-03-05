import { FC } from 'react'

import './Update.scss'
import {Link} from 'react-router-dom';

export const Update:FC = () => {
  return (
    <div className='Update'>
      <div className='Update__header'>
        <div className='Update__header-title'>Update</div>
        <div className='Update__header-nav'>
          <Link className='Update__header-nav--link' to={''}>See all</Link>
        </div>
      </div>
      <div className='Update__notifications'>
        <div className='Update__notifications-stack'>
          <div className='Update__notifications-stack--date'>Feb. 11</div>
          <div className='Update__notifications-stack--alerts'>
            <ul className='Update__notifications-stack--alerts-list'>
              <li className='Update__notifications-stack--alerts-list-item'>Lorem ipsum dolor sit amet consectetur. Scelerisque faucibus elit morbi est
                scelerisque etiam maecenas sit. Vel amet et </li>
            </ul>
          </div>
          <div className='Update__notifications-stack--time'>[2.52pm]</div>
        </div>
        <div className='Update__notifications-stack'>
          <div className='Update__notifications-stack--date'>Feb. 11</div>
          <div className='Update__notifications-stack--alerts'>
            <ul className='Update__notifications-stack--alerts-list'>
              <li className='Update__notifications-stack--alerts-list-item'>Lorem ipsum dolor sit amet consectetur. Scelerisque faucibus elit morbi est
                scelerisque etiam maecenas sit. Vel amet et </li>
            </ul>
          </div>
          <div className='Update__notifications-stack--time'>[2.52pm]</div>
        </div>
      </div>
    </div>
  )
}

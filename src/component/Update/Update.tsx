import { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { LogType } from '../../api'
import { formatDate, formattedTime } from '../../services/helper.ts'
import { sortApplicationLogs } from '../../utils/logs.ts'

import './Update.scss'

type UpdateProps = {
  applicationLogs: LogType[]
}

export const Update:FC<UpdateProps> = ({ applicationLogs }) => {
  const sortedApplicationLogs = useMemo(() =>
    sortApplicationLogs(applicationLogs), [applicationLogs])

  return (
    <div className='Update'>
      <div className='Update__header'>
        <div className='Update__header-title'>Recent Updates</div>
        <div className='Update__header-nav'>
          <Link className='Update__header-nav--link' to={''}>See all</Link>
        </div>
      </div>
      <div className='Update__notifications'>
        {sortedApplicationLogs.slice(0, 5).map(logs => (
          <div key={new Date(logs.date).toLocaleTimeString()} className='Update__notifications-stack'>
            <div className='Update__notifications-stack--date'>{formatDate(logs.date)}</div>
            <div className='Update__notifications-stack--alerts'>
              <ul className='Update__notifications-stack--alerts-list'>
                <li className='Update__notifications-stack--alerts-list-item'>
                  {logs.userId} {logs.message}
                </li>
              </ul>
            </div>
            <div className='Update__notifications-stack--time'>[{formattedTime(logs.date)}]</div>
          </div>
        ))}
      </div>
    </div>
  )
}

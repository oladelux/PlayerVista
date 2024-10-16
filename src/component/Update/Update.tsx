import { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { LogType } from '@/api'
import { useUserName } from '@/hooks/useUsername.ts'
import { formatDate, formattedTime } from '@/services/helper.ts'
import { sortApplicationLogs } from '@/utils/logs.ts'

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
        {sortedApplicationLogs.map(logs =>
          <LogMessage key={new Date(logs.createdAt).toLocaleTimeString()} log={logs} />)}
      </div>
    </div>
  )
}

function LogMessage({ log }: { log: LogType }) {
  const username = useUserName(log.userId)
  return (
    <div className='Update__notifications-stack'>
      <div className='Update__notifications-stack--date'>{formatDate(log.createdAt)}</div>
      <div className='Update__notifications-stack--alerts'>
        <ul className='Update__notifications-stack--alerts-list'>
          <li className='Update__notifications-stack--alerts-list-item'>
            {username} {log.message}
          </li>
        </ul>
      </div>
      <div className='Update__notifications-stack--time'>[{formattedTime(log.createdAt)}]</div>
    </div>
  )
}

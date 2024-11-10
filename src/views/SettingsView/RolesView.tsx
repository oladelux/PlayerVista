import { useState } from 'react'
import classnames from 'classnames'

export default function Roles(){
  const [activeRole, setActiveRole] = useState('Admin')
  const [roles, setRoles] = useState(['Admin', 'Manager', 'Editor', 'Viewer'])
  return (
    <div className='bg-at-background p-5 w-full grid grid-cols-4 gap-3'>
      <div className='bg-at-white col-span-1 p-5'>
        {roles.map(role => (
          <div
            key={role}
            onClick={() => setActiveRole(role)}
            className={classnames('p-2 rounded cursor-pointer hover:bg-dark-purple hover:text-white', { 'bg-dark-purple text-white': activeRole === role })}
          >
            {role}
          </div>
        ))}
      </div>
      <div className='col-span-3 bg-at-white p-5'>
        content
      </div>
    </div>
  )
}

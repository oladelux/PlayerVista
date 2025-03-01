import React, { FC, useState } from 'react'

type MonthScheduleProps = {
  title: string
  children?: React.ReactNode
}

export const MonthSchedule: FC<MonthScheduleProps> = ({ title, children }) => {

  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return(
    <div className='my-4 flex flex-col'>
      <div className='cursor-pointer p-2 shadow-md' onClick={toggleOpen}>
        <h3 className='text-yellowColor text-xl'>{title}</h3>
      </div>
      {isOpen && <div className='py-4'>{children}</div>}
    </div>
  )
}

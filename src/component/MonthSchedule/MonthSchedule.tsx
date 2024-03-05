import React, {FC, useState} from "react"

type MonthScheduleProps = {
  title: string
  children?: React.ReactNode
}

export const MonthSchedule: FC<MonthScheduleProps> = ({title, children}) => {

  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return(
    <div className='flex flex-col my-4'>
      <div className='shadow-md p-2 cursor-pointer' onClick={toggleOpen}>
        <h3 className='text-xl text-yellowColor'>{title}</h3>
      </div>
      {isOpen && <div className='py-4'>{children}</div>}
    </div>
  )
}

import { FC } from 'react'

import './MainContent.css'

type MainContentProps = {
  children?: React.ReactNode
  selected: boolean
}

export const MainContent: FC<MainContentProps> = ({ children, selected }) => {
  if (selected) {
    return (
      <div className='main-content px-4'>
        <div className='px-4 py-2'>{children}</div>
      </div>
    )
  }

  return null
}

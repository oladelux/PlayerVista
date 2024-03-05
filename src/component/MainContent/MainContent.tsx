import React, {FC} from "react";

import './MainContent.css'

type MainContentProps = {
  children?: React.ReactNode
  selected: boolean
}

export const MainContent: FC<MainContentProps> = ({children, selected}) => {

  if(selected){
    return (
      <div className='main-content px-4'>
        <div className="py-2 px-4">
          {children}
        </div>
      </div>
    )
  }

  return null

}

import { FC, PropsWithChildren } from "react"
import classnames from "classnames"

import './TabButton.scss'

type TabButtonProps = {
  isActive: boolean
  onClick: () => void
  className?: string
}
export const TabButton: FC<PropsWithChildren<TabButtonProps>> = props => {
  return(
    <button type='button' onClick={props.onClick} className={classnames('Tab-button', props.className, {'Tab-button--active': props.isActive})}>
      {props.children}
    </button>
  )
}

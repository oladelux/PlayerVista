import classnames from 'classnames'
import { FC, PropsWithChildren } from 'react'

import './TabContent.scss'

type TabContentProps = {
  isActive: boolean
  className?: string
}
export const TabContent: FC<PropsWithChildren<TabContentProps>> = props => {
  if (props.isActive) {
    return (
      <div className={classnames('Tab-content', props.className)}>{props.children}</div>
    )
  }
  return null
}

import { FC, PropsWithChildren } from 'react'

import './UsefulLinkButton.scss'

type UsefulLinkButtonType = {
  link: string
  title: string
}

export const UsefulLinkButton: FC<PropsWithChildren<UsefulLinkButtonType>> = props => {
  return (
    <a href={props.link} className='usefulLinkButton'>
      <span className='usefulLinkButton__media'>
        {props.children}
      </span>
      <span className='usefulLinkButton_-title'>{props.title}</span>
    </a>
  )
}

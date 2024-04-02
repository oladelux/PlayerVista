import { FC } from 'react'
import ReactDOM from 'react-dom'
import { FiCheck } from 'react-icons/fi'

import { Popup } from '../Popup/Popup.tsx'
import { Button } from '../Button/Button.tsx'

import './SuccessConfirmation.scss'

type SuccessConfirmationPopupProps = {
  /**
   * Function to close the modal in the component
   */
  onClose: () => void
  title: string
}

const SuccessConfirmation: FC<SuccessConfirmationPopupProps> = ({ onClose, title }) => {

  return (
    <Popup onClose={onClose}>
      <div className='Success-confirmation'>
        <div className='Success-confirmation__media'>
          <FiCheck className='Success-confirmation__media-icon' />
        </div>
        <div className='Success-confirmation__title'>{title}</div>
        <Button className='Success-confirmation__btn' onClick={onClose}>Close</Button>
      </div>
    </Popup>
  )
}

export const SuccessConfirmationPopup: FC<SuccessConfirmationPopupProps> = ({ onClose, title }) => {
  const container = document.body

  return ReactDOM.createPortal(<SuccessConfirmation onClose={onClose} title={title}/>, container)
}

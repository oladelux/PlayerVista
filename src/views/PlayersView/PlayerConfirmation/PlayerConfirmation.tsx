import { FC } from 'react'
import ReactDOM from 'react-dom'
import { FiCheck } from 'react-icons/fi'

import { Popup } from '../../../component/Popup/Popup'
import { Button } from '../../../component/Button/Button'

import './PlayerConfirmation.scss'

type PlayerConfirmationPopupProps = {
  /**
   * Function to close the modal in the component
   */
  onClose: () => void
}

const PlayerConfirmation: FC<PlayerConfirmationPopupProps> = ({ onClose }) => {

  return (
    <Popup onClose={onClose}>
      <div className='Player-confirmation'>
        <div className='Player-confirmation__media'>
          <FiCheck className='Player-confirmation__media-icon' />
        </div>
        <div className='Player-confirmation__title'>Player added successfully</div>
        <Button className='Player-confirmation__btn' onClick={onClose}>Close</Button>
      </div>
    </Popup>
  )
}

export const PlayerConfirmationPopup: FC<PlayerConfirmationPopupProps> = ({ onClose }) => {
  const container = document.body

  return ReactDOM.createPortal(<PlayerConfirmation onClose={onClose}/>, container)
}

import React, { FC, useEffect } from 'react'
import cl from 'classnames'

import './Popup.scss'

type PopupProps = {
  /**
   * Function which is called on click overlay.
   */
  onClose: () => void
  /**
   * The content to be displayed inside the button.
   */
  children?: React.ReactNode
  /**
   * Classname which is used in popup wrapper.
   */
  className?: string
  /**
   * Blocks the click by overlay of the popup for the closing
   */
  isCloseFunctionDisabled?: boolean
}

export const Popup: FC<PopupProps> = props => {

  /**
   * Handles the 'keydown' event, typically for closing a popup on the 'Escape' key press.
   * @param event - The keyboard event object.
   */
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !props.isCloseFunctionDisabled) {
      props.onClose()
    }
  }

  /**
   * Handles the click event on the document or overlay,
   * usually for closing the popup.
   */
  const onDocumentClose = () => {
    if (!props.isCloseFunctionDisabled) {
      props.onClose()
    }
  }

  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown)
    document.body.classList.add('suppress-scroll')

    return () => {
      document.body.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('suppress-scroll')
    }
  }, [])

  return (
    <div className={cl('popup', props.className)}>
      <button type='button' onClick={onDocumentClose}
        disabled={props.isCloseFunctionDisabled}
        className={cl('popup__overlay',
          { 'popup__overlay--disabled': props.isCloseFunctionDisabled })} />
      <div className='popup__container'>
        {props.children}
      </div>
    </div>
  )
}

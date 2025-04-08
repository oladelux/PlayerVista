import { FC } from 'react'

import cl from 'classnames'

import './Button.scss'

type ButtonType = 'submit' | 'button'

type ButtonProps = {
  /**
   * A function to be called when the button is clicked. (Optional)
   */
  onClick?: () => void
  /**
   * Specifies whether the button is disabled. (Optional)
   */
  disabled?: boolean
  /**
   * The type of the button, either 'submit' or 'button'. (Optional)
   */
  type?: ButtonType
  /**
   * Additional CSS class name(s) to apply to the Button component. (Optional)
   */
  className?: string
  /**
   * The content to be displayed inside the button.
   */
  children?: React.ReactNode
}

export const Button: FC<ButtonProps> = props => {
  //For greater security as user can change the disable attribute manually on dev tools
  const onSecurityClick = () => {
    if (!props.disabled && props.onClick) {
      props.onClick()
    }
  }

  return (
    <button
      type={props.type}
      className={cl('button', props.className, { button__disabled: props.disabled })}
      onClick={onSecurityClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}

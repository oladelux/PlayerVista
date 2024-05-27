import React, { FC, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

import './PasswordInputField.scss'

type PasswordInputFieldProps = {
  /**
   * The placeholder text to display
   */
  placeholder?: string
  /**
   * The value of the input field
   */
  value: string | number | undefined
  /**
   * A potential field error to display
   */
  error?: string
  /**
   * The `name` prop specifies the name attribute for the input element,
   * to uniquely identify the input field when working with the multistep form.
   */
  name?: string
  /**
   * Event handler for changes
   */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * Additional classnames for the input field
   */
  className?: string
}

export const PasswordInputField: FC<PasswordInputFieldProps> = props => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='Password-input-field'>
      <input
        className={`Password-input-field__input ${props.className}`}
        type={showPassword ? 'text' : 'password'}
        value={props.value}
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        autoComplete='off'
      />
      <div className='Password-input-field__toggle' onClick={togglePasswordVisibility}>
        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
      </div>
      {props.error && <span className='Password-input-field__error'>{props.error}</span>}
    </div>
  )
}

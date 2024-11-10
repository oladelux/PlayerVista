import React, { ChangeEvent, FC } from 'react'
import cl from 'classnames'

import './InputField.scss'

type InputFieldProps = {
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
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  /**
   * Additional classnames for the input field
   */
  className?: string
  /**
   * The type of the input field
   * @default set to text
   */
  type?: 'text' | 'number' | 'password'
  /**
   * If the input field is read-only
   */
  readOnly?: boolean
}

export const InputField: FC<InputFieldProps> = props => {
  return (
    <div className='input-field'>
      <input
        className={cl('input-field__input', props.className)}
        type={props.type ? props.type : 'text'}
        value={props.value}
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        readOnly={props.readOnly}
      />
      {props.error && <span className='input-field__error'>{props.error}</span>}
    </div>
  )
}

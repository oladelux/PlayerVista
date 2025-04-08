import { FC, useState } from 'react'

import { Link } from 'react-router-dom'

import { Button } from '../../component/Button/Button'
import { Header } from '../../component/Header/Header'
import { PasswordInputField } from '../../component/PasswordInputField/PasswordInputField'
import { routes } from '../../constants/routes'

import './ChangePasswordView.scss'

export const ChangePasswordView: FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <>
      <Header />
      <div className='Change-password'>
        <div className='Change-password__card'>
          <div className='Change-password__card-title'>Change Password</div>
          <div className='Change-password__card-content'>
            Enter new password and confirm password to reset your forgotten password.
          </div>
          <form className='Change-password__card-form'>
            <div className='Change-password__card-form-input'>
              <div className='Change-password__card-form-input-label'>Password</div>
              <PasswordInputField
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
            </div>
            <div className='Change-password__card-form-input'>
              <div className='Change-password__card-form-input-label'>Confirm Password</div>
              <PasswordInputField
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
              />
            </div>
            <Button type='submit' className='Change-password__card-form-btn'>
              Reset Password
            </Button>
            <div className='Change-password__card-form-footer'>
              <Link className='Change-password__card-form-footer-link' to={routes.login}>
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

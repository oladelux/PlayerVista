import { FC, useState } from 'react'

import { routes } from '../../constants/routes'

import { Header } from '../../component/Header/Header'
import { InputField } from '../../component/InputField/InputField'
import { Button } from '../../component/Button/Button'
import { Link } from 'react-router-dom'

import './ForgotPassword.scss'

export const ForgotPassword: FC = () => {

  const [email, setEmail] = useState('')

  return (
    <>
      <Header />
      <div className='Forgot-password'>
        <div className='Forgot-password__card'>
          <div className='Forgot-password__card-title'>Reset Password</div>
          <div className='Forgot-password__card-content'>Kindly enter email address to reset your password.
            A reset link would be sent to this email address.</div>
          <form className='Forgot-password__card-form'>
            <div className='Forgot-password__card-form-input'>
              <div className='Forgot-password__card-form-input-label'>Email Address</div>
              <InputField className='Forgot-password__card-form-input-label--field' value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <Button type='submit' className='Forgot-password__card-form-btn'>Send Reset Link</Button>
            <div className='Forgot-password__card-form-footer'>
              <Link className='Forgot-password__card-form-footer-link' to={routes.login}>Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

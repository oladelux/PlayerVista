import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { AppController } from '../../hooks/useAppController'
import { routes } from '../../constants/routes'
import { getRandomQuote } from '../../constants/randomQuotes'

import { InputField } from '../../component/InputField/InputField'
import { Button } from '../../component/Button/Button'
import { PasswordInputField } from '../../component/PasswordInputField/PasswordInputField'

import './Login.scss'

const randomQuote = getRandomQuote()

type LoginProps = {
  controller: AppController
}

export const Login: FC<LoginProps> = props => {

  const { authentication } = props.controller

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setLoginData((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const onLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    authentication.loginUser(loginData)
  }

  return(
    <div className='Login'>
      <div className='Login__hero'>
        <div className='Login__hero-overlay'>
          <div className='Login__hero-overlay-heading'>Welcome back!</div>
          <div className='Login__hero-overlay-sub-heading'>
            <div className='Login__hero-overlay-sub-heading--quote'>"{randomQuote.quote}"</div>
            <div className='Login__hero-overlay-sub-heading--author'>...{randomQuote.author}</div>
          </div>
        </div>
      </div>
      <div className='Login__form'>
        <div className='Login__form-title'>Welcome back</div>
        <div className='Login__form-sub-heading'>Sign in to continue to PlayerVista</div>
        <form onSubmit={onLogin} className='Login__form-body'>
          <div className='Login__form-body--input'>
            <div className='Login__form-body--input-label'>Username</div>
            <InputField
              value={loginData.email}
              name='email'
              onChange={handleInputChange}
            />
          </div>
          <div className='Login__form-body--input'>
            <div className='Login__form-body--input-label'>Password</div>
            <PasswordInputField
              value={loginData.password}
              name='password'
              onChange={handleInputChange}
            />
          </div>
          <Button type='submit' className='Login__form-body--btn'>Sign in</Button>
        </form>
        {error && <p>error</p>}
        <div className='Login__form-footer'>
          <Link to={routes.forgotPassword} className='Login__form-footer-forgot-password'>Forgot Password?</Link>
        </div>
      </div>
    </div>
  )
}

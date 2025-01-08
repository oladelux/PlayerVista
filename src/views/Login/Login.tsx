import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { AppController } from '@/hooks/useAppController.ts'
import { routes } from '@/constants/routes.ts'
import { getRandomQuote } from '@/constants/randomQuotes.ts'

import { InputField } from '../../component/InputField/InputField'
import { PasswordInputField } from '../../component/PasswordInputField/PasswordInputField'

import './Login.scss'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import { useToast } from '@/hooks/use-toast.ts'

const randomQuote = getRandomQuote()

type LoginProps = {
  controller: AppController
}

export const Login: FC<LoginProps> = props => {
  const { authentication } = props.controller
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

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

  function onLogin (event: FormEvent<HTMLFormElement>) {
    setLoading(true)
    try {
      event.preventDefault()
      authentication.loginUser(loginData)
    } catch (error) {
      setLoading(false)
      toast({
        variant: 'error',
        description: 'An error occurred',
      })
    }
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

          <LoadingButton
            isLoading={loading}
            type='submit'
            className='w-full bg-dark-purple text-white rounded-lg border-none px-4 py-2 text-base'
          >
            Sign in
          </LoadingButton>
        </form>
        {error && <p>error</p>}
        <div className='Login__form-footer'>
          <Link to={routes.forgotPassword} className='Login__form-footer-forgot-password'>Forgot Password?</Link>
        </div>
      </div>
    </div>
  )
}

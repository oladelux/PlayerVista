import { ChangeEvent, FormEvent, useState } from 'react'

import cl from 'classnames'
import { FaRegCheckCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import { getRandomQuote } from '@/constants/randomQuotes.ts'
import { routes } from '@/constants/routes.ts'
import { useToast } from '@/hooks/use-toast.ts'
import { isPasswordValid } from '@/services/validation.ts'
import useAuth from '@/useAuth.ts'
import './SignUp.scss'

import { InputField } from '../../component/InputField/InputField'
import { PasswordInputField } from '../../component/PasswordInputField/PasswordInputField'

const randomQuote = getRandomQuote()

export function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [registrationData, setRegistrationData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  })

  const hasUppercase = isPasswordValid(registrationData.password).hasUppercase
  const hasLowercase = isPasswordValid(registrationData.password).hasLowercase
  const hasDigit = isPasswordValid(registrationData.password).hasDigit

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setRegistrationData(prev => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const onRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const data = {
      ...registrationData,
      role: 'admin',
    }
    signUp(data)
      .then(() => navigate(routes.selectPlan))
      .catch(() => {
        setLoading(false)
        toast({
          variant: 'error',
          description: 'An error occurred',
        })
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className='Sign-up'>
      <div className='Sign-up__hero'>
        <div className='Sign-up__hero-overlay'>
          <div className='Sign-up__hero-overlay-heading'>Sign Up!</div>
          <div className='Sign-up__hero-overlay-sub-heading'>
            <div className='Sign-up__hero-overlay-sub-heading--quote'>"{randomQuote.quote}"</div>
            <div className='Sign-up__hero-overlay-sub-heading--author'>...{randomQuote.author}</div>
          </div>
        </div>
      </div>
      <div className='Sign-up__form'>
        <div className='Sign-up__form-title'>Create an account</div>
        <div className='Sign-up__form-sub-heading'>Sign up to continue to PlayerVista</div>
        <form className='Sign-up__form-body' onSubmit={onRegister}>
          <div className='Sign-up__form-body-flex'>
            <div className='Sign-up__form-body--input'>
              <div className='Sign-up__form-body--input-label'>First Name</div>
              <InputField
                name='firstName'
                value={registrationData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className='Sign-up__form-body--input'>
              <div className='Sign-up__form-body--input-label'>Last Name</div>
              <InputField
                name='lastName'
                value={registrationData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className='Sign-up__form-body--input'>
            <div className='Sign-up__form-body--input-label'>Email</div>
            <InputField name='email' value={registrationData.email} onChange={handleInputChange} />
          </div>
          <div className='Sign-up__form-body--input'>
            <div className='Sign-up__form-body--input-label'>Password</div>
            <PasswordInputField
              name='password'
              value={registrationData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className='Sign-up__form-validate'>
            <div className='Sign-up__form-validate-text'>Must contain 8 characters along with:</div>
            <div
              className={cl('Sign-up__form-validate-text', {
                'Sign-up__form-validate-text--valid': hasUppercase,
              })}
            >
              <FaRegCheckCircle
                className={cl('Sign-up__form-validate-text--icon', {
                  'Sign-up__form-validate-text--valid': hasUppercase,
                })}
              />
              One UPPERCASE letter
            </div>
            <div
              className={cl('Sign-up__form-validate-text', {
                'Sign-up__form-validate-text--valid': hasDigit,
              })}
            >
              <FaRegCheckCircle
                className={cl('Sign-up__form-validate-text--icon', {
                  'Sign-up__form-validate-text--valid': hasDigit,
                })}
              />
              One number
            </div>
            <div
              className={cl('Sign-up__form-validate-text', {
                'Sign-up__form-validate-text--valid': hasLowercase,
              })}
            >
              <FaRegCheckCircle
                className={cl('Sign-up__form-validate-text--icon', {
                  'Sign-up__form-validate-text--valid': hasLowercase,
                })}
              />
              One lowercase letter
            </div>
          </div>
          <LoadingButton
            isLoading={loading}
            type='submit'
            className='w-full bg-dark-purple text-white hover:bg-dark-purple hover:text-white'
          >
            Sign up
          </LoadingButton>
        </form>
        <div className='Sign-up__form-sign-up'>
          Already have an account?
          <Link to={routes.login} className='Sign-up__form-sign-up--bold'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import { Form } from '@/components/ui/form.tsx'
import { routes } from '@/constants/routes.ts'
import { useToast } from '@/hooks/use-toast.ts'
import useAuth from '@/useAuth.ts'

import PlayerVistaLogo from '../../assets/images/playervista.svg'

export function Login() {
  const [getSearchParams] = useSearchParams()
  const redirectTo = getSearchParams.get('redirectTo')
  const { localSession } = useAuth()

  if (localSession) {
    return <Navigate to={redirectTo || '/'} />
  }

  return <LoginForm />
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type LoginSchemaIn = Partial<z.input<typeof loginSchema>>
type LoginSchemaOut = z.output<typeof loginSchema>

export function LoginForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const form = useForm<LoginSchemaIn, never, LoginSchemaOut>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onLogin(values: LoginSchemaOut) {
    setLoading(true)
    signIn({
      email: values.email,
      password: values.password,
    })
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
    <div className='flex min-h-svh flex-col items-center justify-center gap-5 bg-white p-5'>
      <div className='w-full max-w-sm'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onLogin)}>
            <div className='mb-5'>
              <img src={PlayerVistaLogo} alt='playervista logo' />
            </div>
            <div className='flex flex-col gap-5'>
              <InputFormField
                control={form.control}
                label='Email Address'
                name='email'
                placeholder='john.doe@example.com'
                type='email'
                autoComplete='email'
              />
              <InputFormField
                control={form.control}
                label='Password'
                name='password'
                placeholder='********'
                type='password'
              />
              <LoadingButton
                isLoading={loading}
                type='submit'
                className='w-full bg-dark-purple text-white hover:bg-dark-purple hover:text-white'
              >
                Sign in
              </LoadingButton>
              <div>
                <Link to={routes.forgotPassword} className='text-sm text-at-grey underline'>
                  Forgot Password?
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

import { FC, useState } from 'react'
import { Link } from 'react-router-dom'

import { AppController } from '@/hooks/useAppController.ts'
import { routes } from '@/constants/routes.ts'

import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import { useToast } from '@/hooks/use-toast.ts'
import { Form } from '@/components/ui/form.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PlayerVistaLogo from '../../assets/images/playervista.svg'
import InputFormField from '@/components/form/InputFormField.tsx'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type LoginSchemaIn = Partial<z.input<typeof loginSchema>>
type LoginSchemaOut = z.output<typeof loginSchema>

interface LoginProps {
  controller: AppController
}

export const Login: FC<LoginProps> = props => {
  const { authentication } = props.controller
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginSchemaIn, never, LoginSchemaOut>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onLogin (values: LoginSchemaOut) {
    setLoading(true)
    authentication.loginUser({
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

  return(
    <div className='bg-white flex flex-col items-center justify-center gap-5 min-h-svh p-5'>
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
                className='bg-dark-purple text-white hover:bg-dark-purple hover:text-white w-full'
              >
                Sign in
              </LoadingButton>
              <div>
                <Link to={routes.forgotPassword} className='text-at-grey text-sm underline'>Forgot Password?</Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

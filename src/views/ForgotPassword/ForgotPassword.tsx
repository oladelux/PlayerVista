import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import PlayerVistaLogo from '@/assets/images/playervista.svg'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import { Form } from '@/components/ui/form.tsx'
import { routes } from '@/constants/routes.ts'
import { AppController, useAppController } from '@/hooks/useAppController.ts'



const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

type ForgotPasswordSchemaIn = Partial<z.input<typeof forgotPasswordSchema>>
type ForgotPasswordSchemaOut = z.output<typeof forgotPasswordSchema>

export function ForgotPassword() {
  const appController = useAppController()
  const { authentication } = appController
  const [loading, setLoading] = useState(false)

  const form = useForm<ForgotPasswordSchemaIn, never, ForgotPasswordSchemaOut>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  function onForgotPassword(values: ForgotPasswordSchemaOut) {
    setLoading(true)
    authentication.resetPassword({
      email: values.email,
    }).then(() => setLoading(false))
  }

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-5 bg-at-background p-5'>
      <div className='w-full max-w-sm bg-white px-5 py-8'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onForgotPassword)}>
            <div className='mb-5'>
              <img src={PlayerVistaLogo} alt='playervista logo'/>
            </div>
            <h1 className='text-lg text-dark-purple'>Reset Password</h1>
            <div className='py-4 text-sm text-at-grey'>Kindly enter email address to reset your password.
                A reset link would be sent to this email address.
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
              <LoadingButton
                isLoading={loading}
                type='submit'
                className='w-full bg-dark-purple text-white hover:bg-dark-purple hover:text-white'
              >
                  Send Reset Link
              </LoadingButton>
              <div>
                <Link to={routes.login} className='text-sm text-at-grey'>Back to Login</Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

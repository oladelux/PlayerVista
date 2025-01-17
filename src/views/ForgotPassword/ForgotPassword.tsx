import { useState } from 'react'

import { routes } from '@/constants/routes.ts'
import { Link } from 'react-router-dom'

import { AppController } from '@/hooks/useAppController.ts'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import PlayerVistaLogo from '@/assets/images/playervista.svg'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

interface ForgotPasswordProps {
  controller: AppController
}

type ForgotPasswordSchemaIn = Partial<z.input<typeof forgotPasswordSchema>>
type ForgotPasswordSchemaOut = z.output<typeof forgotPasswordSchema>

export const ForgotPassword = ({ controller }: ForgotPasswordProps) => {
  const { authentication } = controller
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
    <div className='bg-at-background flex flex-col items-center justify-center gap-5 min-h-svh p-5'>
      <div className='w-full max-w-sm bg-white py-8 px-5'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onForgotPassword)}>
            <div className='mb-5'>
              <img src={PlayerVistaLogo} alt='playervista logo'/>
            </div>
            <h1 className='text-lg text-dark-purple'>Reset Password</h1>
            <div className='text-at-grey text-sm py-4'>Kindly enter email address to reset your password.
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
                className='bg-dark-purple text-white hover:bg-dark-purple hover:text-white w-full'
              >
                  Send Reset Link
              </LoadingButton>
              <div>
                <Link to={routes.login} className='text-at-grey text-sm'>Back to Login</Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

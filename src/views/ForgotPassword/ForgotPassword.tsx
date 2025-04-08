import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import * as api from '@/api'
import { ApiError, ClientError } from '@/api'
import PlayerVistaLogo from '@/assets/images/playervista.svg'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import { Form } from '@/components/ui/form.tsx'
import { routes } from '@/constants/routes.ts'
import { useToast } from '@/hooks/use-toast.ts'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

type ForgotPasswordSchemaIn = Partial<z.input<typeof forgotPasswordSchema>>
type ForgotPasswordSchemaOut = z.output<typeof forgotPasswordSchema>

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<ForgotPasswordSchemaIn, never, ForgotPasswordSchemaOut>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onForgotPassword(values: ForgotPasswordSchemaOut) {
    setLoading(true)
    try {
      const data = {
        email: values.email,
      }
      const res = await api.forgotPassword(data)
      if (res.status === 204) {
        toast({
          variant: 'success',
          description: 'Password reset link sent to your email.',
        })
      }
    } catch (e) {
      if (e instanceof ClientError) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (e.responseBody.errors.email === 'emailNotExists') {
          toast({
            variant: 'error',
            title: 'Error resetting password',
            description: 'Email does not exist',
          })
          console.error('Unhandled error resetting password', e.responseBody)
        }
      }
      if (e instanceof ApiError) {
        toast({
          variant: 'error',
          description: 'Reset password failed',
        })
        console.error({ message: 'Reset password failed', reason: e })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-5 bg-at-background p-5'>
      <div className='w-full max-w-sm bg-white px-5 py-8'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onForgotPassword)}>
            <div className='mb-5'>
              <img src={PlayerVistaLogo} alt='playervista logo' />
            </div>
            <h1 className='text-lg text-dark-purple'>Reset Password</h1>
            <div className='py-4 text-sm text-at-grey'>
              Kindly enter email address to reset your password. A reset link would be sent to this
              email address.
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
                <Link to={routes.login} className='text-sm text-at-grey'>
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

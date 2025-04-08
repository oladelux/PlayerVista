import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import * as bcrypt from 'bcryptjs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AuthenticatedUserData } from '@/api'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import { Form } from '@/components/ui/form.tsx'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@/hooks/useUser.ts'

const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  })

type ChangePasswordFormProps = {
  user: AuthenticatedUserData
}

type changePasswordSchemaIn = Partial<z.input<typeof changePasswordSchema>>
type changePasswordSchemaOut = z.output<typeof changePasswordSchema>

export default function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const [loading, setLoading] = useState(false)
  const userHook = useUser()
  const { toast } = useToast()
  const defaultValues: changePasswordSchemaIn = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  const form = useForm<changePasswordSchemaIn, never, changePasswordSchemaOut>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
  })

  async function onSubmit(values: changePasswordSchemaOut) {
    setLoading(true)
    try {
      const hashNewPassword = await bcrypt.hash(values.newPassword, 10)
      const updatePasswordData = {
        oldPassword: values.currentPassword,
        password: hashNewPassword,
      }
      const isMatch = await bcrypt.compare(values.currentPassword, user.password)
      if (!isMatch) {
        console.error('Current password does not match input')
        toast({
          variant: 'error',
          description: 'Current password does not match input',
        })
        setLoading(false)
        return
      }
      await userHook.updateUserData(updatePasswordData)
      setLoading(false)
      toast({
        variant: 'success',
        title: 'Password updated successfully',
      })
    } catch (error) {
      setLoading(false)
      toast({
        variant: 'error',
        description: 'Error updating password',
      })
      console.error('Error updating password:', error)
    }
  }

  return (
    <div className='mt-10'>
      <h1 className='mb-5 font-semibold text-dark-purple'>Change Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col'>
          <div className='flex flex-col gap-5'>
            <InputFormField
              control={form.control}
              label='Current Password'
              name='currentPassword'
              placeholder='Current Password'
              type='password'
              inputClassName='w-1/2'
            />
            <InputFormField
              control={form.control}
              label='New Password'
              name='newPassword'
              placeholder='New Password'
              type='password'
              inputClassName='w-1/2'
            />
            <InputFormField
              control={form.control}
              label='Confirm New Password'
              name='confirmPassword'
              placeholder='Confirm New Password'
              type='password'
              inputClassName='w-1/2'
            />
          </div>
          <div className='my-5'>
            <LoadingButton isLoading={loading} type='submit' className='bg-dark-purple text-white'>
              Update Password
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  )
}

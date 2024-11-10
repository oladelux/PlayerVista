import { Form } from '@/components/ui/form.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InputFormField from '@/components/form/InputFormField.tsx'
import { Button } from '@/components/ui/button.tsx'
import { AuthenticatedUserData } from '@/api'
import bcrypt from 'bcryptjs'
import { useState } from 'react'
import { useUser } from '@/hooks/useUser.ts'

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match',
  path: ['confirmPassword'],
})

type ChangePasswordFormProps = {
  user: AuthenticatedUserData
}

type changePasswordSchemaIn = Partial<z.input<typeof changePasswordSchema>>
type changePasswordSchemaOut = z.output<typeof changePasswordSchema>

export default function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const [isUpdated, setIsUpdated] = useState(false)
  const userHook = useUser()
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
    const hashNewPassword = await bcrypt.hash(values.newPassword, 10)
    const updatePasswordData= {
      oldPassword: values.currentPassword,
      password: hashNewPassword,
    }
    const isMatch = await bcrypt.compare(values.currentPassword, user.password)
    if(!isMatch){
      console.log('Current password does not match input')
      return
    }

    await userHook.updateUserData(updatePasswordData)
    setIsUpdated(true)
    // Hide the message after a delay (optional)
    setTimeout(() => setIsUpdated(false), 3000)
  }

  return (
    <div className='mt-10'>
      <h1 className='font-semibold text-dark-purple mb-5'>Change Password</h1>
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
            <Button className='bg-dark-purple text-white'>Update Password</Button>
          </div>
          {isUpdated && (
            <p className='text-green-500 mt-4'>Profile updated successfully!</p>
          )}
        </form>
      </Form>
    </div>
  )
}

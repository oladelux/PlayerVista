import { Form } from '@/components/ui/form.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InputFormField from '@/components/form/InputFormField.tsx'
import { Button } from '@/components/ui/button.tsx'

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
})

type changePasswordSchemaIn = Partial<z.input<typeof changePasswordSchema>>
type changePasswordSchemaOut = z.output<typeof changePasswordSchema>

export default function ChangePassword() {

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
    console.log(values)
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
        </form>
      </Form>
    </div>
  )
}

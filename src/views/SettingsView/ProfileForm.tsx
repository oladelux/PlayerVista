import { zodResolver } from '@hookform/resolvers/zod'
import { capitalize } from '@mui/material'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AuthenticatedUserData, Roles } from '@/api'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import SelectFormField from '@/components/form/SelectFormField.tsx'
import { Form } from '@/components/ui/form.tsx'
import { useToast } from '@/hooks/use-toast.ts'
import { useUser } from '@/hooks/useUser.ts'

type ProfileFormProps = {
  user: AuthenticatedUserData
  canManageRole: boolean
  roles: Roles[]
}

const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.string(),
})

type ProfileSchemaIn = Partial<z.input<typeof profileSchema>>
type ProfileSchemaOut = z.output<typeof profileSchema>

export default function ProfileForm({ user, canManageRole, roles }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const userHook = useUser()
  const defaultValues = useMemo(() => {
    const typedDefaultValues: ProfileSchemaIn = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }
    return typedDefaultValues
  }, [user.email, user.firstName, user.lastName, user.role])

  const form = useForm<ProfileSchemaIn, never, ProfileSchemaOut>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  })

  async function onSubmit(values: ProfileSchemaOut) {
    setLoading(true)
    try {
      values.role = canManageRole ? values.role : user.role
      await userHook.updateUserData(values)
      setLoading(false)
      toast({
        variant: 'success',
        title: 'Profile updated successfully',
      })
    } catch (error) {
      console.error('Error updating user:', error)
      setLoading(false)
      toast({
        variant: 'error',
        description: 'Error updating profile',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
          <InputFormField
            control={form.control}
            label='First Name'
            name='firstName'
            placeholder='First Name'
            type='text'
          />
          <InputFormField
            control={form.control}
            label='Last Name'
            name='lastName'
            placeholder='Last Name'
            type='text'
          />
          <InputFormField
            control={form.control}
            label='Email Address'
            name='email'
            placeholder='Email'
            type='email'
            readOnly
          />
          <SelectFormField
            control={form.control}
            label='Role'
            name='role'
            placeholder='Select Role'
            options={roles.map(role => ({ value: role.name, label: capitalize(role.name) }))}
            disabled={!canManageRole}
          />
        </div>
        <div className='my-5'>
          <LoadingButton
            isLoading={loading}
            type='submit'
            className='bg-dark-purple text-white'
          >
            Update
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}

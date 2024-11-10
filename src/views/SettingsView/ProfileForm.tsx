import { Form } from '@/components/ui/form.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMemo } from 'react'
import InputFormField from '@/components/form/InputFormField.tsx'
import { Button } from '@/components/ui/button.tsx'
import { AuthenticatedUserData } from '@/api'
import SelectFormField from '@/components/form/SelectFormField.tsx'
import { useUser } from '@/hooks/useUser.ts'
import { useSelector } from 'react-redux'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import { capitalize } from '@mui/material'

type ProfileFormProps = {
  user: AuthenticatedUserData
  canManageRole: boolean
}

const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.string(),
})

type ProfileSchemaIn = Partial<z.input<typeof profileSchema>>
type ProfileSchemaOut = z.output<typeof profileSchema>

export default function ProfileForm({ user, canManageRole }: ProfileFormProps) {
  const { roles } = useSelector(settingsSelector)
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
    values.role = canManageRole ? values.role : user.role
    await userHook.updateUserData(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col'>
        <div className='grid gap-10 grid-cols-1 md:grid-cols-2'>
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
          <Button className='bg-dark-purple text-white'>Update</Button>
        </div>
      </form>
    </Form>
  )
}

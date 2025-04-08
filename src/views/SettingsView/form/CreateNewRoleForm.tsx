import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { capitalize } from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AuthenticatedUserData, RoleFormData } from '@/api'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import CheckboxFormField from '@/components/form/CheckboxFormField.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import { Form } from '@/components/ui/form.tsx'
import { useToast } from '@/hooks/use-toast.ts'
import { UseUpdates } from '@/hooks/useUpdates.ts'
import { roleService } from '@/singletons'
import { AllPermissions } from '@/utils/allPermissions.ts'

const createNewRoleSchema = z.object({
  roleName: z.string(),
  permissions: z.array(z.string()),
})

type createNewRoleSchemaIn = Partial<z.input<typeof createNewRoleSchema>>
type createNewRoleSchemaOut = z.output<typeof createNewRoleSchema>

type CreateNewRoleFormProps = {
  user: AuthenticatedUserData
  logger: UseUpdates
  setDialogOpen: (open: boolean) => void
}

export default function CreateNewRoleForm({ user, logger, setDialogOpen }: CreateNewRoleFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const defaultValues: createNewRoleSchemaIn = {
    roleName: '',
    permissions: [],
  }

  const form = useForm<createNewRoleSchemaIn, never, createNewRoleSchemaOut>({
    resolver: zodResolver(createNewRoleSchema),
    defaultValues,
  })

  async function onSubmit(values: createNewRoleSchemaOut) {
    setLoading(true)
    try {
      const data: RoleFormData = {
        groupId: user.groupId,
        name: values.roleName,
        permissions: values.permissions || [],
        createdByUserId: user.id,
      }
      roleService.insert(data).then(() => {
        setLoading(false)
        logger.setUpdate({ message: 'added a new role', userId: user.id, groupId: user.groupId })
        logger.sendUpdates(user.groupId)
        setDialogOpen(false)
        toast({
          variant: 'success',
          description: 'Role successfully created',
        })
      })
    } catch (error) {
      setLoading(false)
      toast({
        variant: 'error',
        description: 'Error creating role',
      })
      console.error('Error creating role:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputFormField
          control={form.control}
          name='roleName'
          placeholder='e.g Admin'
          label='Role Name'
        />
        <div className='mt-4'>
          <h3 className='font-semibold'>Permissions</h3>
          <div className='mt-2 grid grid-cols-2 gap-2'>
            {AllPermissions.map(permission => (
              <CheckboxFormField
                key={permission}
                control={form.control}
                name='permissions'
                value={permission}
              >
                {capitalize(permission.replace(/_/g, ' ').toLowerCase())}
              </CheckboxFormField>
            ))}
          </div>
        </div>
        <LoadingButton
          isLoading={loading}
          type='submit'
          className='t-10 mb-3 bg-dark-purple text-white'
        >
          Save
        </LoadingButton>
      </form>
    </Form>
  )
}

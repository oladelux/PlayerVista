import { Form } from '@/components/ui/form.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CheckboxFormField from '@/components/form/CheckboxFormField.tsx'
import { AllPermissions } from '@/utils/allPermissions.ts'
import { Button } from '@/components/ui/button.tsx'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/types.ts'
import { createRoleThunk } from '@/store/slices/SettingsSlice.ts'
import { AuthenticatedUserData, RoleFormData } from '@/api'
import { capitalize } from '@mui/material'
import { UseUpdates } from '@/hooks/useUpdates.ts'
import { useToast } from '@/hooks/use-toast.ts'

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
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const defaultValues: createNewRoleSchemaIn = {
    roleName: '',
    permissions: [],
  }

  const form = useForm<createNewRoleSchemaIn, never, createNewRoleSchemaOut>({
    resolver: zodResolver(createNewRoleSchema),
    defaultValues,
  })

  async function onSubmit (values: createNewRoleSchemaOut){
    try {
      const data: RoleFormData = {
        groupId: user.groupId,
        name: values.roleName,
        permissions: values.permissions || [],
        createdByUserId: user.id,
      }
      dispatch(createRoleThunk({
        data,
      }))
        .unwrap()
        .then(() => {
          logger.setUpdate({ message: 'added a new role', userId: user.id, groupId: user.groupId })
          logger.sendUpdates(user.groupId)
          setDialogOpen(false)
          toast({
            variant: 'success',
            description: 'Role successfully created',
          })
        })
    } catch (error) {
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
        <InputFormField control={form.control} name='roleName' placeholder='e.g Admin' label='Role Name'/>
        <div className='mt-4'>
          <h3 className='font-semibold'>Permissions</h3>
          <div className='grid grid-cols-2 gap-2 mt-2'>
            {AllPermissions.map((permission) => (
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
        <Button type='submit' className='mt-10 mb-3 bg-dark-purple text-white'>
          Save
        </Button>
      </form>
    </Form>
  )
}

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Roles } from '@/api'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import CheckboxFormField from '@/components/form/CheckboxFormField.tsx'
import { Form } from '@/components/ui/form.tsx'
import { useToast } from '@/hooks/use-toast.ts'
import { roleService } from '@/singletons'
import { AllPermissions } from '@/utils/allPermissions.ts'

const capitalize = (text: string) => {
  return text.replace(/\b\w/g, char => char.toUpperCase()).replace(/_/g, ' ')
}

type RolesViewProps = {
  roles: Roles[]
}

const rolesSchema = z.object({
  roles: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      permissions: z.array(z.string()),
    }),
  ),
})

type rolesSchemaIn = Partial<z.input<typeof rolesSchema>>
type rolesSchemaOut = z.output<typeof rolesSchema>

export default function RolesView({ roles }: RolesViewProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [activeRole, setActiveRole] = useState<string>('admin')
  const defaultValues: rolesSchemaIn = {
    roles: roles,
  }

  const form = useForm<rolesSchemaIn, never, rolesSchemaOut>({
    resolver: zodResolver(rolesSchema),
    defaultValues,
  })

  // Find the data for the currently active role
  const activeRoleIndex = roles.findIndex(role => role.name === activeRole)
  const activeRoleData = roles[activeRoleIndex] || { permissions: [] }
  const updatedPermissions = form.watch(`roles.${activeRoleIndex}.permissions`) as string[]

  async function onSubmit() {
    setLoading(true)
    try {
      roleService
        .patch(roles[activeRoleIndex].id, updatedPermissions, roles[activeRoleIndex].groupId)
        .then(() => {
          setLoading(false)
          toast({
            variant: 'success',
            description: 'Permissions updated successfully',
          })
        })
    } catch (error) {
      setLoading(false)
      toast({
        variant: 'error',
        description: 'Error updating permissions',
      })
      console.error('Error updating permissions:', error)
    }
  }

  useEffect(() => {
    if (activeRoleData) {
      form.reset(
        {
          roles: [
            ...roles.slice(0, activeRoleIndex),
            {
              ...activeRoleData,
              permissions: activeRoleData.permissions,
            },
            ...roles.slice(activeRoleIndex + 1),
          ],
        },
        { keepDefaultValues: true },
      )
    }
  }, [activeRole, activeRoleData, activeRoleIndex, form, roles])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid w-full grid-cols-4 gap-3 bg-at-background p-5'>
          <div className='col-span-1 bg-at-white p-5'>
            {roles
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(role => (
                <div
                  key={role.id}
                  onClick={() => setActiveRole(role.name)}
                  className={classnames('cursor-pointer rounded p-2', {
                    'bg-dark-purple text-white': activeRole === role.name,
                  })}
                >
                  {capitalize(role.name)}
                </div>
              ))}
          </div>
          <div className='col-span-3 bg-at-white p-5'>
            <h2 className='text-lg font-bold'>{capitalize(activeRole)} Permissions</h2>
            <div className='mt-3 grid grid-cols-2 gap-3'>
              {AllPermissions.map(permission => (
                <CheckboxFormField
                  key={permission}
                  control={form.control}
                  name={`roles.${activeRoleIndex}.permissions`}
                  value={permission}
                  defaultChecked={activeRoleData.permissions.includes(permission)}
                >
                  {capitalize(permission)}
                </CheckboxFormField>
              ))}
            </div>
            <LoadingButton
              isLoading={loading}
              type='submit'
              className='mt-4 rounded bg-dark-purple px-4 py-2 text-white hover:bg-blue-600'
            >
              Save changes
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  )
}

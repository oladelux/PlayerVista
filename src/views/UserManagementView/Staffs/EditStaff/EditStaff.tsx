import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { StaffData } from '@/api'
import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import SelectFormField from '@/components/form/SelectFormField.tsx'
import { Form, FormLabel } from '@/components/ui/form.tsx'
import { useToast } from '@/hooks/use-toast.ts'
import { useStaff } from '@/hooks/useStaff.ts'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import { getStaffThunk, staffSelector } from '@/store/slices/StaffSlice.ts'
import { AppDispatch } from '@/store/types.ts'
import { getStaffDefaultValues } from '@/views/UserManagementView/Staffs/EditStaff/staffDefaultValues.ts'
import { staffSchema, StaffSchemaIn, StaffSchemaOut } from '@/views/UserManagementView/Staffs/EditStaff/staffSchema.ts'



export function EditStaff() {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { staffId } = useParams()
  const { staff } = useSelector(staffSelector)
  const { roles } = useSelector(settingsSelector)
  const staffHook = useStaff(staff?.id)
  const [loading, setLoading] = useState(false)

  const defaultValues = useMemo(() => {
    return getStaffDefaultValues(staff)
  }, [staff])

  const form = useForm<StaffSchemaIn, never, StaffSchemaOut>({
    resolver: zodResolver(staffSchema),
    defaultValues,
  })

  const Roles = roles.map(role => ({ label: role.name, value: role.name }))

  async function onSubmit(values: StaffSchemaOut) {
    if(!staff) return
    setLoading(true)
    try {
      const data: Partial<StaffData> = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
      }
      await staffHook.updateStaff(data)
      setLoading(false)
      toast({
        variant: 'success',
        title: 'Staff Member updated successfully',
      })
    } catch (error) {
      setLoading(false)
      toast({
        variant: 'error',
        description: 'Error updating staff',
      })
      console.error('Error updating staff:', error)
    }
  }

  useEffect(() => {
    form.reset(defaultValues, { keepDirtyValues: true })
  }, [defaultValues, form])

  useEffect(() => {
    dispatch(getStaffThunk({ id: staffId }))
  }, [dispatch, staffId])

  return (
    <DashboardLayout>
      <div className='mb-5 rounded-md bg-white px-2.5 py-2 md:px-12 md:py-10'>
        <div className=''>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='mb-5 grid grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-2'>
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
              </div>
              <div className='mb-5 grid grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-2'>
                <div>
                  <FormLabel htmlFor='role'>Role</FormLabel>
                  <SelectFormField
                    control={form.control}
                    name='role'
                    options={Roles}
                    inputClassName='w-48 h-10 mt-2'
                  />
                </div>
                <div>
                  <InputFormField
                    control={form.control}
                    label='Email'
                    name='email'
                    placeholder='Email'
                    type='email'
                  />
                </div>
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
        </div>
      </div>
    </DashboardLayout>
  )

}

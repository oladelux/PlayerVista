import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormLabel } from '@/components/ui/form.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import SelectFormField from '@/components/form/SelectFormField.tsx'
import { useToast } from '@/hooks/use-toast.ts'
import { getStaffThunk, staffSelector } from '@/store/slices/StaffSlice.ts'
import { getStaffDefaultValues } from '@/views/UserManagementView/Staffs/EditStaff/staffDefaultValues.ts'
import { staffSchema, StaffSchemaIn, StaffSchemaOut } from '@/views/UserManagementView/Staffs/EditStaff/staffSchema.ts'
import { useStaff } from '@/hooks/useStaff.ts'
import { StaffData } from '@/api'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import { AppDispatch } from '@/store/types.ts'
import { useParams } from 'react-router-dom'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'

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
      <div className='py-2 px-2.5 mb-5 md:py-10 md:px-12 bg-white rounded-md'>
        <div className=''>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
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
              <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
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

import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { getTeamDefaultValues } from '@/views/Teams/form/teamDefaultValues.ts'
import { useSelector } from 'react-redux'
import { teamSelector } from '@/store/slices/TeamSlice.ts'
import { useForm } from 'react-hook-form'
import { teamSchema, TeamSchemaIn, TeamSchemaOut } from '@/views/Teams/form/teamSchema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormLabel } from '@/components/ui/form.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import SelectFormField from '@/components/form/SelectFormField.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useTeam } from '@/hooks/useTeam.ts'
import { useToast } from '@/hooks/use-toast.ts'
import { TeamFormData, uploadImageToCloudinary } from '@/api'
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak'
import { cloudName, cloudUploadPresets } from '@/config/constants.ts'

const teamGender = [
  { label: 'male', value: 'Male' },
  { label: 'female', value: 'Female' },
]

const teamAgeGroup = [
  { label: 'under-7', value: 'Under-7' },
  { label: 'under-9', value: 'Under-9' },
  { label: 'under-11', value: 'Under-11' },
  { label: 'under-13', value: 'Under-13' },
  { label: 'under-15', value: 'Under-15' },
  { label: 'under-17', value: 'Under-17' },
  { label: 'under-19', value: 'Under-19' },
  { label: 'under-21', value: 'Under-21' },
  { label: 'Senior Team', value: 'senior-team' },
]

export function ManageTeam() {
  const { team } = useSelector(teamSelector)
  const { toast } = useToast()
  const teamHook = useTeam(team?.id)

  const [selectedImage, setSelectedImage] = useState<string>(team?.logo || '')
  const [file, setFile] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const defaultValues = useMemo(() => {
    return getTeamDefaultValues(team)
  }, [team])

  const form = useForm<TeamSchemaIn, never, TeamSchemaOut>({
    resolver: zodResolver(teamSchema),
    defaultValues,
  })

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files
    if (imgFile) {
      setSelectedImage(URL.createObjectURL(imgFile[0]))
      setIsUploading(true)

      const reader = new FileReader()
      reader.onloadend = () => {
        uploadImageToCloudinary({
          folder: 'teamImage',
          file: reader.result as string,
          cloud_name: cloudName,
          upload_preset: cloudUploadPresets,
        }).then(res => {
          setIsUploading(false)
          setFile(res.url)
        }).catch(err => {
          console.error('Error uploading image:', err)
          setIsUploading(false)
        })
      }
      reader.readAsDataURL(imgFile[0])
    }
  }

  async function onSubmit(values: TeamSchemaOut) {
    if(!team) return
    try {
      const data: TeamFormData = {
        userId: team.userId,
        logo: file,
        teamName: values.teamName,
        creationYear: values.establishmentYear,
        teamGender: values.teamGender,
        ageGroup: values.ageGroup,
        headCoach: values.headCoach,
        headCoachContact: values.headCoachContact,
        assistantCoach: values.assistantCoach,
        assistantCoachContact: values.assistantCoachContact,
        medicalPersonnel: values.medicalPersonnel,
        medicalPersonnelContact: values.medicalPersonnelContact,
        kitManager: values.kitManager,
        kitManagerContact: values.kitManagerContact,
        mediaManager: values.mediaManager,
        mediaManagerContact: values.mediaManagerContact,
        logisticsCoordinator: values.logisticsCoordinator,
        logisticsCoordinatorContact: values.logisticsCoordinatorContact,
        stadiumName: values.stadiumName,
        street: values.stadiumLocationStreet,
        postcode: values.stadiumLocationPostalCode,
        city: values.stadiumLocationCity,
        country: values.stadiumLocationCountry,
      }
      await teamHook.updateTeam(data)
      toast({
        variant: 'success',
        title: 'Team updated successfully',
      })
    } catch (error) {
      toast({
        variant: 'error',
        description: 'Error updating team',
      })
      console.error('Error updating team:', error)
    }
  }

  useEffect(() => {
    form.reset(defaultValues, { keepDirtyValues: true })
  }, [defaultValues, form])

  return (
    <DashboardLayout>
      <div className='py-2 px-2.5 mb-5 md:py-10 md:px-12 bg-white rounded-md'>
        <div className=''>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='Multi-step__team-image mb-5'>
                <input
                  id='teamImage'
                  name='teamImage'
                  className='Multi-step__team-image--input'
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
                <label htmlFor='teamImage' className='Multi-step__team-image--label'>
                  <div className='Multi-step__team-image--label-preview'>
                    {selectedImage ?
                      <img alt='preview' className='Multi-step__team-image--label-preview-img' src={selectedImage}/>
                      : <CenterFocusWeakIcon className='Multi-step__team-image--label-preview-icon'/>
                    }
                  </div>
                </label>
                <div className='Multi-step__team-image--title'>
                  Choose your team logo
                </div>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                <InputFormField
                  control={form.control}
                  label='Team Name'
                  name='teamName'
                  placeholder='Team Name'
                  type='text'
                />
                <InputFormField
                  control={form.control}
                  label='Year of Establishment'
                  name='establishmentYear'
                  placeholder='Year of Establishment'
                  type='text'
                />
              </div>
              <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                <div>
                  <FormLabel htmlFor='teamGender'>Team Gender</FormLabel>
                  <SelectFormField
                    control={form.control}
                    name='teamGender'
                    options={teamGender}
                    inputClassName='w-48 h-10 mt-2'
                  />
                </div>
                <div>
                  <FormLabel htmlFor='teamGender'>Age Group</FormLabel>
                  <SelectFormField
                    control={form.control}
                    name='ageGroup'
                    options={teamAgeGroup}
                    inputClassName='w-48 h-10 mt-2'
                  />
                </div>
              </div>
              <div className='border-b my-10'></div>
              <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                  <InputFormField
                    control={form.control}
                    label='Head Coach'
                    name='headCoach'
                    placeholder='Head Coach'
                    type='text'
                  />
                  <InputFormField
                    control={form.control}
                    label='Head Coach Contact'
                    name='headCoachContact'
                    placeholder='Head Coach Contact'
                    type='text'
                  />
                </div>
                <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                  <InputFormField
                    control={form.control}
                    label='Assistant Coach'
                    name='assistantCoach'
                    placeholder='Assistant Coach'
                    type='text'
                  />
                  <InputFormField
                    control={form.control}
                    label='Assistant Coach Contact'
                    name='assistantCoachContact'
                    placeholder='Assistant Coach Contact'
                    type='text'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                  <InputFormField
                    control={form.control}
                    label='Medical Personnel'
                    name='medicalPersonnel'
                    placeholder='Medical Personnel'
                    type='text'
                  />
                  <InputFormField
                    control={form.control}
                    label='Medical Personnel Contact'
                    name='medicalPersonnelContact'
                    placeholder='Medical Personnel Contact'
                    type='text'
                  />
                </div>
                <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                  <InputFormField
                    control={form.control}
                    label='Kit Manager'
                    name='kitManager'
                    placeholder='Kit Manager'
                    type='text'
                  />
                  <InputFormField
                    control={form.control}
                    label='Kit Manager Contact'
                    name='kitManagerContact'
                    placeholder='Kit Manager Contact'
                    type='text'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                  <InputFormField
                    control={form.control}
                    label='Media Manager'
                    name='mediaManager'
                    placeholder='Media Manager'
                    type='text'
                  />
                  <InputFormField
                    control={form.control}
                    label='Media Manager Contact'
                    name='mediaManagerContact'
                    placeholder='Media Manager Contact'
                    type='text'
                  />
                </div>
                <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                  <InputFormField
                    control={form.control}
                    label='Logistics Coordinator'
                    name='logisticsCoordinator'
                    placeholder='Logistics Coordinator'
                    type='text'
                  />
                  <InputFormField
                    control={form.control}
                    label='Logistics Coordinator Contact'
                    name='logisticsCoordinatorContact'
                    placeholder='Logistics Coordinator Contact'
                    type='text'
                  />
                </div>
              </div>
              <div className='border-b my-10'></div>
              <div className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-5'>
                <div className='col-span-1'>
                  <InputFormField
                    control={form.control}
                    label='Name of Stadium'
                    name='stadiumName'
                    placeholder='Name of Stadium'
                    type='text'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 sm:grid-cols-1 gap-5 mb-5'>
                <InputFormField
                  control={form.control}
                  label='Street'
                  name='stadiumLocationStreet'
                  placeholder='Street'
                  type='text'
                />
                <InputFormField
                  control={form.control}
                  label='Postcode'
                  name='stadiumLocationPostalCode'
                  placeholder='Postcode'
                  type='text'
                />
                <InputFormField
                  control={form.control}
                  label='City'
                  name='stadiumLocationCity'
                  placeholder='City'
                  type='text'
                />
                <InputFormField
                  control={form.control}
                  label='Country'
                  name='stadiumLocationCountry'
                  placeholder='Country'
                  type='text'
                />
              </div>
              <div className='my-5'>
                <Button className='bg-dark-purple text-white'>Update</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  )

}

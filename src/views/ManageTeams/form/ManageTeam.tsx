import { ChangeEvent, useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Award,
  Briefcase,
  Building,
  CalendarRange,
  Camera,
  ImagePlus,
  MapPin,
  Phone,
  Save,
  Shirt,
  Stethoscope,
  UserCircle,
  Users,
  X,
} from 'lucide-react'
import { Control, useForm } from 'react-hook-form'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'

import { TeamFormData, uploadImageToCloudinary } from '@/api'
import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cloudName, cloudUploadPresets } from '@/config/constants.ts'
import { useToast } from '@/hooks/use-toast.ts'
import { teamService } from '@/singletons'
import { getTeamDefaultValues } from '@/views/ManageTeams/form/teamDefaultValues.ts'
import { teamSchema, TeamSchemaIn, TeamSchemaOut } from '@/views/ManageTeams/form/teamSchema.ts'
import { NotFound } from '@/views/NotFound'

const teamGender = [
  { label: 'male', value: 'Male' },
  { label: 'female', value: 'Female' },
]

const ageGroups = [
  { value: 'under-7', label: 'Under-7' },
  { value: 'under-9', label: 'Under-9' },
  { value: 'under-11', label: 'Under-11' },
  { value: 'under-13', label: 'Under-13' },
  { value: 'under-15', label: 'Under-15' },
  { value: 'under-17', label: 'Under-17' },
  { value: 'under-19', label: 'Under-19' },
  { value: 'under-21', label: 'Under-21' },
  { value: 'senior-team', label: 'Senior Team' },
]

export function ManageTeam() {
  const { toast } = useToast()
  const { selectedTeamId } = useParams()
  const navigate = useNavigate()
  const [file, setFile] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [step, setStep] = useState<string>('team-info')
  const {
    teams,
    teamsError: error,
    teamsLoading: loading,
  } = useOutletContext<DashboardLayoutOutletContext>()
  const team = teams.find(team => team.id === selectedTeamId)

  const [selectedImage, setSelectedImage] = useState<string>(team?.logo || '')

  const defaultValues = useMemo(() => {
    return getTeamDefaultValues(team)
  }, [team])

  const form = useForm<TeamSchemaIn, never, TeamSchemaOut>({
    resolver: zodResolver(teamSchema),
    defaultValues,
  })

  const removeImage = () => {
    setSelectedImage('')
    setFile('')
  }

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
        })
          .then(res => {
            setIsUploading(false)
            setFile(res.url)
          })
          .catch(err => {
            console.error('Error uploading image:', err)
            setIsUploading(false)
          })
      }
      reader.readAsDataURL(imgFile[0])
    }
  }

  async function onSubmit(values: TeamSchemaOut) {
    if (!team) return
    setFormLoading(true)
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
      await teamService.patch(team.id, data)
      setFormLoading(false)
      toast({
        variant: 'success',
        title: 'Team updated successfully',
      })
      navigate(`/manage-teams`)
    } catch (error) {
      setFormLoading(false)
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

  if (loading) return <LoadingPage />
  if (error) return <NotFound />

  return (
    <div className='mx-auto max-w-5xl space-y-6 p-4 md:p-6'>
      <Tabs value={step} onValueChange={setStep} className='w-full'>
        <TabsList className='mb-8 grid grid-cols-3'>
          <TabsTrigger value='team-info' className='flex items-center gap-2' disabled={formLoading}>
            <Award className='size-4' />
            <span className='hidden md:inline'>Team Info</span>
            <span className='md:hidden'>1</span>
          </TabsTrigger>
          <TabsTrigger
            value='team-personnel'
            className='flex items-center gap-2'
            disabled={formLoading}
          >
            <Users className='size-4' />
            <span className='hidden md:inline'>Personnel</span>
            <span className='md:hidden'>2</span>
          </TabsTrigger>
          <TabsTrigger
            value='team-location'
            className='flex items-center gap-2'
            disabled={formLoading}
          >
            <Building className='size-4' />
            <span className='hidden md:inline'>Location</span>
            <span className='md:hidden'>3</span>
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value='team-info'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-2xl'>Team Information</CardTitle>
                  <CardDescription>Update basic information about your team</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Team Logo Upload */}
                  <div className='flex flex-col items-center justify-center py-6'>
                    <div className='relative mb-4'>
                      <div className='flex size-32 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50'>
                        {selectedImage ? (
                          <>
                            <img
                              src={selectedImage}
                              alt='Team Logo Preview'
                              className='size-full object-cover'
                            />
                            <button
                              type='button'
                              onClick={removeImage}
                              className='absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white'
                            >
                              <X className='size-4' />
                            </button>
                          </>
                        ) : (
                          <ImagePlus className='size-10 text-gray-400' />
                        )}
                      </div>
                    </div>
                    <label htmlFor='logo-upload' className='cursor-pointer'>
                      <div className='flex items-center justify-center gap-2 text-sm text-primary hover:underline'>
                        <Camera className='size-4' />
                        {selectedImage ? 'Change Team Logo' : 'Upload Team Logo'}
                      </div>
                      <input
                        id='logo-upload'
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleImageChange}
                        disabled={isUploading || formLoading}
                      />
                    </label>
                    {isUploading && (
                      <p className='mt-2 text-sm text-muted-foreground'>Uploading image...</p>
                    )}
                  </div>

                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={form.control as Control<TeamSchemaOut>}
                      name='teamName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Award className='size-4 text-muted-foreground' />
                            Team Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter team name'
                              {...field}
                              disabled={formLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as Control<TeamSchemaOut>}
                      name='establishmentYear'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <CalendarRange className='size-4 text-muted-foreground' />
                            Year of Establishment
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Enter year'
                              {...field}
                              disabled={formLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as Control<TeamSchemaOut>}
                      name='teamGender'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Users className='size-4 text-muted-foreground' />
                            Team Gender
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={formLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select gender' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teamGender.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as Control<TeamSchemaOut>}
                      name='ageGroup'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Users className='size-4 text-muted-foreground' />
                            Age Group
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={formLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select age group' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ageGroups.map(group => (
                                <SelectItem key={group.value} value={group.value}>
                                  {group.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className='flex justify-end'>
                  <Button
                    type='button'
                    onClick={() => setStep('team-personnel')}
                    disabled={formLoading}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value='team-personnel'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-2xl'>Team Personnel</CardTitle>
                  <CardDescription>Update information about your team staff</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-6'>
                    <div className='space-y-4'>
                      <h3 className='text-lg font-medium'>Head Coach</h3>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='headCoach'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <UserCircle className='size-4 text-muted-foreground' />
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter head coach name'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='headCoachContact'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Phone className='size-4 text-muted-foreground' />
                                Contact
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter contact number'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className='space-y-4'>
                      <h3 className='text-lg font-medium'>Assistant Coach</h3>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='assistantCoach'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <UserCircle className='size-4 text-muted-foreground' />
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter assistant coach name'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='assistantCoachContact'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Phone className='size-4 text-muted-foreground' />
                                Contact
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter contact number'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className='space-y-4'>
                      <h3 className='text-lg font-medium'>Medical Personnel</h3>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='medicalPersonnel'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Stethoscope className='size-4 text-muted-foreground' />
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter medical personnel name'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='medicalPersonnelContact'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Phone className='size-4 text-muted-foreground' />
                                Contact
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter contact number'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className='space-y-4'>
                      <h3 className='text-lg font-medium'>Kit Manager</h3>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='kitManager'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Shirt className='size-4 text-muted-foreground' />
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter kit manager name'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='kitManagerContact'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Phone className='size-4 text-muted-foreground' />
                                Contact
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter contact number'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className='space-y-4'>
                      <h3 className='text-lg font-medium'>Media Manager</h3>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='mediaManager'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Camera className='size-4 text-muted-foreground' />
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter media manager name'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='mediaManagerContact'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Phone className='size-4 text-muted-foreground' />
                                Contact
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter contact number'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className='space-y-4'>
                      <h3 className='text-lg font-medium'>Logistics Coordinator</h3>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='logisticsCoordinator'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Briefcase className='size-4 text-muted-foreground' />
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter logistics coordinator name'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control as Control<TeamSchemaOut>}
                          name='logisticsCoordinatorContact'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Phone className='size-4 text-muted-foreground' />
                                Contact
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter contact number'
                                  {...field}
                                  disabled={formLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setStep('team-info')}
                    disabled={formLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    type='button'
                    onClick={() => setStep('team-location')}
                    disabled={formLoading}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value='team-location'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-2xl'>Team Location</CardTitle>
                  <CardDescription>
                    Update information about your team's stadium and location
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control as Control<TeamSchemaOut>}
                    name='stadiumName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Building className='size-4 text-muted-foreground' />
                          Stadium Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter stadium name'
                            {...field}
                            disabled={formLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <h3 className='mt-6 flex items-center gap-2 text-lg font-medium'>
                    <MapPin className='size-5 text-muted-foreground' />
                    Stadium Location
                  </h3>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control as Control<TeamSchemaOut>}
                      name='stadiumLocationStreet'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter street address'
                              {...field}
                              disabled={formLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as Control<TeamSchemaOut>}
                      name='stadiumLocationPostalCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter postcode' {...field} disabled={formLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control as Control<TeamSchemaOut>}
                      name='stadiumLocationCity'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter city' {...field} disabled={formLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as Control<TeamSchemaOut>}
                      name='stadiumLocationCountry'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter country' {...field} disabled={formLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setStep('team-personnel')}
                    disabled={formLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    type='submit'
                    disabled={formLoading || isUploading}
                    className='flex items-center gap-2'
                  >
                    {formLoading ? 'Saving...' : 'Save Team'}
                    {!formLoading && <Save className='size-4' />}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Award,
  Briefcase,
  Building,
  CalendarRange,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ImagePlus,
  MapPin,
  Phone,
  Shirt,
  Stethoscope,
  UserCircle,
  Users,
  X,
} from 'lucide-react'
import { useForm } from 'react-hook-form'

import { uploadImageToCloudinary } from '@/api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { cloudName, cloudUploadPresets } from '@/config/constants'
import { useToast } from '@/hooks/use-toast'
import { TeamFormValues, teamFormSchema } from '@/lib/schema/teamSchema'

interface TeamMultiStepFormProps {
  onSubmit: (data: TeamFormValues) => Promise<void>
  onSuccess?: () => void
}

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

export function TeamMultiStepForm({ onSubmit, onSuccess }: TeamMultiStepFormProps) {
  const [step, setStep] = useState<string>('team-info')
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: '',
      creationYear: '',
      teamGender: '',
      ageGroup: '',
      logo: '',
      headCoach: '',
      headCoachContact: '',
      assistantCoach: '',
      assistantCoachContact: '',
      medicalPersonnel: '',
      medicalPersonnelContact: '',
      kitManager: '',
      kitManagerContact: '',
      mediaManager: '',
      mediaManagerContact: '',
      logisticsCoordinator: '',
      logisticsCoordinatorContact: '',
      stadiumName: '',
      street: '',
      postcode: '',
      city: '',
      country: '',
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file)
    setSelectedImage(previewUrl)
    const reader = new FileReader()
    reader.onloadend = () => {
      uploadImageToCloudinary({
        folder: 'teamImage',
        file: reader.result as string,
        cloud_name: cloudName,
        upload_preset: cloudUploadPresets,
      })
        .then(res => {
          form.setValue('logo', res.url)
        })
        .catch(err => {
          console.error('Error uploading image:', err)
        })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (data: TeamFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      toast({
        title: 'Team created successfully',
      })
      if (onSuccess) {
        onSuccess()
      }
      form.reset()
    } catch (error) {
      console.error('Failed to create team:', error)
      toast({
        variant: 'error',
        description: 'Failed to create team',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to make the code cleaner and more type-safe
  const validateFields = (fields: Array<keyof TeamFormValues>) => {
    const hasErrors = fields.some(field => form.getFieldState(field).invalid)

    if (hasErrors) {
      form.trigger(fields)
      return true
    }

    return false
  }

  const goToNextStep = () => {
    if (step === 'team-info') {
      const teamInfoFields: Array<keyof TeamFormValues> = [
        'teamName',
        'creationYear',
        'teamGender',
        'ageGroup',
      ]
      const hasErrors = validateFields(teamInfoFields)

      if (hasErrors) {
        return
      }
      setStep('team-personnel')
    } else if (step === 'team-personnel') {
      const personnelFields: Array<keyof TeamFormValues> = ['headCoach', 'headCoachContact']
      const hasErrors = validateFields(personnelFields)

      if (hasErrors) {
        return
      }
      setStep('team-location')
    }
  }

  const goToPreviousStep = () => {
    if (step === 'team-personnel') {
      setStep('team-info')
    } else if (step === 'team-location') {
      setStep('team-personnel')
    }
  }

  const removeImage = () => {
    setSelectedImage('')
    form.setValue('logo', '')
  }

  return (
    <div className='mx-auto max-w-5xl space-y-6'>
      <Tabs value={step} onValueChange={setStep} className='w-full'>
        <TabsList className='mb-8 grid grid-cols-3'>
          <TabsTrigger
            value='team-info'
            className='flex items-center gap-2'
            disabled={isSubmitting}
          >
            <Award className='size-4' />
            <span className='hidden md:inline'>Team Info</span>
            <span className='md:hidden'>1</span>
          </TabsTrigger>
          <TabsTrigger
            value='team-personnel'
            className='flex items-center gap-2'
            disabled={isSubmitting}
          >
            <Users className='size-4' />
            <span className='hidden md:inline'>Personnel</span>
            <span className='md:hidden'>2</span>
          </TabsTrigger>
          <TabsTrigger
            value='team-location'
            className='flex items-center gap-2'
            disabled={isSubmitting}
          >
            <Building className='size-4' />
            <span className='hidden md:inline'>Location</span>
            <span className='md:hidden'>3</span>
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <TabsContent value='team-info'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-2xl'>Team Information</CardTitle>
                  <CardDescription>Enter basic information about your team</CardDescription>
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
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>

                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={form.control}
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
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='creationYear'
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
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
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
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select gender' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='Male'>Male</SelectItem>
                              <SelectItem value='Female'>Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
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
                            disabled={isSubmitting}
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
                    onClick={goToNextStep}
                    className='flex items-center gap-2'
                    disabled={isSubmitting}
                  >
                    Next Step <ChevronRight className='size-4' />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value='team-personnel'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-2xl'>Team Personnel</CardTitle>
                  <CardDescription>Enter information about your team staff</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-6'>
                    <div className='space-y-4'>
                      <h3 className='text-lg font-medium'>Head Coach</h3>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <FormField
                          control={form.control}
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
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
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
                                  disabled={isSubmitting}
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
                          control={form.control}
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
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
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
                                  disabled={isSubmitting}
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
                          control={form.control}
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
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
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
                                  disabled={isSubmitting}
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
                          control={form.control}
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
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
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
                                  disabled={isSubmitting}
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
                          control={form.control}
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
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
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
                                  disabled={isSubmitting}
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
                          control={form.control}
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
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
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
                                  disabled={isSubmitting}
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
                    onClick={goToPreviousStep}
                    className='flex items-center gap-2'
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className='size-4' /> Previous
                  </Button>
                  <Button
                    type='button'
                    onClick={goToNextStep}
                    className='flex items-center gap-2'
                    disabled={isSubmitting}
                  >
                    Next Step <ChevronRight className='size-4' />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value='team-location'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-2xl'>Team Location</CardTitle>
                  <CardDescription>
                    Enter information about your team's stadium and location
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
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
                            disabled={isSubmitting}
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
                      control={form.control}
                      name='street'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter street address'
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='postcode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter postcode'
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter city' {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='country'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter country' {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Alert className='mt-6 bg-muted/50'>
                    <Check className='size-4' />
                    <AlertTitle>Almost there!</AlertTitle>
                    <AlertDescription>
                      Please review all information before submitting. You'll be able to edit team
                      details later.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className='flex justify-between'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={goToPreviousStep}
                    className='flex items-center gap-2'
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className='size-4' /> Previous
                  </Button>
                  <Button type='submit' disabled={isSubmitting} className='flex items-center gap-2'>
                    {isSubmitting ? 'Creating Team...' : 'Create Team'}
                    {!isSubmitting && <ChevronsRight className='size-4' />}
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

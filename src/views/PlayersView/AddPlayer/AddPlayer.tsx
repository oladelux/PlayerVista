import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import {
  ArrowDown,
  CalendarIcon,
  Camera,
  Crown,
  Flag,
  Globe,
  Home,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Shield,
  Upload,
  User,
  UserPlus,
  Users,
  Weight,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'

import { uploadImageToCloudinary } from '@/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
import { useUpdates } from '@/hooks/useUpdates'
import { cn } from '@/lib/utils'
import { appService, playerService } from '@/singletons'
import { SessionInstance } from '@/utils/SessionInstance'

import { PlayerPositionType } from '../form/PlayerPosition'
import { playerSchema } from '../form/playerSchema'

type PlayerFormValues = z.infer<typeof playerSchema>

const positions = [
  { value: 'GK', label: 'Goalkeeper' },
  { value: 'CB', label: 'Centre Back' },
  { value: 'RB', label: 'Right Back' },
  { value: 'LB', label: 'Left Back' },
  { value: 'LWB', label: 'Left Wing Back' },
  { value: 'RWB', label: 'Right Wing Back' },
  { value: 'CDM', label: 'Defensive Midfield' },
  { value: 'CM', label: 'Central Midfield' },
  { value: 'RM', label: 'Right Midfield' },
  { value: 'LM', label: 'Left Midfield' },
  { value: 'RW', label: 'Right Wing' },
  { value: 'LW', label: 'Left Wing' },
  { value: 'CAM', label: 'Centre Attacking Midfield' },
  { value: 'ST', label: 'Striker' },
  { value: 'CF', label: 'Centre Forward' },
]

const preferredFootOptions = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'both', label: 'Both' },
]

export function AddPlayer() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const teamId = SessionInstance.getTeamId()
  const logger = useUpdates()
  const user = appService.getUserData()
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      street: '',
      city: '',
      postCode: '',
      country: '',
      uniformNumber: '',
      contactPersonFirstName: '',
      contactPersonLastName: '',
      contactPersonPhoneNumber: '',
      contactPersonStreet: '',
      contactPersonCity: '',
      contactPersonPostCode: '',
      contactPersonCountry: '',
      teamCaptain: false,
      nationality: '',
      preferredFoot: '',
      height: '',
      weight: '',
    },
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = event.target.files

    if (imgFile && imgFile[0]) {
      setSelectedImage(URL.createObjectURL(imgFile[0]))
      setIsUploading(true)

      const reader = new FileReader()
      reader.onloadend = () => {
        uploadImageToCloudinary({
          folder: 'playerImage',
          file: reader.result as string,
          cloud_name: cloudName,
          upload_preset: cloudUploadPresets,
        })
          .then(res => {
            setIsUploading(false)
            setSelectedImage(res.url)
            // Here you would normally upload to a server
            setIsUploading(true)
            setTimeout(() => {
              setIsUploading(false)
              toast({
                title: 'Image uploaded',
                description: 'Player image has been uploaded successfully',
              })
            }, 1500)
          })
          .catch(err => {
            console.error('Error uploading image:', err)
            setIsUploading(false)
          })
      }
      reader.readAsDataURL(imgFile[0])
    }
  }

  async function onSubmit(data: PlayerFormValues) {
    console.log('Form data:', data)
    console.log('teamId:', teamId)
    console.log('user:', user)
    if (!teamId || !user) return

    const playerData = {
      ...data,
      imageSrc: selectedImage,
      teamId,
      userId: user.id,
      teamCaptain: false,
      uniformNumber: parseInt(data.uniformNumber),
      birthDate: data.birthDate.toISOString(),
      height: parseInt(data.height),
      weight: parseInt(data.weight),
      position: data.position as PlayerPositionType,
    }

    teamId &&
      (await playerService.insert(playerData, teamId).then(() => {
        toast({
          title: 'Player added',
          description: `${data.firstName} ${data.lastName} has been added successfully`,
        })
        logger.setUpdate({
          message: 'added a new player',
          userId: user.id,
          groupId: user.groupId,
        })
        logger.sendUpdates(user.groupId)
        navigate('/players', { replace: true })
      }))
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)

      toast({
        title: 'Player added',
        description: `${data.firstName} ${data.lastName} has been added successfully`,
      })

      console.log('Form data:', data)

      // Redirect to players page
      navigate('/players')
    }, 1500)
  }

  function onTabChange(value: string) {
    setActiveTab(value)
  }

  return (
    <div className='p-4 md:p-6'>
      <Card className='mb-6 overflow-hidden border-0 bg-gradient-to-r from-primary/5 to-primary/10 shadow-md backdrop-blur-sm'>
        <CardContent className='p-6'>
          <div className='flex flex-col items-center gap-6 sm:flex-row sm:items-start'>
            <div className='group relative flex size-32 items-center justify-center overflow-hidden rounded-lg border-2 border-primary/20 bg-background/80'>
              {selectedImage ? (
                <Avatar className='size-full rounded-lg'>
                  <AvatarImage src={selectedImage} alt='Player' className='object-cover' />
                  <AvatarFallback className='text-3xl font-bold'>PP</AvatarFallback>
                </Avatar>
              ) : (
                <Camera className='size-10 text-muted-foreground' />
              )}
              <label
                htmlFor='playerImage'
                className='absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <Upload className='size-6 text-white' />
                <span className='sr-only'>Upload image</span>
              </label>
              <input
                id='playerImage'
                type='file'
                accept='image/*'
                className='sr-only'
                onChange={handleImageChange}
                disabled={isUploading}
              />
            </div>

            <div className='text-center sm:text-left'>
              <h2 className='text-2xl font-bold'>New Player Registration</h2>
              <p className='mt-1 text-muted-foreground'>
                Complete the form to add a new player to your team
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <Tabs value={activeTab} onValueChange={onTabChange} className='w-full space-y-6'>
            <TabsList className='grid w-full grid-cols-2 bg-border'>
              <TabsTrigger value='personal' className='gap-2 rounded-md'>
                <UserPlus className='size-4' />
                Player Information
              </TabsTrigger>
              <TabsTrigger value='contact' className='gap-2 rounded-md'>
                <Shield className='size-4' />
                Contact Person
              </TabsTrigger>
            </TabsList>

            <TabsContent value='personal' className='space-y-6'>
              <div className='rounded-lg border bg-card'>
                <div className='p-6'>
                  <h3 className='text-lg font-semibold'>Personal Information</h3>
                  <p className='text-sm text-muted-foreground'>Enter the player's basic details</p>
                  <Separator className='my-4' />

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <User className='size-4' />
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='John' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='lastName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <User className='size-4' />
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='Doe' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <Mail className='size-4' />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='john.doe@example.com' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='phoneNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <Phone className='size-4' />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='+1 123 456 7890' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='birthDate'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel className='flex items-center gap-1'>
                            <CalendarIcon className='size-4' />
                            Date of Birth
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className='ml-auto size-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={date =>
                                  date > new Date() || date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='nationality'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <Flag className='size-4' />
                            Nationality
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='e.g., French, American' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='preferredFoot'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <ArrowDown className='size-4' />
                            Preferred Foot
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select preferred foot' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {preferredFootOptions.map(option => (
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
                      control={form.control}
                      name='height'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <Ruler className='size-4' />
                            Height (cm)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='e.g., 180' type='number' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='weight'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <Weight className='size-4' />
                            Weight (kg)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='e.g., 75' type='number' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='position'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <Users className='size-4' />
                            Position
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select a position' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {positions.map(position => (
                                <SelectItem key={position.value} value={position.value}>
                                  {position.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='uniformNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <UserPlus className='size-4' />
                            Uniform Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='10' type='number' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='teamCaptain'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className='space-y-1 leading-none'>
                            <FormLabel className='flex items-center gap-1'>
                              <Crown className='size-4 text-amber-500' />
                              Team Captain
                            </FormLabel>
                            <FormDescription>Mark this player as the team captain</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className='rounded-lg border bg-card'>
                <div className='p-6'>
                  <h3 className='text-lg font-semibold'>Address</h3>
                  <p className='text-sm text-muted-foreground'>
                    Enter the player's address details
                  </p>
                  <Separator className='my-4' />

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='street'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <Home className='size-4' />
                            Street
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='123 Main St' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <MapPin className='size-4' />
                            City
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='New York' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='postCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <MapPin className='size-4' />
                            Post Code
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='10001' {...field} />
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
                          <FormLabel className='flex items-center gap-1'>
                            <Globe className='size-4' />
                            Country
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='United States' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className='flex justify-end'>
                <Button
                  type='button'
                  onClick={() => setActiveTab('contact')}
                  className='w-full sm:w-auto'
                >
                  Next: Contact Person
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='contact' className='space-y-6'>
              <div className='rounded-lg border bg-card'>
                <div className='p-6'>
                  <h3 className='text-lg font-semibold'>Contact Person Details</h3>
                  <p className='text-sm text-muted-foreground'>
                    Enter information for the player's emergency contact
                  </p>
                  <Separator className='my-4' />

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='contactPersonFirstName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <User className='size-4' />
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='Jane' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='contactPersonLastName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <User className='size-4' />
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='Doe' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='contactPersonPhoneNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <Phone className='size-4' />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='+1 123 456 7890' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className='rounded-lg border bg-card'>
                <div className='p-6'>
                  <h3 className='text-lg font-semibold'>Contact Person Address</h3>
                  <p className='text-sm text-muted-foreground'>
                    Enter the contact person's address details
                  </p>
                  <Separator className='my-4' />

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='contactPersonStreet'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <Home className='size-4' />
                            Street
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='456 Oak Ave' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='contactPersonCity'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <MapPin className='size-4' />
                            City
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='Los Angeles' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='contactPersonPostCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <MapPin className='size-4' />
                            Post Code
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='90001' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='contactPersonCountry'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            <Globe className='size-4' />
                            Country
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='United States' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-center justify-end gap-3 sm:flex-row'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setActiveTab('personal')}
                  className='w-full sm:w-auto'
                >
                  Back to Player Information
                </Button>
                <Button type='submit' disabled={isUploading} className='w-full sm:w-auto'>
                  {isUploading ? 'Saving...' : 'Add Player'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}

import { FC, useEffect, useMemo, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowDown,
  Calendar,
  Camera,
  Crown,
  Flag,
  Globe,
  Hash,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Trash,
  Upload,
  User,
  Users,
  Weight,
} from 'lucide-react'
import { Control, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { PlayerFormData, uploadImageToCloudinary } from '@/api'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cloudName, cloudUploadPresets } from '@/config/constants'
import { useToast } from '@/hooks/use-toast.ts'
import { usePermission } from '@/hooks/usePermission.ts'
import { usePlayer } from '@/hooks/usePlayer.ts'
import { appService, playerService } from '@/singletons'
import { getPlayerDefaultValues } from '@/views/PlayersView/EditPlayer/form/playerDefaultValues.ts'
import { PlayerPositionType } from '@/views/PlayersView/form/PlayerPosition.ts'
import {
  playerSchema,
  PlayerSchemaIn,
  PlayerSchemaOut,
} from '@/views/PlayersView/form/playerSchema.ts'

import './EditPlayer.scss'

export const EditPlayer: FC = () => {
  const { toast } = useToast()
  const { canManagePlayer } = usePermission()
  const { playerId, teamId } = useParams()
  const navigate = useNavigate()
  const { player, loading: loadingPlayer, error } = usePlayer(playerId, teamId)
  const user = appService.getUserData()

  const [photo, setPhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)

  const defaultValues = useMemo(() => {
    if (!player) return undefined
    return getPlayerDefaultValues(player)
  }, [player])

  const form = useForm<PlayerSchemaIn, never, PlayerSchemaOut>({
    resolver: zodResolver(playerSchema),
    defaultValues,
  })

  async function onSubmit(values: PlayerSchemaOut) {
    if (!player || !user) return
    setLoading(true)
    const data: PlayerFormData = {
      ...values,
      teamId: player.teamId,
      userId: user.id,
      imageSrc: photo || player.imageSrc,
      phoneNumber: values.phoneNumber!,
      teamCaptain: values.teamCaptain,
      uniformNumber: parseInt(values.uniformNumber),
      birthDate: values.birthDate.toISOString(),
      height: parseInt(values.height),
      weight: parseInt(values.weight),
    }
    await playerService.patch(player.id, data)
    try {
      setLoading(false)
      toast({
        variant: 'success',
        title: 'Player updated successfully',
      })
      navigate(`/${teamId}/players`, { replace: true })
    } catch (error) {
      console.error('Error updating player:', error)
      setLoading(false)
      toast({
        variant: 'error',
        description: 'Error updating player',
      })
    }
  }

  useEffect(() => {
    form.reset(defaultValues, { keepDirtyValues: true })
  }, [defaultValues, form])

  const positionOptions = Object.values(PlayerPositionType).map(value => ({
    label: value,
    value: value,
  }))

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        uploadImageToCloudinary({
          folder: 'playerImage',
          file: reader.result as string,
          cloud_name: cloudName,
          upload_preset: cloudUploadPresets,
        })
          .then(res => {
            setPhoto(res.url)
            toast({
              title: 'Image uploaded',
              description: 'Player image has been uploaded successfully',
            })
          })
          .catch(err => {
            console.error('Error uploading image:', err)
          })
      }
      reader.readAsDataURL(file)
      setPhoto(URL.createObjectURL(file))
    }
  }

  const handleRemovePhoto = () => {
    setPhoto(null)
  }

  if (loadingPlayer) return <LoadingPage />
  //TODO: Create Error Page
  if (error) {
    return 'This is an error page'
  }

  return (
    <div className='animate-fade-in space-y-6 p-6'>
      <div className=''>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col items-center justify-center space-y-4'>
                  <div className='relative'>
                    <Avatar className='size-40 cursor-pointer' onClick={handlePhotoClick}>
                      <AvatarImage
                        src={player?.imageSrc || '/placeholder.svg'}
                        alt='Player photo'
                      />
                      <AvatarFallback className='bg-primary/10 text-3xl'>
                        {player?.firstName?.charAt(0)}
                        {player?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='absolute bottom-0 right-0'>
                      <Button
                        type='button'
                        variant='secondary'
                        size='icon'
                        className='size-8 rounded-full shadow-md'
                        onClick={handlePhotoClick}
                      >
                        <Camera className='size-4' />
                      </Button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handlePhotoChange}
                    className='hidden'
                    disabled={!canManagePlayer}
                  />

                  <div className='flex items-center space-x-2'>
                    <Button type='button' variant='outline' size='sm' onClick={handlePhotoClick}>
                      <Upload className='mr-2 size-4' />
                      Upload photo
                    </Button>

                    {photo && (
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={handleRemovePhoto}
                      >
                        <Trash className='mr-2 size-4' />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <User className='size-4' />
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='First Name' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <User className='size-4' />
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Last Name' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Mail className='size-4' />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='Email Address'
                            {...field}
                            disabled={!canManagePlayer}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='birthDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Calendar className='size-4' />
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='date'
                            {...field}
                            value={
                              field.value ? new Date(field.value).toISOString().split('T')[0] : ''
                            }
                            disabled={!canManagePlayer}
                            onChange={e => {
                              const date = new Date(e.target.value)
                              field.onChange(date)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Phone className='size-4' />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Phone Number'
                            {...field}
                            disabled={!canManagePlayer}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='height'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Ruler className='size-4' />
                          Height
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Height' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='weight'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Weight className='size-4' />
                          Weight
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Weight' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='preferredFoot'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <ArrowDown className='size-4' />
                          Preferred Foot
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Preferred Foot'
                            {...field}
                            disabled={!canManagePlayer}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='nationality'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Flag className='size-4' />
                          Nationality
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Nationality' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='street'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <MapPin className='size-4' />
                          Street
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Street' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='postCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <MapPin className='size-4' />
                          Postcode
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Postcode' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Globe className='size-4' />
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Country' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Person */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle>Contact Person</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='contactPersonFirstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <User className='size-4' />
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='First Name' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='contactPersonLastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <User className='size-4' />
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Last Name' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='contactPersonPhoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Phone className='size-4' />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Phone Number'
                            {...field}
                            disabled={!canManagePlayer}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='contactPersonStreet'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <MapPin className='size-4' />
                          Street
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Street' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='contactPersonPostCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <MapPin className='size-4' />
                          Postcode
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Postcode' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='contactPersonCountry'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Globe className='size-4' />
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Country' {...field} disabled={!canManagePlayer} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Player Data */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle>Player Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='position'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Users className='size-4' />
                          Position
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value as PlayerPositionType}
                          disabled={!canManagePlayer}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select position' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {positionOptions.map(option => (
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
                    control={form.control as Control<PlayerSchemaOut>}
                    name='uniformNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Hash className='size-4' />
                          Jersey Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Jersey Number'
                            {...field}
                            disabled={!canManagePlayer}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<PlayerSchemaOut>}
                    name='teamCaptain'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!canManagePlayer}
                          />
                        </FormControl>
                        <div className='space-y-1 leading-none'>
                          <FormLabel className='flex items-center gap-2'>
                            <Crown className='size-4' />
                            Team Captain
                          </FormLabel>
                          <FormDescription>Mark this player as the team captain</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <div className='flex justify-end space-x-2'>
              <Button variant='outline' type='button' onClick={() => navigate('/players')}>
                Cancel
              </Button>

              <LoadingButton
                isLoading={loading}
                type='submit'
                className='t-10 mb-3 bg-dark-purple text-white'
              >
                Save
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { PlayerFormData } from '@/api'
import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import ProfileTeamImage from '@/component/ProfileTeamImage/ProfileTeamImage.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import SelectFormField from '@/components/form/SelectFormField.tsx'
import SingleCheckboxFormField from '@/components/form/SingleCheckboxFormField.tsx'
import { Form, FormLabel } from '@/components/ui/form.tsx'
import { useToast } from '@/hooks/use-toast.ts'
import { usePermission } from '@/hooks/usePermission.ts'
import { usePlayer } from '@/hooks/usePlayer.ts'
import { appService, playerService } from '@/singletons'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import './EditPlayer.scss'
import { getPlayerDefaultValues } from '@/views/PlayersView/EditPlayer/form/playerDefaultValues.ts'
import { PlayerPositionType } from '@/views/PlayersView/form/PlayerPosition.ts'
import { playerSchema, PlayerSchemaIn, PlayerSchemaOut } from '@/views/PlayersView/form/playerSchema.ts'


export const EditPlayer: FC = () => {
  const { userRole } = useSelector(settingsSelector)
  const { toast } = useToast()
  const { canManagePlayer } = usePermission(userRole)
  const { playerId, teamId } = useParams()
  const navigate = useNavigate()
  const { player, loading: loadingPlayer, error } = usePlayer(playerId, teamId)
  const user = appService.getUserData()

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
    if(!player || !user) return
    setLoading(true)
    const data: PlayerFormData = {
      ...values,
      teamId: player.teamId,
      userId: user.id,
      imageSrc: '',
      phoneNumber: values.phoneNumber!,
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

  if (loadingPlayer) return <LoadingPage />
  //TODO: Create Error Page
  if (error) {
    console.log(error)
    return 'This is an error page'
  }

  return (
    <DashboardLayout>
      <div className='mb-5 rounded-md bg-white px-2.5 py-2 md:px-12 md:py-10'>
        <div className=''>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='Single-player-view__header border-b border-border-line'>
                <ProfileTeamImage playerId={playerId} teamId={teamId}/>
              </div>
              <div className='Single-player-view__sections-bio'>
                <div className='Single-player-view__sections-bio-title'>Bio-data</div>
                <div className='mb-5 grid grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-2'>
                  <InputFormField
                    control={form.control}
                    label='First Name'
                    name='firstName'
                    placeholder='First Name'
                    type='text'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Last Name'
                    name='lastName'
                    placeholder='Last Name'
                    type='text'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Email Address'
                    name='email'
                    placeholder='Email Address'
                    type='email'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Date of Birth'
                    name='birthDate'
                    placeholder='D.O.B'
                    type='date'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Phone Number'
                    name='phoneNumber'
                    placeholder='Phone Number'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Street'
                    name='street'
                    placeholder='Street'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Postcode'
                    name='postCode'
                    placeholder='Postcode'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Country'
                    name='country'
                    placeholder='Country'
                    readOnly={!canManagePlayer}
                  />
                </div>
              </div>
              <div className='Single-player-view__sections-bio'>
                <div className='Single-player-view__sections-bio-title'>Contact Person</div>
                <div className='mb-5 grid grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-2'>
                  <InputFormField
                    control={form.control}
                    label='First Name'
                    name='contactPersonFirstName'
                    placeholder='First Name'
                    type='text'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Last Name'
                    name='contactPersonLastName'
                    placeholder='Last Name'
                    type='text'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Phone Number'
                    name='contactPersonPhoneNumber'
                    placeholder='Phone Number'
                    type='text'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Street'
                    name='contactPersonStreet'
                    placeholder='Street'
                    type='text'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Postcode'
                    name='contactPersonPostCode'
                    placeholder='Postcode'
                    type='text'
                    readOnly={!canManagePlayer}
                  />
                  <InputFormField
                    control={form.control}
                    label='Country'
                    name='contactPersonCountry'
                    placeholder='Country'
                    type='text'
                    readOnly={!canManagePlayer}
                  />
                </div>
              </div>
              <div className='Single-player-view__sections-bio'>
                <div className='Single-player-view__sections-bio-title'>Player Data</div>
                <div className='mb-5 grid grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-2'>
                  <div>
                    <FormLabel htmlFor='position'>Position</FormLabel>
                    <SelectFormField
                      control={form.control}
                      name='position'
                      options={positionOptions}
                      inputClassName='w-48 h-10 mt-2'
                    />
                  </div>
                  <InputFormField
                    control={form.control}
                    label='Jersey No.'
                    name='uniformNumber'
                    placeholder='Jersey No.'
                    type='number'
                    readOnly={!canManagePlayer}
                  />
                  <SingleCheckboxFormField
                    control={form.control}
                    name='teamCaptain'
                  >
                    Team Captain
                  </SingleCheckboxFormField>
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
        </div>
      </div>
    </DashboardLayout>
  )
}

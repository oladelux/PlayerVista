import { ChangeEvent, FC, useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { playersSelector, updatePlayerThunk } from '@/store/slices/PlayersSlice.ts'
import { PlayerFormData } from '@/api'
import { useAppDispatch } from '@/store/types.ts'

import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { InputField } from '../../component/InputField/InputField'
import { Button } from '../../component/Button/Button.tsx'
import { SelectPlayerPosition } from '../../component/SelectPlayerPosition/SelectPlayerPosition.tsx'

import './SinglePlayerView.scss'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import { usePermission } from '@/hooks/usePermission.ts'
import ProfileTeamImage from '@/component/ProfileTeamImage/ProfileTeamImage.tsx'
import { useUser } from '@/hooks/useUser.ts'

export const SinglePlayerView: FC = () => {
  const dispatch = useAppDispatch()
  const { userRole } = useSelector(settingsSelector)
  const { canManagePlayer } = usePermission(userRole)
  const { playerId, teamId } = useParams()
  const { players, loadingUpdatingPlayer } = useSelector(playersSelector)

  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false)
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)

  const isUpdatingPending = loadingUpdatingPlayer === 'pending'

  const user = useUser()
  const player = players && teamId && players.find(l => playerId === l.id)

  const { firstName, lastName, teamCaptain, imageSrc, birthDate, city, contactPersonCity,
    contactPersonCountry, contactPersonFirstName, contactPersonLastName, contactPersonPhoneNumber,
    contactPersonPostCode, contactPersonStreet, country, street, postCode, uniformNumber,
    position, email, id, phoneNumber } = player || {}

  const [updateFormData, setUpdateFormData] = useState<PlayerFormData>({
    teamId: teamId || '',
    userId: user.data?.id ||'',
    firstName: firstName || '',
    teamCaptain: teamCaptain || false,
    birthDate: new Date(birthDate || ''),
    city: city || '',
    contactPersonCity: contactPersonCity || '',
    contactPersonCountry: contactPersonCountry || '',
    contactPersonFirstName: contactPersonFirstName || '',
    contactPersonLastName: contactPersonLastName || '',
    contactPersonPhoneNumber: contactPersonPhoneNumber || '',
    contactPersonPostCode: contactPersonPostCode || '',
    contactPersonStreet: contactPersonStreet || '',
    country: country || '',
    email: email || '',
    imageSrc: imageSrc || '',
    lastName: lastName || '',
    phoneNumber: phoneNumber || '',
    position: position || '',
    postCode: postCode || '',
    street: street || '',
    uniformNumber: uniformNumber || '',
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setUpdateFormData({
      ...updateFormData,
      [name]: value,
    })
  }

  const handleCheckbox = () => {
    setUpdateFormData({
      ...updateFormData,
      teamCaptain: !updateFormData.teamCaptain,
    })
  }

  const updatePlayerData = () => {
    id && dispatch(updatePlayerThunk({
      data: {
        ...updateFormData,
        birthDate: dateValue ? dateValue.toDate() : updateFormData.birthDate,
      },
      playerId: id,
    })).finally(() => {
      setIsUpdateSuccessful(true)
    })
  }

  useEffect(() => {
    if(teamId && user.data){
      const player = players?.find(l => playerId === l.id)
      if (player) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...playerWithoutTeamAndId } = player
        setUpdateFormData({ ...playerWithoutTeamAndId, userId: user.data.id })
      }
    }
  }, [players, teamId, playerId, user.data])

  useEffect(() => {
    if(isUpdateSuccessful) {
      const timeoutId = setTimeout(() => {
        setIsUpdateSuccessful(false)
      }, 5000)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [isUpdateSuccessful])

  return (
    <DashboardLayout>
      <div className='Single-player-view'>
        <div className='Single-player-view__header border-b border-border-line'>
          <ProfileTeamImage playerId={playerId} teamId={teamId} />
        </div>
        <div className='Single-player-view__sections'>
          <div className='Single-player-view__sections-bio'>
            <div className='Single-player-view__sections-bio-title'>Bio-data</div>
            <div className='Single-player-view__sections-bio-form'>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>First Name</div>
                <InputField value={updateFormData.firstName} name='firstName' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Last Name</div>
                <InputField value={updateFormData.lastName} name='lastName' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Email</div>
                <InputField value={updateFormData.email} name='email' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>D.O.B</div>
                <DatePicker className='Single-player-view__sections-bio-form-input--label-datepicker'
                  name='birthDate'
                  value={dayjs(updateFormData.birthDate)}
                  onChange={(newValue) => setDateValue(newValue)} readOnly={!canManagePlayer}
                />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Phone Number</div>
                <InputField value={updateFormData.phoneNumber} name='phoneNumber' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Street</div>
                <InputField value={updateFormData.street} name='street' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Postcode</div>
                <InputField value={updateFormData.postCode} name='postCode' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Country</div>
                <InputField value={updateFormData.country} name='country' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
            </div>
          </div>
          <div className='Single-player-view__sections-bio'>
            <div className='Single-player-view__sections-bio-title'>Contact Person</div>
            <div className='Single-player-view__sections-bio-form'>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>First Name</div>
                <InputField value={updateFormData.contactPersonFirstName} name='contactPersonFirstName' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Last Name</div>
                <InputField value={updateFormData.contactPersonLastName} name='contactPersonLastName' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Phone Number</div>
                <InputField value={updateFormData.contactPersonPhoneNumber} name='contactPersonPhoneNumber' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Street</div>
                <InputField value={updateFormData.contactPersonStreet} name='contactPersonStreet' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Postcode</div>
                <InputField value={updateFormData.contactPersonPostCode} name='contactPersonPostCode' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Country</div>
                <InputField value={updateFormData.contactPersonCountry} name='contactPersonCountry' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
            </div>
          </div>
          <div className='Single-player-view__sections-bio'>
            <div className='Single-player-view__sections-bio-title'>Player Data</div>
            <div className='Single-player-view__sections-bio-form'>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Position</div>
                <SelectPlayerPosition
                  className='Single-player-view__sections-bio-form-input--select'
                  name='position' value={updateFormData.position}
                  onChange={handleInputChange}
                  disabled={!canManagePlayer}
                />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Jersey No.</div>
                <InputField value={updateFormData.uniformNumber} name='uniformNumber' onChange={handleInputChange} readOnly={!canManagePlayer} />
              </div>
              <div
                className='Single-player-view__sections-bio-form-input, Single-player-view__sections-bio-form-input--checkbox'>
                <input
                  id='teamCaptain'
                  className='Single-player-view__sections-bio-form-input--checkbox-input'
                  type='checkbox'
                  checked={updateFormData.teamCaptain}
                  onChange={handleCheckbox}
                  readOnly={!canManagePlayer}
                />
                <label
                  htmlFor='teamCaptain'
                  className='Single-player-view__sections-bio-form-input--checkbox-label'>Team
                  Captain
                </label>
              </div>
            </div>
          </div>
        </div>
        {canManagePlayer &&
          <Button onClick={updatePlayerData} disabled={isUpdatingPending}>Update</Button>}
        {isUpdateSuccessful && <div className='Single-player-view__status'>Player successfully updated !!!</div>}
      </div>
    </DashboardLayout>
  )
}

import { ChangeEvent, FC, useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { teamSelector } from '../../store/slices/TeamSlice'
import { playersSelector, updatePlayerThunk } from '../../store/slices/PlayersSlice'
import { PlayerFormData } from '../../api'
import { useAppDispatch } from '../../store/types.ts'

import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { InputField } from '../../component/InputField/InputField'
import { Button } from '../../component/Button/Button.tsx'
import { SelectPlayerPosition } from '../../component/SelectPlayerPosition/SelectPlayerPosition.tsx'

import './SinglePlayerView.scss'

export const SinglePlayerView: FC = () => {
  const dispatch = useAppDispatch()
  const { playerId, teamId } = useParams()
  const { teams } = useSelector(teamSelector)
  const { players, loadingUpdatingPlayer } = useSelector(playersSelector)

  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false)
  const [dateValue, setDateValue] = useState<Dayjs | null>(null)

  const isUpdatingPending = loadingUpdatingPlayer === 'pending'

  const team = teams.find(team => teamId === team.id)
  const player = players && teamId && players[teamId]?.find(l => playerId === l.id)
  const { firstName, lastName, teamCaptain, imageSrc, birthDate, city, contactPersonCity,
    contactPersonCountry, contactPersonFirstName, contactPersonLastName, contactPersonPhoneNumber,
    contactPersonPostCode, contactPersonStreet, country, street, postCode, uniformNumber,
    position, email, id, phoneNumber} = player || {}

  const [isChecked, setIsChecked] = useState(teamCaptain)

  const [updateFormData, setUpdateFormData] = useState<PlayerFormData>({
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
    uniformNumber: uniformNumber || ''
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setUpdateFormData({
      ...updateFormData,
      [name]: value,
    })
  }

  const handleCheckbox = () => {
    setIsChecked(!isChecked)
  }

  const updatePlayerData = () => {
    id && isChecked && dispatch(updatePlayerThunk({
      data: {
        ...updateFormData,
        teamCaptain: isChecked,
        birthDate: dateValue ? dateValue.toDate() : updateFormData.birthDate
      },
      playerId: id
    })).finally(() => {
      setIsUpdateSuccessful(true)
    })
  }

  useEffect(() => {
    if(teamId){
      const player = players?.[teamId]?.find(l => playerId === l.id)
      if (player) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { team, id, ...playerWithoutTeamAndId } = player
        setUpdateFormData(playerWithoutTeamAndId)
        setIsChecked(playerWithoutTeamAndId.teamCaptain)
      }
    }
  }, [players, teamId, playerId])

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
        <div className='Single-player-view__header'>
          <div className='Single-player-view__header-media'>
            <img
              alt='player-image'
              src={imageSrc}
              width={100}
              className='Single-player-view__header-media-img'
            />
          </div>
          <div className='Single-player-view__header-info'>
            <div className='Single-player-view__header-info--firstname'>{firstName}</div>
            <div className='Single-player-view__header-info--lastname'>{lastName}</div>
            <div className='Single-player-view__header-info--team'>
              <img
                alt='team-image'
                src={team && team.logo}
                width={23}
                className='Single-player-view__header-info--team-img'
              />
              <div className='Single-player-view__header-info--team-text'>{team && team.teamName}</div>
            </div>
          </div>
        </div>
        <div className='Single-player-view__sections'>
          <div className='Single-player-view__sections-bio'>
            <div className='Single-player-view__sections-bio-title'>Bio-data</div>
            <div className='Single-player-view__sections-bio-form'>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>First Name</div>
                <InputField value={updateFormData.firstName} name='firstName' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Last Name</div>
                <InputField value={updateFormData.lastName} name='lastName' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Email</div>
                <InputField value={updateFormData.email} name='email' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>D.O.B</div>
                <DatePicker className='Single-player-view__sections-bio-form-input--label-datepicker'
                  name='birthDate'
                  value={dayjs(updateFormData.birthDate)} onChange={(newValue) => setDateValue(newValue)}
                />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Phone Number</div>
                <InputField value={updateFormData.phoneNumber} name='phoneNumber' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Street</div>
                <InputField value={updateFormData.street} name='street' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Postcode</div>
                <InputField value={updateFormData.postCode} name='postCode' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Country</div>
                <InputField value={updateFormData.country} name='country' onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <div className='Single-player-view__sections-bio'>
            <div className='Single-player-view__sections-bio-title'>Contact Person</div>
            <div className='Single-player-view__sections-bio-form'>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>First Name</div>
                <InputField value={updateFormData.contactPersonFirstName} name='contactPersonFirstName' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Last Name</div>
                <InputField value={updateFormData.contactPersonLastName} name='contactPersonLastName' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Phone Number</div>
                <InputField value={updateFormData.contactPersonPhoneNumber} name='contactPersonPhoneNumber' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Street</div>
                <InputField value={updateFormData.contactPersonStreet} name='contactPersonStreet' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Postcode</div>
                <InputField value={updateFormData.contactPersonPostCode} name='contactPersonPostCode' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Country</div>
                <InputField value={updateFormData.contactPersonCountry} name='contactPersonCountry' onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <div className='Single-player-view__sections-bio'>
            <div className='Single-player-view__sections-bio-title'>Player Data</div>
            <div className='Single-player-view__sections-bio-form'>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Joining Date</div>
                <InputField value={updateFormData.position} name='creationDate' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Position</div>
                <SelectPlayerPosition
                  className='Single-player-view__sections-bio-form-input--select'
                  name='position' value={updateFormData.position}
                  onChange={handleInputChange}
                />
              </div>
              <div className='Single-player-view__sections-bio-form-input'>
                <div className='Single-player-view__sections-bio-form-input--label'>Jersey No.</div>
                <InputField value={updateFormData.uniformNumber} name='uniformNumber' onChange={handleInputChange} />
              </div>
              <div className='Single-player-view__sections-bio-form-input, Single-player-view__sections-bio-form-input--checkbox'>
                <div className='Single-player-view__sections-bio-form-input--label, Single-player-view__sections-bio-form-input--label--checkbox'>Team Captain</div>
                <input
                  type='checkbox'
                  checked={isChecked}
                  onChange={handleCheckbox}
                />
              </div>
            </div>
          </div>
        </div>
        <Button onClick={updatePlayerData} disabled={isUpdatingPending}>Update</Button>
        {isUpdateSuccessful && <div className='Single-player-view__status'>Player successfully updated !!!</div>}
      </div>
    </DashboardLayout>
  )
}

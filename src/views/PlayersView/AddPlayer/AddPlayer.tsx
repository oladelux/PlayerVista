import React, { ChangeEvent, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined'
import { Field } from 'formik'

import { useAppDispatch } from '../../../store/types'
import { FormikStep, FormikStepper } from '../../TeamView/CreateTeam/Step'
import { PlayerFormData } from '../../../api'
import { createNewPlayerThunk, getPlayersThunk } from '../../../store/slices/PlayersSlice'
import { convertToDate } from '../../../services/helper'

import { DashboardLayout } from '../../../component/DashboardLayout/DashboardLayout'
import { PlayerConfirmationPopup } from '../PlayerConfirmation/PlayerConfirmation'


import './AddPlayer.scss'

export const AddPlayer = () => {

  return (
    <DashboardLayout>
      <div className='Add-player'>
        <div className='Add-player__header'>
          <div className='Add-player__header-title'>Hello Admin,</div>
          <div className='Add-player__header-sub-title'>Let’s add a new player</div>
        </div>
        <AddPlayerMultiStep />
      </div>
    </DashboardLayout>
  )
}

const AddPlayerMultiStep = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { teamId } = useParams()
  const [playerImage, setPlayerImage] = useState<string>('')
  const [isActiveConfirmationPopup, setIsActiveConfirmationPopup] = useState(false)

  const openConfirmationPopup = () => setIsActiveConfirmationPopup(true)
  const closeConfirmationPopup = async () => {
    await setIsActiveConfirmationPopup(false)
    teamId && await dispatch(getPlayersThunk({ teamId }))
    navigate(`/team/${teamId}/players`)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files
    imgFile && setPlayerImage(URL.createObjectURL(imgFile[0]))
  }

  return (
    <div className='Multi-step'>
      <FormikStepper
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          uniformNumber: '',
          street: '',
          city: '',
          postCode: '',
          country: '',
          birthDate: '',
          position: '',
          contactPersonFirstName: '',
          contactPersonLastName: '',
          contactPersonPhoneNumber: '',
          contactPersonStreet: '',
          contactPersonCity: '',
          contactPersonPostCode: '',
          contactPersonCountry: '',
        }}
        onSubmit={async (values, { resetForm }) => {
          const data: PlayerFormData = {
            ...(values as PlayerFormData),
            birthDate: convertToDate(values.birthDate),
            imageSrc: playerImage,
          }
          teamId && dispatch(createNewPlayerThunk({ data, teamId }))
            .finally(() => {
              resetForm()
              openConfirmationPopup()
            })
        }}
      >
        <FormikStep label='Player Info'>
          <div className='Multi-step__title'>Please provide the following details</div>
          <div className='Multi-step__layout'>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>First Name</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='firstName'
                placeholder='Enter first name'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Last name</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='lastName'
                placeholder='Enter last name'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Email</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='email'
                placeholder='Enter email address'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Phone Number</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='phoneNumber'
                placeholder='Phone number'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Date of Birth</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='birthDate'
                placeholder='Select Date'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Address</div>
              <div className='Multi-step__layout-form-group--3'>
                <Field
                  className='Multi-step__layout-form-group--3__field'
                  type='text'
                  name='street'
                  placeholder='Street'
                />
                <Field
                  className='Multi-step__layout-form-group--3__field'
                  type='text'
                  name='postCode'
                  placeholder='Postcode'
                />
                <Field
                  className='Multi-step__layout-form-group--3__field'
                  type='text'
                  name='city'
                  placeholder='City'
                />
                <Field
                  className='Multi-step__layout-form-group--3__field'
                  type='text'
                  name='country'
                  placeholder='Country'
                />
              </div>
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Uniform Number</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='number'
                name='uniformNumber'
                placeholder='Enter uniform number'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Position</div>
              <Field
                className='Multi-step__layout-form-group--field'
                as='select'
                name='position'
              >
                <option>Select Position</option>
                <option value='GK'>GK</option>
                <option value='CB'>CB</option>
                <option value='RB'>RB</option>
                <option value='LB'>LB</option>
                <option value='WRB'>WRB</option>
                <option value='WLB'>WLB</option>
                <option value='CDM'>CDM</option>
                <option value='CM'>CM</option>
                <option value='RM'>RM</option>
                <option value='LM'>LM</option>
                <option value='CAM'>CAM</option>
                <option value='ST'>ST</option>
                <option value='CF'>CF</option>
              </Field>
            </div>
          </div>
          <div className='Multi-step__team'>
            <div className='Multi-step__team-title'>Player Image</div>
            <div className='Multi-step__team-image'>
              <input
                id='fileInput'
                name='playerImage'
                className='Multi-step__team-image--input'
                type='file'
                accept='image/*'
                onChange={handleImageChange}
              />
              <label htmlFor='fileInput' className='Multi-step__team-image--label'>
                <BackupOutlinedIcon className='Multi-step__team-image--label-icon' />
                <div className='Multi-step__team-image--label-text'>
                  <span className='Multi-step__team-image--label-text-bold'>Click to upload</span>, or drag and drop SVG, PNG, JPG or GIF (max 800x400px)
                </div>
                <div className='Multi-step__team-image--label-image'>{playerImage}</div>
              </label>
            </div>
          </div>
        </FormikStep>
        <FormikStep label='Contact Person Info'>
          <div className='Multi-step__title'>Please provide the following details</div>
          <div className='Multi-step__layout'>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Contact Person First Name</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='contactPersonFirstName'
                placeholder='Enter contact person first name'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Contact Person Last Name</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='contactPersonLastName'
                placeholder='Enter contact person last name'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Contact Person Phone Number</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='contactPersonPhoneNumber'
                placeholder='Contact person phone number'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Contact Person Address</div>
              <div className='Multi-step__layout-form-group--3'>
                <Field
                  className='Multi-step__layout-form-group--3__field'
                  type='text'
                  name='contactPersonStreet'
                  placeholder='Contact Person Street'
                />
                <Field
                  className='Multi-step__layout-form-group--3__field'
                  type='text'
                  name='contactPersonPostCode'
                  placeholder='Contact Person PostCode'
                />
                <Field
                  className='Multi-step__layout-form-group--3__field'
                  type='text'
                  name='contactPersonCity'
                  placeholder='Contact Person City'
                />
                <Field
                  className='Multi-step__layout-form-group--3__field'
                  type='text'
                  name='contactPersonCountry'
                  placeholder='Contact Person Country'
                />
              </div>
            </div>
          </div>
        </FormikStep>
      </FormikStepper>
      {isActiveConfirmationPopup && <PlayerConfirmationPopup onClose={closeConfirmationPopup}/>}
    </div>
  )
}

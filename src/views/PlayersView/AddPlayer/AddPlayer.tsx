import { ChangeEvent, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Field } from 'formik'
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak'

import { useAppDispatch } from '../../../store/types'
import { FormikStep, FormikStepper } from '../../TeamView/CreateTeam/Step'
import { PlayerFormData, uploadImageToCloudinary } from '../../../api'
import { createNewPlayerThunk, getPlayersThunk } from '../../../store/slices/PlayersSlice'
import { cloudName, cloudUploadPresets } from '../../../config/constants'

import { DashboardLayout } from '../../../component/DashboardLayout/DashboardLayout'
import { PlayerConfirmationPopup } from '../PlayerConfirmation/PlayerConfirmation'
import { SelectPlayerPositionWithFormik } from '../../../component/SelectPlayerPosition/SelectPlayerPosition.tsx'
import { CustomFormikDatePicker } from '../../../component/FormikWrapper/CustomFormikDatePicker.tsx'

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
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isActiveConfirmationPopup, setIsActiveConfirmationPopup] = useState(false)

  const openConfirmationPopup = () => setIsActiveConfirmationPopup(true)
  const closeConfirmationPopup = async () => {
    setIsActiveConfirmationPopup(false)
    teamId && await dispatch(getPlayersThunk({ teamId }))
    navigate(`/team/${teamId}/players`)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files

    if (imgFile && imgFile[0]) {
      setSelectedImage(URL.createObjectURL(imgFile[0]))
      setIsUploading(true)

      const reader = new FileReader()
      reader.onloadend = () => {
        uploadImageToCloudinary({
          folder: 'playerImage',
          file: reader.result as string,
          cloud_name: cloudName,
          upload_preset: cloudUploadPresets
        }).then(res => {
          setIsUploading(false)
          setImageUrl(res.url)
        }).catch(err => {
          console.error('Error uploading image:', err)
          setIsUploading(false)
        })
      }
      reader.readAsDataURL(imgFile[0])
    }
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
            birthDate: new Date(values.birthDate),
            imageSrc: imageUrl,
          }
          teamId &&
            await dispatch(createNewPlayerThunk({data, teamId}))
              .unwrap()
              .then(() => {
                openConfirmationPopup()
                resetForm()
              })
        }}
      >
        <FormikStep label='Player Info'>
          <div className='Multi-step__title'>Please provide the following details</div>
          <div className='Multi-step__team'>
            <div className='Multi-step__team-image'>
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
                Upload player image
              </div>
            </div>
          </div>
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
                component={CustomFormikDatePicker}
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
              <SelectPlayerPositionWithFormik className='Multi-step__layout-form-group--field' name='position' />
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

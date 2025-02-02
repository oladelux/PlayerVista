import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak'
import { Field } from 'formik'
import { ChangeEvent, FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { FormikStep, FormikStepper } from '../../TeamView/CreateTeam/Step'
import { AuthenticatedUserData, PlayerFormData, uploadImageToCloudinary } from '@/api'
import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { CustomFormikDatePicker } from '@/component/FormikWrapper/CustomFormikDatePicker.tsx'
import { SelectPlayerPositionWithFormik } from '@/component/SelectPlayerPosition/SelectPlayerPosition.tsx'
import { cloudName, cloudUploadPresets } from '@/config/constants.ts'
import { useToast } from '@/hooks/use-toast.ts'
import { useUpdates, UseUpdates } from '@/hooks/useUpdates.ts'
import { getTodayDate } from '@/services/helper.ts'
import './AddPlayer.scss'
import { appService, playerService } from '@/singletons'

export function AddPlayer() {
  const logger = useUpdates()
  const user = appService.getUserData()
  if (!user) return null

  return (
    <DashboardLayout>
      <div className='Add-player'>
        <div className='Add-player__header'>
          <div className='Add-player__header-title'>Hello Admin,</div>
          <div className='Add-player__header-sub-title'>Let’s add a new player</div>
        </div>
        <AddPlayerMultiStep logger={logger} user={user} />
      </div>
    </DashboardLayout>
  )
}

type AddPlayerMultiStepProps = {
  logger: UseUpdates
  user: AuthenticatedUserData
}

const AddPlayerMultiStep:FC<AddPlayerMultiStepProps> = ({ logger, user }) => {
  const navigate = useNavigate()
  const { teamId } = useParams()
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

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
          upload_preset: cloudUploadPresets,
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
          birthDate: getTodayDate(),
          position: '',
          contactPersonFirstName: '',
          contactPersonLastName: '',
          contactPersonPhoneNumber: '',
          contactPersonStreet: '',
          contactPersonCity: '',
          contactPersonPostCode: '',
          contactPersonCountry: '',
        }}
        onSubmit={async (values) => {
          if(!teamId) return
          const data: PlayerFormData = {
            ...(values as PlayerFormData),
            teamId: teamId,
            userId: user.id,
            birthDate: values.birthDate,
            imageSrc: imageUrl,
          }
          teamId &&
            await playerService.insert(data, teamId)
              .then(() => {
                toast({
                  variant: 'success',
                  description: 'Player added successfully',
                })
                logger.setUpdate({ message: 'added a new player', userId: user.id, groupId: user.groupId })
                logger.sendUpdates(user.groupId)
                navigate(`/${teamId}/players`, { replace: true })
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
    </div>
  )
}

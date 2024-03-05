import React, { ChangeEvent, FC, useState } from 'react'
import { Field } from 'formik'
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined'

import { useAppDispatch } from '../../../../store/types'
import { createTeamThunk } from '../../../../store/slices/TeamSlice'
import { TeamFormData } from '../../../../api'

import { DashboardHeader } from '../../../../component/DashboardLayout/DashboardLayout'

import './AddStaff.scss'
import {FormikStep, FormikStepper} from "../../../TeamView/CreateTeam/Step";

export const AddStaff: FC = () => {
  return (
    <>
      <DashboardHeader />
      <div className='Add-staff'>
        <div className='Add-staff__content'>
          <div className='Add-staff__content-header'>
            <div className='Add-staff__content-header-title'>Hello Admin,</div>
            <div className='Add-staff__content-header-sub-title'>Let’s create a team for you in three easy steps</div>
          </div>
          <CreateTeamMultiStep />
        </div>
      </div>
    </>
  )
}

const CreateTeamMultiStep = () => {
  const [file, setFile] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const dispatch = useAppDispatch()

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files
    imgFile && setFileName(imgFile[0].name)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFile(reader.result as string)
    }
    if (imgFile && imgFile[0]) {
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
          role: '',
          phoneNumber: '',
          staffImage: '',
        }}
        onSubmit={async (values) => {
          const data: TeamFormData = {
            ...(values as TeamFormData),
            logo: file,
          }
          dispatch(createTeamThunk({ data }))
        }}
      >
        <div>
          <div className='Multi-step__title'>Please provide the following details</div>
          <div className='Multi-step__layout'>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>First Name</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='firstName'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Last Name</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='lastName'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Email</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='email'
                name='email'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Role</div>
              <Field
                className='Multi-step__layout-form-group--field'
                as='select'
                name='role'
              >
                <option>Select Staff Role</option>
                <option value='Male'>Admin</option>
                <option value='Female'>Role 2</option>
              </Field>
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Phone Number</div>
              <Field
                className='Multi-step__layout-form-group--field'
                type='text'
                name='phoneNumber'
              />
            </div>
            <div className='Multi-step__layout-form-group'>
              <div className='Multi-step__layout-form-group--label'>Staff Image</div>
              <div className='Multi-step__team-image'>
                <input
                  id='fileInput'
                  name='staffImage'
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
                  <div className='Multi-step__team-image--label-image'>{fileName}</div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </FormikStepper>
    </div>
  )
}

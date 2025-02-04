import { Field } from 'formik'
import generator from 'generate-password-ts'
import React, { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { FormikStep, FormikStepper } from '../../../TeamView/CreateTeam/Step'
import { AuthenticatedUserData, StaffData } from '@/api'
import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { SuccessConfirmationPopup } from '@/component/SuccessConfirmation/SuccessConfirmation.tsx'
import { useUpdates, UseUpdates } from '@/hooks/useUpdates.ts'
import { createStaffThunk, staffSelector } from '@/store/slices/StaffSlice.ts'
import { useAppDispatch } from '@/store/types.ts'

import './AddStaff.scss'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'

import { capitalize } from '@mui/material'

import { appService } from '@/singletons'

const password = generator.generate({
  length: 10,
  numbers: true,
  lowercase: true,
  uppercase: true,
  strict: true,
})

type AddStaffProps = {
  logger: UseUpdates
  user: AuthenticatedUserData
}

export function AddStaff() {
  const logger = useUpdates()
  const user = appService.getUserData()
  if (!user) return null

  return (
    <DashboardLayout>
      <div className='Add-staff'>
        <div className='Add-staff__header'>
          <div className='Add-staff__header-title'>Hello Admin,</div>
          <div className='Add-staff__header-sub-title'>Let’s add a new staff</div>
        </div>
        <AddStaffMultiStep user={user} logger={logger} />
      </div>
    </DashboardLayout>
  )
}

const AddStaffMultiStep: FC<AddStaffProps> = ({ user, logger }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { teamId } = useParams()
  const { loadingCreatingStaff } = useSelector(staffSelector)
  const { roles } = useSelector(settingsSelector)
  const [isActiveConfirmationPopup, setIsActiveConfirmationPopup] = useState(false)

  const isPending = loadingCreatingStaff === 'pending'

  const openConfirmationPopup = () => setIsActiveConfirmationPopup(true)
  const closeConfirmationPopup = async () => {
    setIsActiveConfirmationPopup(false)
    navigate(`/team/${teamId}/staffs`)
  }

  return (
    <div className='Add-staff__Multi-step Multi-step'>
      <FormikStepper
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          role: '',
        }}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          if (teamId) {
            const data: StaffData = {
              ...(values as StaffData),
              teamId,
              groupId: user.groupId,
              password: password,
              parentUserId: user.id,
            }
            dispatch(createStaffThunk({ data }))
              .unwrap()
              .then(() => {
                setSubmitting(isPending)
                logger.setUpdate({ message: 'added a new staff', userId: user.id, groupId: user.groupId })
                logger.sendUpdates(user.groupId)
                openConfirmationPopup()
                resetForm()
              })
          } }
        }
      >
        <FormikStep label='Staff Info'>
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
                {roles.slice()
                  .sort((a, b) => a.name.localeCompare(b.name)).map((role) => (
                    <option key={role.id} value={role.name}>{capitalize(role.name)}</option>))}
              </Field>
            </div>
          </div>
        </FormikStep>
      </FormikStepper>
      {isActiveConfirmationPopup && <SuccessConfirmationPopup
        onClose={closeConfirmationPopup} title='Staff added successfully' />}
    </div>
  )
}

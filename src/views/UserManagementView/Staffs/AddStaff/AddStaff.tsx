import React, { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Field } from 'formik'
import generator from 'generate-password-ts'

import { useAppDispatch } from '../../../../store/types'
import { AuthenticatedUserData, StaffData } from '../../../../api'
import { createStaffThunk, staffSelector } from '../../../../store/slices/StaffSlice.ts'
import { UseUpdates } from '../../../../hooks/useUpdates.ts'

import { DashboardLayout } from '../../../../component/DashboardLayout/DashboardLayout'
import { Spinner } from '../../../../component/Spinner/Spinner.tsx'
import { FormikStep, FormikStepper } from '../../../TeamView/CreateTeam/Step'
import { SuccessConfirmationPopup } from '../../../../component/SuccessConfirmation/SuccessConfirmation.tsx'

import './AddStaff.scss'

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

export const AddStaff: FC<AddStaffProps> = ({ logger, user }) => {
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
              groupId: user.groupId,
              password: password,
              teams: [teamId],
            }
            console.log('data', data)
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
                <option value='admin'>Admin</option>
                <option value='coach'>Coach</option>
                <option value='scout'>Scout</option>
                <option value='coach'>Others</option>
              </Field>
            </div>
          </div>
        </FormikStep>
      </FormikStepper>
      {isPending && <div className='Add-staff__Multi-step--spinner'><Spinner/></div>}
      {isActiveConfirmationPopup && <SuccessConfirmationPopup
        onClose={closeConfirmationPopup} title='Staff added successfully' />}
    </div>
  )
}

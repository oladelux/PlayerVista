import { Field } from 'formik'
import generator from 'generate-password-ts'
import React, { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { AuthenticatedUserData, ReporterData } from '../../../api'
import { DashboardLayout } from '../../../component/DashboardLayout/DashboardLayout'
import { Spinner } from '../../../component/Spinner/Spinner.tsx'
import { SuccessConfirmationPopup } from '../../../component/SuccessConfirmation/SuccessConfirmation.tsx'
import { UseUpdates } from '../../../hooks/useUpdates.ts'
import { createReporterThunk, reporterSelector } from '../../../store/slices/ReporterSlice.ts'
import { useAppDispatch } from '../../../store/types'
import { FormikStep, FormikStepper } from '../../TeamView/CreateTeam/Step'

import './AddReporter.scss'

const password = generator.generate({
  length: 10,
  numbers: true,
  lowercase: true,
  uppercase: true,
  strict: true,
})

type AddReporterProps = {
  logger: UseUpdates
  user: AuthenticatedUserData
}

export const AddReporter: FC<AddReporterProps> = ({ logger, user }) => {
  return (
    <DashboardLayout>
      <div className='Add-reporter'>
        <div className='Add-reporter__header'>
          <div className='Add-reporter__header-title'>Hello Admin,</div>
          <div className='Add-reporter__header-sub-title'>Let’s add a new reporter</div>
        </div>
        <AddReporterMultiStep user={user} logger={logger} />
      </div>
    </DashboardLayout>
  )
}

const AddReporterMultiStep: FC<AddReporterProps> = ({ user, logger }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { teamId } = useParams()
  const { loadingCreatingReporter } = useSelector(reporterSelector)
  const [isActiveConfirmationPopup, setIsActiveConfirmationPopup] = useState(false)

  const isPending = loadingCreatingReporter === 'pending'

  const openConfirmationPopup = () => setIsActiveConfirmationPopup(true)
  const closeConfirmationPopup = async () => {
    setIsActiveConfirmationPopup(false)
    navigate(`/team/${teamId}/reporters`)
  }

  return (
    <div className='Add-reporter__Multi-step Multi-step'>
      <FormikStepper
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          role: 'reporter',
        }}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          if (teamId) {
            const data: ReporterData = {
              ...(values as ReporterData),
              groupId: user.groupId,
              password: password,
              teams: [teamId],
            }
            dispatch(createReporterThunk({ data }))
              .unwrap()
              .then(() => {
                setSubmitting(isPending)
                logger.setUpdate({ message: 'added a new reporter', userId: user.id, groupId: user.groupId })
                logger.sendUpdates(user.groupId)
                openConfirmationPopup()
                resetForm()
              })
          } }
        }
      >
        <FormikStep label='Reporter Info'>
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
          </div>
        </FormikStep>
      </FormikStepper>
      {isPending && <div className='Add-reporter__Multi-step--spinner'><Spinner/></div>}
      {isActiveConfirmationPopup && <SuccessConfirmationPopup
        onClose={closeConfirmationPopup} title='Reporter added successfully' />}
    </div>
  )
}

import { FC } from 'react'
import ReactDOM from 'react-dom'
import { Field } from 'formik'
import { useParams } from 'react-router-dom'

import { combinedDate } from '../../services/helper.ts'
import { useAppDispatch } from '../../store/types.ts'
import { createEventThunk } from '../../store/slices/EventsSlice.ts'
import { UseUpdates } from '../../hooks/useUpdates.ts'
import { AuthenticatedUserData } from '../../api'

import { Popup } from '../Popup/Popup.tsx'
import { FormikStep, FormikStepper } from '../../views/TeamView/CreateTeam/Step.tsx'
import { DynamicEventForm } from '../DynamicEventForm/DynamicEventForm.tsx'

import './EventFormModal.scss'


type EventFormModalProps = {
  /**
   * Function which is called on click overlay.
   */
  onClose: () => void
  startDate: Date
  logger: UseUpdates
  user: AuthenticatedUserData
}

const EventFormModal: FC<EventFormModalProps> = ({ onClose, startDate, logger, user }) => {
  const dispatch = useAppDispatch()
  const { teamId } = useParams()
  return (
    <Popup onClose={onClose} className='Event-form'>
      <div className='Event-form__wrapper'>
        <div className='Event-form__wrapper-multi-step'>
          <FormikStepper
            initialValues={{
              type: undefined,
              date: startDate,
              startTime: startDate,
              endTime: startDate,
              startDate: '',
              location: '',
              info: '',
              eventLocation: '',
              opponent: '',
            }}
            onSubmit={async (values, { resetForm }) => {
              const data = {
                type: values.type,
                startDate: combinedDate(new Date(values.date),
                  new Date(values.startTime).toLocaleTimeString()),
                endDate: combinedDate(new Date(values.date),
                  new Date(values.endTime).toLocaleTimeString()),
                location: values.location,
                eventLocation: values.eventLocation,
                opponent: values.opponent,
                info: values.info,
              }
              teamId &&
                await dispatch(createEventThunk({ data, teamId }))
                  .unwrap()
                  .then(() => {
                    logger.setUpdate({ message: 'added a new event', userId: user.id, groupId: user.groupId })
                    logger.sendUpdates(user.groupId)
                    resetForm()
                    onClose()
                  })
            }}
          >
            <FormikStep label='Event type'>
              <div className='Event-form__wrapper-multi-step__title'>Let's plan your event</div>
              <div className='Event-form__wrapper-multi-step__layout'>
                <div className='Event-form__wrapper-multi-step__layout-form'>
                  <div className='Event-form__wrapper-multi-step__layout-form-label'>Event type</div>
                  <Field
                    className='Event-form__wrapper-multi-step__layout-form-input'
                    as='select'
                    name='type'
                  >
                    <option>Select event type</option>
                    <option value='training'>Training</option>
                    <option value='match'>Match</option>
                  </Field>
                </div>
              </div>
            </FormikStep>
            <FormikStep label='Event Information'>
              <DynamicEventForm />
            </FormikStep>
          </FormikStepper>
        </div>
      </div>
    </Popup>
  )
}

export const EventFormModalPortal: FC<EventFormModalProps> = props => {
  const container = document.body

  return ReactDOM.createPortal(
    <EventFormModal
      onClose={props.onClose}
      startDate={props.startDate}
      logger={props.logger}
      user={props.user} />, container)
}

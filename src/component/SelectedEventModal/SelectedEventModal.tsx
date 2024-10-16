import { FC, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Field } from 'formik'
import { useSelector } from 'react-redux'

import {
  eventsSelector,
  getSingleEventThunk,
  updateEventThunk,
} from '@/store/slices/EventsSlice.ts'
import { useAppDispatch } from '@/store/types.ts'
import { SingleEventType } from '@/api'
import { combinedDate } from '@/services/helper.ts'

import { FormikStep, FormikStepper } from '../../views/TeamView/CreateTeam/Step.tsx'
import { CustomFormikDatePicker } from '../FormikWrapper/CustomFormikDatePicker.tsx'
import { CustomFormikTimePicker } from '../FormikWrapper/CustomFormikTimePicker.tsx'
import { Popup } from '../Popup/Popup.tsx'

import './SelectedEventModal.scss'

type SelectedEventModal = {
  /**
   * Function which is called on click overlay.
   */
  onClose: () => void
  id: string
}

type SelectedEventProps = {
  /**
   * Function which is called on click overlay.
   */
  onClose: () => void
  eventId: string
  selectedEvent: SingleEventType | undefined
}

const SelectedEvent: FC<SelectedEventProps> = props => {
  const dispatch = useAppDispatch()

  if (props.selectedEvent) {
    const isEventMatch = props.selectedEvent.location.length

    return (
      <Popup onClose={props.onClose} className='Selected-event'>
        <div className='Selected-event__wrapper'>
          <div className='Selected-event__wrapper-multi-step'>
            <FormikStepper
              initialValues={{
                type: props.selectedEvent.type,
                startDate: props.selectedEvent.startDate,
                endDate: props.selectedEvent.endDate,
                location: props.selectedEvent.location,
                eventLocation: props.selectedEvent.eventLocation,
                opponent: props.selectedEvent.opponent,
                info: props.selectedEvent.info,
              }}
              onSubmit={async (values, { resetForm }) => {
                if(!props.selectedEvent) return
                const data = {
                  type: values.type,
                  startDate: combinedDate(new Date(values.startDate),
                    new Date(values.startDate).toLocaleTimeString()),
                  endDate: combinedDate(new Date(values.startDate),
                    new Date(values.endDate).toLocaleTimeString()),
                  location: values.location,
                  eventLocation: values.eventLocation,
                  opponent: values.opponent,
                  info: values.info,
                  userId: props.selectedEvent.userId,
                  teamId: props.selectedEvent.teamId,
                }
                await dispatch(updateEventThunk({ data, eventId: props.eventId }))
                  .unwrap()
                  .then(() => {
                    resetForm()
                    props.onClose()
                  })
              }}
            >
              <FormikStep label='Event type' title='update'>
                <div className='Event-form__wrapper-multi-step__title'>Update your event</div>
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
                <div className='Training-form__layout'>
                  {isEventMatch > 0 &&
                    <div className='Match-form__radio-group' role='group' aria-labelledby='my-radio-group'>
                      <label className='Match-form__radio-group-label'>
                        <Field className='Match-form__radio-group-label--field' type='radio' name='location'
                          value='Home'/>
                        Home
                      </label>
                      <label className='Match-form__radio-group-label'>
                        <Field className='Match-form__radio-group-label--field' type='radio' name='location'
                          value='Away'/>
                        Away
                      </label>
                    </div>
                  }
                  <div className='Training-form__layout--form-group'>
                    <div className='Training-form__layout--form-group-label'>Date</div>
                    <Field
                      className='Training-form__layout--form-group-field'
                      type='text'
                      name='startDate'
                      component={CustomFormikDatePicker}
                    />
                  </div>
                  <div className='Training-form__layout--form-group'>
                    <div className='Training-form__layout--form-group-label'>Event Location</div>
                    <Field
                      className='Training-form__layout--form-group-field'
                      type='text'
                      name='eventLocation'
                    />
                  </div>
                  <div className='Training-form__layout--form-group'>
                    <div className='Training-form__layout--form-group-label'>Start Time</div>
                    <Field
                      className='Training-form__layout--form-group-field'
                      type='text'
                      name='startDate'
                      component={CustomFormikTimePicker}
                    />
                  </div>
                  <div className='Training-form__layout--form-group'>
                    <div className='Training-form__layout--form-group-label'>End Time</div>
                    <Field
                      className='Training-form__layout--form-group-field'
                      type='text'
                      name='endDate'
                      component={CustomFormikTimePicker}
                    />
                  </div>
                  {isEventMatch > 0 &&
                    <div className='Match-form__layout--form-group'>
                      <div className='Match-form__layout--form-group-label'>Opponent Name</div>
                      <Field
                        className='Match-form__layout--form-group-field'
                        type='text'
                        name='opponent'
                      />
                    </div>
                  }
                  <div className='Training-form__layout--form-group'>
                    <div className='Training-form__layout--form-group-label'>Additional Information</div>
                    <Field
                      className='Training-form__layout--form-group-field'
                      as='textarea'
                      name='info'
                    />
                  </div>
                </div>
              </FormikStep>
            </FormikStepper>
          </div>
        </div>
      </Popup>
    )
  }
}

export const SelectedEventModal: FC<SelectedEventModal> = ({ onClose, id }) => {
  const dispatch = useAppDispatch()
  const { selectedEvent } = useSelector(eventsSelector)
  const container = document.body

  useEffect(() => {
    dispatch(getSingleEventThunk({ eventId: id }))
  }, [])

  return ReactDOM.createPortal(
    <SelectedEvent
      onClose={onClose}
      selectedEvent={selectedEvent}
      eventId={id}
    />,
    container)
}

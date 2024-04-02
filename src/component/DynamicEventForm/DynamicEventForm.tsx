import { Field, useFormikContext } from 'formik'

import { CustomFormikDatePicker } from '../FormikWrapper/CustomFormikDatePicker.tsx'
import { CustomFormikTimePicker } from '../FormikWrapper/CustomFormikTimePicker.tsx'

import './DynamicEventForm.scss'

type EventFormType = {
  type: string | undefined
  startDate: Date
  startTime: Date
  location: string
  info: string
  eventLocation: string
  opponent: string
}

export const DynamicEventForm = () => {
  const { values } = useFormikContext<EventFormType>()

  return (
    <div className='Dynamic-event-form'>
      { values.type === 'training' && <TrainingForm /> }
      { values.type === 'match' && <MatchForm /> }
      { values.type === undefined && <p>Please select an event type first.</p>}
    </div>
  )
}

const TrainingForm = () => {

  return (
    <div className='Training-form'>
      <div className='Training-form__title'>Add training details</div>
      <div className='Training-form__layout'>
        <div className='Training-form__layout--form-group'>
          <div className='Training-form__layout--form-group-label'>Date</div>
          <Field
            className='Training-form__layout--form-group-field'
            type='text'
            name='date'
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
            name='startTime'
            component={CustomFormikTimePicker}
          />
        </div>
        <div className='Training-form__layout--form-group'>
          <div className='Training-form__layout--form-group-label'>End Time</div>
          <Field
            className='Training-form__layout--form-group-field'
            type='text'
            name='endTime'
            component={CustomFormikTimePicker}
          />
        </div>
        <div className='Training-form__layout--form-group'>
          <div className='Training-form__layout--form-group-label'>Additional Information</div>
          <Field
            className='Training-form__layout--form-group-field'
            as='textarea'
            name='info'
          />
        </div>
      </div>
    </div>
  )
}

const MatchForm = () => {
  return (
    <div className='Match-form'>
      <div className='Match-form__title'>Add match details</div>
      <div className='Match-form__radio-group' role='group' aria-labelledby='my-radio-group'>
        <label className='Match-form__radio-group-label'>
          <Field className='Match-form__radio-group-label--field' type='radio' name='location' value='Home' />
          Home
        </label>
        <label className='Match-form__radio-group-label'>
          <Field className='Match-form__radio-group-label--field' type='radio' name='location' value='Away' />
          Away
        </label>
      </div>
      <div className='Match-form__layout'>
        <div className='Match-form__layout--form-group'>
          <div className='Match-form__layout--form-group-label'>Date</div>
          <Field
            className='Match-form__layout--form-group-field'
            type='text'
            name='date'
            component={CustomFormikDatePicker}
          />
        </div>
        <div className='Match-form__layout--form-group'>
          <div className='Match-form__layout--form-group-label'>Start Time</div>
          <Field
            className='Match-form__layout--form-group-field'
            type='text'
            name='startTime'
            component={CustomFormikTimePicker}
          />
        </div>
        <div className='Match-form__layout--form-group'>
          <div className='Match-form__layout--form-group-label'>End Time</div>
          <Field
            className='Match-form__layout--form-group-field'
            type='text'
            name='endTime'
            component={CustomFormikTimePicker}
          />
        </div>
        <div className='Match-form__layout--form-group'>
          <div className='Match-form__layout--form-group-label'>Event Location</div>
          <Field
            className='Match-form__layout--form-group-field'
            type='text'
            name='eventLocation'
          />
        </div>
        <div className='Match-form__layout--form-group'>
          <div className='Match-form__layout--form-group-label'>Opponent Name</div>
          <Field
            className='Match-form__layout--form-group-field'
            type='text'
            name='opponent'
          />
        </div>
        <div className='Match-form__layout--form-group'>
          <div className='Match-form__layout--form-group-label'>Additional Information</div>
          <Field
            className='Match-form__layout--form-group-field'
            as='textarea'
            name='info'
          />
        </div>
      </div>
    </div>
  )
}

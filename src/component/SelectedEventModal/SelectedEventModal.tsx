import { FC, useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { createPortal } from 'react-dom'
import { Control, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

import { SingleEventType } from '@/api'
import {
  eventSchema,
  EventSchemaIn,
  EventSchemaOut,
} from '@/component/EventFormModal/eventFormSchema.ts'
import InputFormField from '@/components/form/InputFormField.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form.tsx'
import { Label } from '@/components/ui/label.tsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx'
import { useToast } from '@/hooks/use-toast.ts'
import { combinedDate } from '@/services/helper.ts'
import {
  eventsSelector,
  getSingleEventThunk,
  updateEventThunk,
} from '@/store/slices/EventsSlice.ts'
import { useAppDispatch } from '@/store/types.ts'

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
  const { toast } = useToast()

  const defaultValues = useMemo(() => {
    if (!props.selectedEvent) return
    return {
      date: new Date(props.selectedEvent.startDate).toLocaleDateString('en-CA'),
      startTime: new Date(props.selectedEvent.startDate).toLocaleTimeString(),
      endTime: new Date(props.selectedEvent.endDate).toLocaleTimeString(),
      location: props.selectedEvent.location,
      info: props.selectedEvent.info,
      eventLocation: props.selectedEvent.eventLocation,
      opponent: props.selectedEvent.opponent,
    }
  }, [props.selectedEvent])

  const form = useForm<EventSchemaIn, never, EventSchemaOut>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues, { keepDirtyValues: true })
  }, [defaultValues, form])

  async function onSubmit(values: EventSchemaOut) {
    if (!props.selectedEvent) return
    const data = {
      type: 'match',
      startDate: combinedDate(new Date(values.date), values.startTime),
      endDate: combinedDate(new Date(values.date), values.endTime),
      location: values.location,
      eventLocation: values.eventLocation,
      opponent: values.opponent,
      info: values.info,
      teamId: props.selectedEvent.teamId,
      userId: props.selectedEvent.userId,
    }
    await dispatch(updateEventThunk({ data, eventId: props.eventId }))
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          description: 'Match updated successfully',
        })
        props.onClose()
      })
      .catch(() => {
        toast({
          variant: 'error',
          description: 'Error updated match',
        })
      })
  }

  return (
    <Popup onClose={props.onClose} className='Selected-event'>
      <div className='w-[600px] bg-at-white p-10'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div className='text-lg font-bold'>Match Information</div>
              <div className='text-sm text-gray-500'>
                Fill in the information below to create an event
              </div>
            </div>
            <div className='my-5'>
              <FormField
                control={form.control as Control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {props.selectedEvent && (
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={props.selectedEvent.location}
                          className='flex gap-10'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='home' id='home' />
                            <Label htmlFor='home'>Home</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='away' id='away' />
                            <Label htmlFor='away'>Away</Label>
                          </div>
                        </RadioGroup>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className='mb-5 grid grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-2'>
              <InputFormField
                control={form.control}
                label='Date'
                name='date'
                placeholder='Date'
                type='date'
              />
              <InputFormField
                control={form.control}
                label='Start Time'
                name='startTime'
                placeholder='Start Time'
                type='time'
              />
            </div>
            <div className='mb-5 grid grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-2'>
              <InputFormField
                control={form.control}
                label='End Time'
                name='endTime'
                placeholder='End Time'
                type='time'
              />
              <InputFormField
                control={form.control}
                label='Event Location'
                name='eventLocation'
                placeholder='Event Location'
                type='text'
              />
            </div>
            <div className='mb-5 grid grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-2'>
              <InputFormField
                control={form.control}
                label='Opponent Name'
                name='opponent'
                placeholder='Opponent Name'
                type='text'
              />
              <InputFormField
                control={form.control}
                label='Additional Information'
                name='info'
                placeholder='Additional Information'
                type='text'
              />
            </div>
            <div className='my-5'>
              <Button type='submit' className='bg-dark-purple text-white'>
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Popup>
  )
}

export const SelectedEventModal: FC<SelectedEventModal> = ({ onClose, id }) => {
  const dispatch = useAppDispatch()
  const { selectedEvent } = useSelector(eventsSelector)
  const container = document.body

  useEffect(() => {
    dispatch(getSingleEventThunk({ eventId: id }))
  }, [dispatch, id])

  return createPortal(
    <SelectedEvent onClose={onClose} selectedEvent={selectedEvent} eventId={id} />,
    container,
  )
}

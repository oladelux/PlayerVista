import { zodResolver } from '@hookform/resolvers/zod'
import React, { FC, useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import { Control, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { Popup } from '../Popup/Popup.tsx'
import { eventSchema, EventSchemaIn, EventSchemaOut } from '@/component/EventFormModal/eventFormSchema.ts'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import InputFormField from '@/components/form/InputFormField.tsx'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form.tsx'
import { Label } from '@/components/ui/label.tsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx'
import { UseUpdates } from '@/hooks/useUpdates.ts'
import { combinedDate } from '@/services/helper.ts'
import { createEventThunk } from '@/store/slices/EventsSlice.ts'
import { useAppDispatch } from '@/store/types.ts'

import './EventFormModal.scss'
import { useToast } from '@/hooks/use-toast.ts'
import useAuth from '@/useAuth.ts'


type EventFormModalProps = {
  /**
   * Function which is called on click overlay.
   */
  onClose: () => void
  startDate: Date
  logger: UseUpdates
}

const EventFormModal: FC<EventFormModalProps> = ({ onClose, startDate, logger }) => {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { teamId } = useParams()
  const { localSession } = useAuth()
  const [loading, setLoading] = useState(false)

  const defaultValues = useMemo(() => {
    return {
      date: startDate.toLocaleDateString('en-CA'),
      startTime: '',
      endTime: '',
      location: '',
      info: '',
      eventLocation: '',
      opponent: '',
    }
  }, [startDate])

  const form = useForm<EventSchemaIn, never, EventSchemaOut>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues, { keepDirtyValues: true })
  }, [defaultValues, form])

  async function onSubmit(values: EventSchemaOut) {
    if(!teamId || !localSession) return
    setLoading(true)
    const data = {
      type: 'match',
      startDate: combinedDate(new Date(values.date), values.startTime),
      endDate: combinedDate(new Date(values.date), values.endTime),
      location: values.location,
      eventLocation: values.eventLocation,
      opponent: values.opponent,
      info: values.info,
      teamId,
      userId: localSession.userId,
    }
    await dispatch(createEventThunk({ data }))
      .unwrap()
      .then(() => {
        logger.setUpdate({ message: 'added a new event', userId: localSession.userId, groupId: localSession.groupId })
        logger.sendUpdates(localSession.groupId)
        toast({
          variant: 'success',
          description: 'Match created successfully',
        })
        setLoading(false)
        onClose()
      }).catch(() => {
        setLoading(false)
        toast({
          variant: 'error',
          description: 'Error creating match',
        })
      })
  }

  return (
    <Popup onClose={onClose} className='Event-form'>
      <div className='w-[600px] bg-at-white p-10'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div className='text-lg font-bold'>Match Information</div>
              <div className='text-sm text-gray-500'>Fill in the information below to create an event</div>
            </div>
            <div className='my-5'>
              <FormField
                control={form.control as Control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex gap-10'>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='home' id='home'/>
                          <Label htmlFor='home'>Home</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='away' id='away'/>
                          <Label htmlFor='away'>Away</Label>
                        </div>
                      </RadioGroup>
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
              <LoadingButton
                isLoading={loading}
                type='submit'
                className='bg-dark-purple text-white'
              >
                Create Match
              </LoadingButton>
            </div>
          </form>
        </Form>
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
      logger={props.logger} />, container)
}

import React, { FC, useCallback, useEffect, useState } from 'react'
import { CalenderEvents } from '../../constants/events.ts'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'

import { Event } from '../../api'
import { convertToCalenderDate } from '../../services/helper.ts'

import { EventFormModalPortal } from '../EventFormModal/EventFormModal.tsx'
import { SelectedEventModal } from '../SelectedEventModal/SelectedEventModal.tsx'

import './EventCalender.scss'

type NewEvent = {
  start: Date
  end: Date
}

const localizer = dayjsLocalizer(dayjs)

type EventCalenderProps = {
  events: Event[]
}

export const EventCalender:FC<EventCalenderProps> = props => {
  const [isEventFormModal, setIsEventFormModal] = useState(false)
  const [isSelectedEventModal, setIsSelectedEventModal] = useState(false)
  const [myEvents, setEvents] = useState<CalenderEvents[]>([])

  const [eventStartDate, setEventStartDate] = useState<Date>()
  const [eventEndDate, setEventEndDate] = useState<Date>()
  const [selectedEvent, setSelectedEvent] = useState<string>('')

  const openEventFormModal = () => setIsEventFormModal(true)
  const closeEventFormModal = () => setIsEventFormModal(false)

  const openSelectedEventModal = () => setIsSelectedEventModal(true)
  const closeSelectedEventModal = () => setIsSelectedEventModal(false)

  const handleCalenderSlot = useCallback(({ start, end }: NewEvent) => {
    setEventStartDate(start)
    setEventEndDate(end)
    openEventFormModal()
  }, [])

  const handleSelectSlot = useCallback(
    ({ id }: { id: string } ) => {
      setSelectedEvent(id)
      openSelectedEventModal()
    },
    [],
  )

  useEffect(() => {
    if(props.events) {
      const newEvents = props.events.map((item) => {
        return {
          id: item.id,
          title: item.type,
          start: convertToCalenderDate(item.startDate),
          end: convertToCalenderDate(item.endDate),
        }
      })
      setEvents(newEvents)
    }
  }, [props.events])

  return (
    <>
      <Calendar
        events={myEvents}
        localizer={localizer}
        onSelectEvent={handleSelectSlot}
        onSelectSlot={handleCalenderSlot}
        selectable
        style={{ height: 500 }}
        className='Event-calender'
      />
      {isEventFormModal && eventStartDate && eventEndDate &&
        <EventFormModalPortal
          onClose={closeEventFormModal}
          startDate={eventStartDate}
          endDate={eventEndDate}
        />
      }
      {isSelectedEventModal &&
        <SelectedEventModal onClose={closeSelectedEventModal} id={selectedEvent}/>}
    </>
  )
}

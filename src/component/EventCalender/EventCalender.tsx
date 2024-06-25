import React, { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalenderEvents } from '../../constants/events.ts'
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar'
import dayjs from 'dayjs'

import { AuthenticatedUserData, Event } from '../../api'
import { convertToCalenderDate } from '../../services/helper.ts'
import { UseUpdates } from '../../hooks/useUpdates.ts'

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
  logger: UseUpdates
  user: AuthenticatedUserData
}

export const EventCalender:FC<EventCalenderProps> = props => {
  const navigate = useNavigate()
  const { teamId } = useParams()
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
    ({ id, start }: { id: string, start: Date } ) => {
      const now = new Date()
      setSelectedEvent(id)
      if(now > start) {
        navigate(`/team/${teamId}/events/${id}`)
      } else {
        openSelectedEventModal()
      }
    },
    [],
  )

  useEffect(() => {
    // const now = new Date()
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
        defaultView={Views.MONTH}
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
          logger={props.logger}
          user={props.user}
        />
      }
      {isSelectedEventModal &&
        <SelectedEventModal onClose={closeSelectedEventModal} id={selectedEvent}/>}
    </>
  )
}

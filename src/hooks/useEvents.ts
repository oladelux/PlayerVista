import { useEffect, useState } from 'react'

import { Event, SingleEventType } from '@/api'
import { eventService } from '@/singletons'

export type EventsHook = ReturnType<typeof useEvents>

/**
 * Hook to manage events.
 */
export const useEvents = (teamId?: string, eventId?: string) => {
  const [events, setEvents] = useState<Event[]>([])
  const [event, setEvent] = useState<SingleEventType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const currentTimestamp = new Date().getTime()

  const matches = events.filter(event => event.type === 'match')
  const scheduledMatches = matches.filter(match => {
    const matchTimestamp = new Date(match.startDate).getTime()
    return matchTimestamp > currentTimestamp
  })

  function getTeamEvent(year: number) {
    return events.filter(
      (event) => new Date(event.startDate).getFullYear() === year,
    )
  }

  useEffect(() => {
    const eventSubscription = eventService.event$.subscribe(state => {
      setEvents(state.events)
      setEvent(state.event)
      setLoading(state.loading)
      setError(state.error)
    })
    if(teamId){
      eventService.getEventsByTeamId(teamId)
    }
    if(eventId){
      eventService.getEvent(eventId)
    }

    return () => {
      eventSubscription.unsubscribe()
    }
  }, [eventId, teamId])

  return {
    events,
    event,
    error,
    loading,
    scheduledMatches,
    getTeamEvent,
  }
}

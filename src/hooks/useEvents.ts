import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { eventsSelector } from '../store/slices/EventsSlice.ts'

export type EventsHook = ReturnType<typeof useEvents>

/**
 * Hook to manage events.
 */
export const useEvents = () => {
  const { events } = useSelector(eventsSelector)
  const { teamId } = useParams()
  const currentTimestamp = new Date().getTime()

  const currentEvents = teamId && Object.prototype.hasOwnProperty.call(events, teamId)
    ? events[teamId]
    : []

  const matches = currentEvents.filter(event => event.type === 'match')
  const scheduledMatches = matches.filter(match => {
    const matchTimestamp = new Date(match.startDate).getTime()
    return matchTimestamp > currentTimestamp
  })

  return {
    events,
    currentEvents,
    scheduledMatches,
  }
}

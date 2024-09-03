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

  const matches = events.filter(event => event.type === 'match')
  const scheduledMatches = matches.filter(match => {
    const matchTimestamp = new Date(match.startDate).getTime()
    return matchTimestamp > currentTimestamp
  })

  function getTeamEvent(year: number) {
    teamId && console.log('year', teamId)
    return events.filter(
      (event) => new Date(event.startDate).getFullYear() === year,
    )
  }

  return {
    events,
    scheduledMatches,
    getTeamEvent,
  }
}

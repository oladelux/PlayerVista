import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { eventsSelector, getEventsByTeamThunk } from '../store/slices/EventsSlice.ts'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/types.ts'

export type EventsHook = ReturnType<typeof useEvents>

/**
 * Hook to manage events.
 */
export const useEvents = () => {
  const { events } = useSelector(eventsSelector)
  const { teamId } = useParams()
  const dispatch = useAppDispatch()
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

  useEffect(() => {
    if(teamId) {
      dispatch(getEventsByTeamThunk({ teamId }))
    }
  }, [dispatch, teamId])

  return {
    events,
    scheduledMatches,
    getTeamEvent,
  }
}

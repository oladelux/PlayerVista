import { useSelector } from 'react-redux'

import { eventsSelector } from '../store/slices/EventsSlice.ts'

/**
 * Hook to manage players.
 */
export const useEvents = () => {
  const { events } = useSelector(eventsSelector)

  return {
    events,
  }
}

import { useEffect, useState } from 'react'

import { PlayerPerformance } from '@/api'
import { performanceService } from '@/singletons'

/**
 * Hook to manage performance.
 */
export const usePerformance = (playerId?: string, eventId?: string) => {
  const [performanceByPlayer, setPerformanceByPlayer] = useState<PlayerPerformance[]>([])
  const [performanceByEvent, setPerformanceByEvent] = useState<PlayerPerformance[]>([])
  const [performanceByEventAndPlayer, setPerformanceByEventAndPlayer] =
    useState<PlayerPerformance | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    const Subscription = performanceService.performance$.subscribe(state => {
      setPerformanceByPlayer(state.performanceByPlayer)
      setPerformanceByEvent(state.performanceByEvent)
      setPerformanceByEventAndPlayer(state.performanceByEventAndPlayer)
      setLoading(state.loading)
      setError(state.error)
    })
    if (playerId) {
      performanceService.getPerformanceByPlayerId(playerId)
    }
    if (eventId) {
      performanceService.getPerformanceByEventId(eventId)
    }
    if (eventId && playerId) {
      performanceService.getPerformanceByEventAndPlayer(eventId, playerId)
    }

    return () => {
      Subscription.unsubscribe()
    }
  }, [eventId, playerId])

  return {
    performanceByPlayer,
    performanceByEvent,
    performanceByEventAndPlayer,
    error,
    loading,
  }
}

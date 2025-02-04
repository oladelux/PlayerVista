import { useEffect, useMemo, useState } from 'react'

import { TeamResponse } from '@/api'
import { appService, teamService } from '@/singletons'

export const useTeams = () => {
  const userId = useMemo(() => appService.getUserData()?.id, [])
  console.log('userId', userId)
  const [teams, setTeams] = useState<TeamResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!userId) return
    const teamSubscription = teamService.team$.subscribe(state => {
      setTeams(prevTeams => (prevTeams !== state.teams ? state.teams : prevTeams))
      setLoading(state.loading)
      setError(state.error)
    })
    teamService.getTeams(userId)

    return () => {
      teamSubscription.unsubscribe()
    }
  }, [userId])

  return {
    teams,
    error,
    loading,
  }
}

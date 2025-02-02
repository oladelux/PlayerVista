import { useEffect, useState } from 'react'

import { TeamResponse } from '@/api'
import { teamService } from '@/singletons'

export const useTeam = (teamId?: string) => {
  const [team, setTeam] = useState<TeamResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    if(!teamId) return
    const teamSubscription = teamService.team$.subscribe(state => {
      setTeam(prevTeam => (prevTeam !== state.team ? state.team : prevTeam))
      setLoading(state.loading)
      setError(state.error)
    })
    teamService.getTeam(teamId)

    return () => {
      teamSubscription.unsubscribe()
    }
  }, [teamId])

  return {
    team,
    error,
    loading,
  }
}

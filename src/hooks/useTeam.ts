import { useEffect, useState } from 'react'

import { TeamResponse } from '@/api'
import { teamService } from '@/singletons'

export const useTeam = (teamId?: string) => {
  const [team, setTeam] = useState<TeamResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    const teamSubscription = teamService.team$.subscribe(state => {
      setTeam(state.team)
      setLoading(state.loading)
      setError(state.error)
    })
    if (teamId) {
      teamService.getTeamById(teamId)
    }

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

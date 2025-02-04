import { useEffect, useMemo, useState } from 'react'

import { TeamResponse } from '@/api'
import { appService, teamService } from '@/singletons'

export const useTeams = () => {
  const userId = useMemo(() => appService.getUserData()?.id, [])
  const [teams, setTeams] = useState<TeamResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    const teamSubscription = teamService.team$.subscribe(state => {
      setTeams(state.teams)
      setLoading(state.teamsLoading)
      setError(state.error)
    })
    if (userId) {
      teamService.getTeams(userId)
    }

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

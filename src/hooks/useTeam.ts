import { useEffect, useState } from 'react'

import { TeamResponse } from '@/api'
import { appService, teamService } from '@/singletons'

export const useTeam = (teamId?: string) => {
  const userData = appService.getUserData()
  const userId = userData?.id
  const [team, setTeam] = useState<TeamResponse | null>(null)
  const [teams, setTeams] = useState<TeamResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  /*  async function updateTeam(data: TeamFormData) {
    if (teamId) {
      await dispatch(updateTeamThunk({ teamId, data }))
    }
  }*/

  useEffect(() => {
    console.log('Team: checking thus shit')
    const teamSubscription = teamService.team$.subscribe(state => {
      setTeams(state.teams)
      setTeam(state.team)
      setLoading(state.loading)
      setError(state.error)
    })
    teamService.getTeams(userId)
    if (teamId){
      teamService.getTeam(teamId)
    }

    return () => {
      teamSubscription.unsubscribe()
    }
  }, [teamId, userId])

  return {
    team,
    teams,
    error,
    loading,
  }
}

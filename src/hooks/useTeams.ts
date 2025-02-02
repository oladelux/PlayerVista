import { useDispatch, useSelector } from 'react-redux'

import { getTeamsThunk, teamSelector } from '../store/slices/TeamSlice'
import { AppDispatch } from '../store/types'
import { Fixtures } from '@/api'

/**
 * Hook to manage teams.
 */
export const useTeams = (userId?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const { teams } = useSelector(teamSelector)
  const teamResult: Fixtures[] = []
  if (!userId) {
    return
  }

  const getTeams = () => dispatch(getTeamsThunk({ userId }))

  return {
    /**
     * Array of all teams
     */
    teams,
    /**
     * Array of the team result
     */
    teamResult,
    getTeams,
  }
}

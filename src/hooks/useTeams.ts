import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch } from '../store/types'
import { getTeamsThunk, teamSelector } from '../store/slices/TeamSlice'
import { Fixtures } from '../api'

/**
 * Hook to manage teams.
 */
export const useTeams = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { teams } = useSelector(teamSelector)
  const teamResult: Fixtures[] = []

  const getTeams = () => dispatch(getTeamsThunk())

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

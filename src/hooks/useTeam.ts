import { useAppDispatch } from '@/store/types.ts'
import { useEffect } from 'react'
import { getTeamThunk, teamSelector, updateTeamThunk } from '@/store/slices/TeamSlice.ts'
import { useSelector } from 'react-redux'
import { TeamFormData } from '@/api'

export const useTeam = (teamId?: string) => {
  const dispatch = useAppDispatch()
  const { team } = useSelector(teamSelector)

  async function updateTeam(data: TeamFormData) {
    if (teamId) {
      await dispatch(updateTeamThunk({ teamId, data }))
    }
  }

  useEffect(() => {
    if (teamId) {
      dispatch(getTeamThunk({ id: teamId }))
    }
  }, [dispatch, teamId])

  return { team, updateTeam }
}

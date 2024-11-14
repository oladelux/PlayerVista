import { useAppDispatch } from '@/store/types.ts'
import { useEffect } from 'react'
import { getTeamThunk, teamSelector } from '@/store/slices/TeamSlice.ts'
import { useSelector } from 'react-redux'

export const useTeam = (teamId?: string) => {
  const dispatch = useAppDispatch()
  const { team } = useSelector(teamSelector)

  useEffect(() => {
    if (teamId) {
      dispatch(getTeamThunk({ id: teamId }))
    }
  }, [dispatch, teamId])

  return { team }
}

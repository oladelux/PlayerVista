import { FormEvent, useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import { useUser } from '@/hooks/useUser.ts'
import { useAppDispatch } from '@/store/types.ts'

import { getPlayersByTeamIdThunk, playersSelector } from '../store/slices/PlayersSlice'

/**
 * Hook to manage players.
 */
export const usePlayers = (teamId?: string) => {
  const dispatch = useAppDispatch()
  const { data } = useUser()
  const [searchPlayerValue, setSearchPlayerValue] = useState('')
  const { players } = useSelector(playersSelector)

  useEffect(() => {
    if (teamId) {
      dispatch(getPlayersByTeamIdThunk({ teamId }))
    }
  }, [data, dispatch, teamId])

  /**
   * Event handler for search value changes with a minimum length requirement.
   * @param e - The form event from the input element.
   */
  const handleSearchInput = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { value } = e.currentTarget
    setSearchPlayerValue(value)
  }

  return {
    players,
    searchPlayerValue,
    handleSearchInput,
  }
}

import { FormEvent, useState } from 'react'
import { useSelector } from 'react-redux'

import { playersSelector } from '../store/slices/PlayersSlice'

/**
 * Hook to manage players.
 */
export const usePlayers = () => {
  const [searchPlayerValue, setSearchPlayerValue] = useState('')
  const { players } = useSelector(playersSelector)

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

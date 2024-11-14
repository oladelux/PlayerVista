import { useAppDispatch } from '@/store/types.ts'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getPlayerByIdThunk, playersSelector } from '@/store/slices/PlayersSlice.ts'

export const usePlayer = (playerId?: string) => {
  const dispatch = useAppDispatch()
  const { player } = useSelector(playersSelector)

  useEffect(() => {
    if (playerId) {
      dispatch(getPlayerByIdThunk({ id: playerId }))
    }
  }, [dispatch, playerId])

  return { player }
}

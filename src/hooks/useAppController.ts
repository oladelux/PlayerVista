import { useUser } from './useUser'
import { useAuthentication } from './useAuthentication'
import { useEffect } from 'react'
import { useAppLoading } from './useAppLoading'
import { getTeamsThunk, teamSelector } from '../store/slices/TeamSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../store/types'
import { useTeams } from './useTeams'
import { usePlayers } from './usePlayers'

export type AppController = ReturnType<typeof useAppController>
let didInit = false

export function useAppController () {
  const dispatch = useDispatch<AppDispatch>()

  const { teams } = useSelector(teamSelector)
  const user = useUser()
  const { players } = usePlayers()
  const authentication = useAuthentication(user, async () => {
    await dispatch(getTeamsThunk())
  })
  const team = useTeams()
  const loading = useAppLoading()

  useEffect(() => {
    if (!didInit) {
      didInit = true
      user.initializeApp()
        .then(async data => {
          if (data) {
            await dispatch(getTeamsThunk())
          }
        })
        .then(() => {
          loading.done()
        })
    }
  }, [])

  return {
    user,
    loading,
    authentication,
    team,
    players,
    teams,
  }
}

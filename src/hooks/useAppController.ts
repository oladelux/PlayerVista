import { useUser } from './useUser'
import { useAuthentication } from './useAuthentication'
import { useEffect } from 'react'
import { useAppLoading } from './useAppLoading'
import { getTeamsThunk, teamSelector } from '../store/slices/TeamSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../store/types'
import { useTeams } from './useTeams'
import { usePlayers } from './usePlayers'
import { useEvents } from './useEvents.ts'
import { useUpdates } from './useUpdates.ts'
import { getApplicationLogsThunk, settingsSelector } from '../store/slices/SettingsSlice.ts'
import { getCurrentTeam } from '../utils/localStorage.ts'
import { getEventsByTeamThunk } from '../store/slices/EventsSlice.ts'
import { getStaffsThunk, staffSelector } from '../store/slices/StaffSlice.ts'
import { getReportersThunk, reporterSelector } from '../store/slices/ReporterSlice.ts'
import { getPlayersByTeamIdThunk, getPlayersByUserIdThunk, playersSelector } from '@/store/slices/PlayersSlice.ts'

export type AppController = ReturnType<typeof useAppController>
let didInit = false

export function useAppController () {
  const dispatch = useDispatch<AppDispatch>()

  const { teams } = useSelector(teamSelector)
  const { allPlayers } = useSelector(playersSelector)
  const { logs } = useSelector(settingsSelector)
  const { staffs } = useSelector(staffSelector)
  const { reporters } = useSelector(reporterSelector)
  const currentTeam = getCurrentTeam()
  const user = useUser()
  const logger = useUpdates()
  const { players } = usePlayers()
  const events = useEvents()
  const authentication = useAuthentication(user, async (userData) => {
    await dispatch(getTeamsThunk({ userId: userData.id }))
    await dispatch(getPlayersByUserIdThunk({ userId: userData.id }))
    await dispatch(getApplicationLogsThunk({ groupId: userData.groupId }))
  })
  const team = useTeams(user.data?.id)
  const loading = useAppLoading()

  useEffect(() => {
    if (!didInit) {
      didInit = true
      user.initializeApp()
        .then(async data => {
          if (data) {
            await dispatch(getTeamsThunk({ userId: data.id }))
            await dispatch(getApplicationLogsThunk({ groupId: data.groupId }))
            await dispatch(getPlayersByUserIdThunk({ userId: data.id }))
            await dispatch(getPlayersByTeamIdThunk({ teamId: currentTeam }))
            await dispatch(getEventsByTeamThunk({ teamId: currentTeam }))
            await dispatch(getStaffsThunk({ groupId: data.groupId }))
            await dispatch(getReportersThunk({ teamId: currentTeam }))
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
    allPlayers,
    teams,
    staffs,
    reporters,
    events,
    logger,
    logs,
  }
}

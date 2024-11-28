import { useUser } from './useUser'
import { useAuthentication } from './useAuthentication'
import { useEffect } from 'react'
import { useAppLoading } from './useAppLoading'
import { getTeamsThunk, getTeamThunk, teamSelector } from '../store/slices/TeamSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../store/types'
import { useTeams } from './useTeams'
import { usePlayers } from './usePlayers'
import { useEvents } from './useEvents.ts'
import { useUpdates } from './useUpdates.ts'
import {
  getApplicationLogsThunk,
  getRolesByGroupIdThunk,
  setActiveTeamId,
  settingsSelector, setUserId, setUserRole,
} from '../store/slices/SettingsSlice.ts'
import { getEventsByTeamThunk } from '../store/slices/EventsSlice.ts'
import { getStaffsThunk, staffSelector } from '../store/slices/StaffSlice.ts'
import { getPlayersByTeamIdThunk, getPlayersByUserIdThunk, playersSelector } from '@/store/slices/PlayersSlice.ts'

export type AppController = ReturnType<typeof useAppController>
let didInit = false

export function useAppController () {
  const dispatch = useDispatch<AppDispatch>()

  const { teams } = useSelector(teamSelector)
  const { team: singleTeam } = useSelector(teamSelector)
  const { allPlayers } = useSelector(playersSelector)
  const { logs, activeTeamId } = useSelector(settingsSelector)
  const { staffs } = useSelector(staffSelector)
  //const { reporters } = useSelector(reporterSelector)
  const user = useUser()
  const logger = useUpdates()
  const { players } = usePlayers()
  const events = useEvents()
  const authentication = useAuthentication(user, async (userData) => {
    await dispatch(getTeamsThunk({ userId: userData.id }))
    await dispatch(getTeamThunk({ id: activeTeamId }))
    await dispatch(getPlayersByUserIdThunk({ userId: userData.id }))
    await dispatch(getApplicationLogsThunk({ groupId: userData.groupId }))
    await dispatch(getRolesByGroupIdThunk({ groupId: userData.groupId }))
    dispatch(setActiveTeamId({ teamId: activeTeamId }))
    dispatch(setUserRole({ role: userData.role }))
    dispatch(setUserId({ id: userData.id }))
  })
  const team = useTeams(user.data?.id)
  const loading = useAppLoading()

  useEffect(() => {
    if (!didInit) {
      didInit = true
      user.initializeApp()
        .then(async data => {
          if (data) {
            dispatch(setActiveTeamId({ teamId: data.teamId }))
            dispatch(setUserRole({ role: data.role }))
            dispatch(setUserId({ id: data.id }))
            await dispatch(getTeamsThunk({ userId: data.id }))
            await dispatch(getTeamThunk({ id: data.teamId }))
            await dispatch(getApplicationLogsThunk({ groupId: data.groupId }))
            await dispatch(getRolesByGroupIdThunk({ groupId: data.groupId }))
            await dispatch(getPlayersByUserIdThunk({ userId: data.id }))
            await dispatch(getPlayersByTeamIdThunk({ teamId: data.teamId }))
            await dispatch(getEventsByTeamThunk({ teamId: data.teamId }))
            await dispatch(getStaffsThunk({ groupId: data.groupId }))
            //await dispatch(getReportersThunk({ teamId: currentTeam }))
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
    singleTeam,
    players,
    allPlayers,
    teams,
    staffs,
    // reporters,
    events,
    logger,
    logs,
  }
}

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useAppLoading } from './useAppLoading'
import { useEvents } from './useEvents.ts'
import { usePlayers } from './usePlayers'
import { useTeams } from './useTeams'
import { useUpdates } from './useUpdates.ts'
import { useUser } from './useUser'
import { getEventsByTeamThunk } from '../store/slices/EventsSlice.ts'
import {
  getApplicationLogsThunk,
  getRolesByGroupIdThunk,
  setActiveTeamId,
  settingsSelector, setUserId, setUserRole,
} from '../store/slices/SettingsSlice.ts'
import { getStaffsThunk, staffSelector } from '../store/slices/StaffSlice.ts'
import { getTeamsThunk, getTeamThunk, teamSelector } from '../store/slices/TeamSlice'
import { AppDispatch } from '../store/types'
import { appService } from '@/singletons'
import { getPlayersByTeamIdThunk, getPlayersByUserIdThunk, playersSelector } from '@/store/slices/PlayersSlice.ts'
import { getUserDataThunk } from '@/store/slices/UserSlice.ts'

let didInit = false

export function useAppController () {
  const dispatch = useDispatch<AppDispatch>()
  const { teams } = useSelector(teamSelector)
  const { team: singleTeam } = useSelector(teamSelector)
  const { allPlayers } = useSelector(playersSelector)
  const { logs } = useSelector(settingsSelector)
  const { staffs } = useSelector(staffSelector)
  //const { reporters } = useSelector(reporterSelector)
  const user = useUser()
  const logger = useUpdates()
  const { players } = usePlayers()
  const events = useEvents()
  const team = useTeams()
  const loading = useAppLoading()

  useEffect(() => {
    if (!didInit) {
      didInit = true
      user.initializeApp()
        .then(async data => {
          if (data) {
            appService.setUserId(data.id)
            appService.setUserData(data)
            dispatch(setActiveTeamId({ teamId: data.teamId }))
            dispatch(setUserRole({ role: data.role }))
            dispatch(setUserId({ id: data.id }))
            await dispatch(getUserDataThunk())
            await dispatch(getTeamsThunk({ userId: data.id }))
            await dispatch(getTeamThunk({ id: data.teamId }))
            await dispatch(getApplicationLogsThunk({ groupId: data.groupId }))
            await dispatch(getRolesByGroupIdThunk({ groupId: data.groupId }))
            await dispatch(getPlayersByUserIdThunk({ userId: data.id }))
            await dispatch(getPlayersByTeamIdThunk({ teamId: data.teamId }))
            await dispatch(getEventsByTeamThunk({ teamId: data.teamId }))
            await dispatch(getStaffsThunk({ groupId: data.groupId }))
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

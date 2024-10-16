import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types'
import { getLogs, LogType, LogsResponse } from '../../api'

type InitialSettingsState = {
  activeTeamId: string,
  logs: LogType[],
  /**
   * The loading state of getting logs
   */
  loadingGettingLogs: AsyncThunkLoading
}

const initialState: InitialSettingsState = {
  activeTeamId: '',
  logs: [],
  loadingGettingLogs: 'idle',
}

/**
 * Gets the application logs
 */
export const getApplicationLogsThunk = createAsyncThunk<
  undefined | LogsResponse,
  { groupId: string }
>('settings/logs', async ({ groupId }) => {
  return await getLogs(groupId)
})

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setActiveTeamId: (
      state,
      action: PayloadAction<{ teamId: string }>,
    ) => {
      const { teamId } = action.payload
      state.activeTeamId = teamId
    },
    clearSettingsState: (
      state,
    ) => {
      state.logs = []
      state.activeTeamId = ''
      state.loadingGettingLogs = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationLogsThunk.pending, state => {
        state.loadingGettingLogs = 'pending'
      })
      .addCase(getApplicationLogsThunk.fulfilled, (state, action) => {
        if (
          state.loadingGettingLogs === 'pending'
        ) {
          state.loadingGettingLogs = 'succeeded'
          if (action.payload) {
            state.logs = action.payload.data
          }
        }
      })
      .addCase(getApplicationLogsThunk.rejected, (state, action) => {
        if (
          state.loadingGettingLogs === 'pending'
        ) {
          state.loadingGettingLogs = 'failed'
          console.error('Error getting logs', action.error)
        }
      })
  },
})

export const {
  setActiveTeamId,
  clearSettingsState,
} = settingsSlice.actions

export const settingsSelector = (state: RootState) => state.settings

export const settingsReducer = settingsSlice.reducer

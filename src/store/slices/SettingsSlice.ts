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
  undefined | LogsResponse
>('settings/logs', async () => {
  return await getLogs()
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
            state.logs = state.logs.concat(action.payload.results)
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
} = settingsSlice.actions

export const settingsSelector = (state: RootState) => state.settings

export const settingsReducer = settingsSlice.reducer

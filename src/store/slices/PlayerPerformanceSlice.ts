import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types'
import {
  ClientError, getPerformanceByEvent, getPerformanceDataByPlayer, PlayerPerformance,
} from '@/api'

type InitialPlayerPerformanceState = {
  performance: PlayerPerformance[]
  /**
   * The loading state of getting players for a team
   */
  loadingGettingPlayerPerformanceStatus: AsyncThunkLoading
  loadingGettingPlayerPerformanceByPlayerIdStatus: AsyncThunkLoading
  playerPerformance: PlayerPerformance | null
}

const initialState: InitialPlayerPerformanceState = {
  performance: [],
  loadingGettingPlayerPerformanceStatus: 'idle',
  loadingGettingPlayerPerformanceByPlayerIdStatus: 'idle',
  playerPerformance: null,
}

/**
 * Gets all player's performance for an event
 */
export const getPerformanceByEventThunk = createAsyncThunk<
  PlayerPerformance[],
  { eventId: string }
>('performance/getPerformance', async ({ eventId }, { rejectWithValue }) => {
  try {
    return await getPerformanceByEvent(eventId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in getting performance data')
  }
})

export const getPerformanceDataByPlayerIdThunk = createAsyncThunk<
  PlayerPerformance,
  { eventId: string, playerId: string }
>('performance/getPerformanceByPlayerId', async ({ eventId, playerId }, { rejectWithValue }) => {
  try {
    return await getPerformanceDataByPlayer(eventId, playerId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in getting performance data')
  }
})

export const playerPerformanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    clearPerformanceState: (
      state,
    ) => {
      state.performance = []
      state.loadingGettingPlayerPerformanceStatus = 'idle'
    },
    clearPlayerPerformanceData: (
      state,
    ) => {
      state.playerPerformance = null
      state.loadingGettingPlayerPerformanceByPlayerIdStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPerformanceByEventThunk.pending, state => {
        state.loadingGettingPlayerPerformanceStatus = 'pending'
      })
      .addCase(getPerformanceByEventThunk.fulfilled, (state, action) => {
        state.loadingGettingPlayerPerformanceStatus = 'succeeded'

        if (action.payload) {
          state.performance = action.payload
        }
      })
      .addCase(getPerformanceByEventThunk.rejected, (state, action) => {
        if (
          state.loadingGettingPlayerPerformanceStatus === 'pending'
        ) {
          state.loadingGettingPlayerPerformanceStatus = 'failed'
          console.error('Error getting performance', action.error)
        }
      })
      .addCase(getPerformanceDataByPlayerIdThunk.pending, state => {
        state.loadingGettingPlayerPerformanceByPlayerIdStatus = 'pending'
      })
      .addCase(getPerformanceDataByPlayerIdThunk.fulfilled, (state, action) => {
        state.loadingGettingPlayerPerformanceByPlayerIdStatus = 'succeeded'

        if (action.payload) {
          state.playerPerformance = action.payload
        }
      })
      .addCase(getPerformanceDataByPlayerIdThunk.rejected, (state, action) => {
        if (
          state.loadingGettingPlayerPerformanceByPlayerIdStatus === 'pending'
        ) {
          state.loadingGettingPlayerPerformanceByPlayerIdStatus = 'failed'
          console.error('Error getting player performance', action.error)
        }
      })
  },
})

export const {
  clearPerformanceState,
  clearPlayerPerformanceData,
} = playerPerformanceSlice.actions

export const playerPerformanceSelector = (state: RootState) => state.playerPerformance

export const playerPerformanceReducer = playerPerformanceSlice.reducer

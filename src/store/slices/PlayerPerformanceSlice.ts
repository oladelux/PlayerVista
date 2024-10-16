import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types'
import {
  ClientError, getPerformanceData, PlayerPerformance,
} from '@/api'

type InitialPlayerPerformanceState = {
  performance: PlayerPerformance[]
  /**
   * The loading state of getting players for a team
   */
  loadingGettingPlayerPerformanceStatus: AsyncThunkLoading
}

const initialState: InitialPlayerPerformanceState = {
  performance: [],
  loadingGettingPlayerPerformanceStatus: 'idle',
}

/**
 * Gets all player's performance for an event
 */
export const getPerformanceDataThunk = createAsyncThunk<
  PlayerPerformance[],
  { eventId: string }
>('performance/getPerformance', async ({ eventId }, { rejectWithValue }) => {
  try {
    return await getPerformanceData(eventId)
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPerformanceDataThunk.pending, state => {
        state.loadingGettingPlayerPerformanceStatus = 'pending'
      })
      .addCase(getPerformanceDataThunk.fulfilled, (state, action) => {
        state.loadingGettingPlayerPerformanceStatus = 'succeeded'

        if (action.payload) {
          state.performance = action.payload
        }
      })
      .addCase(getPerformanceDataThunk.rejected, (state, action) => {
        if (
          state.loadingGettingPlayerPerformanceStatus === 'pending'
        ) {
          state.loadingGettingPlayerPerformanceStatus = 'failed'
          console.error('Error getting performance', action.error)
        }
      })
  },
})

export const {
  clearPerformanceState,
} = playerPerformanceSlice.actions

export const playerPerformanceSelector = (state: RootState) => state.playerPerformance

export const playerPerformanceReducer = playerPerformanceSlice.reducer

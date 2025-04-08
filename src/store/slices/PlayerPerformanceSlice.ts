import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import {
  ClientError,
  getPerformanceByEvent,
  getPerformanceByEventAndPlayer,
  getPerformancesForPlayer,
  PlayerPerformance,
  PlayerPerformanceResponse,
} from '@/api'

import { AsyncThunkLoading, RootState } from '../types'

type InitialPlayerPerformanceState = {
  performance: PlayerPerformance[]
  /**
   * The loading state of getting players for a team
   */
  loadingGettingPlayerPerformanceStatus: AsyncThunkLoading
  /**
   * The loading state of getting players for a team by user
   */
  loadingGettingPlayerPerformanceByPlayerAndEventStatus: AsyncThunkLoading
  playerPerformance: PlayerPerformance | null
  loadingGettingPlayerPerformanceByPlayerIdStatus: AsyncThunkLoading
  performanceByPlayerId: PlayerPerformance[]
}

const initialState: InitialPlayerPerformanceState = {
  performance: [],
  loadingGettingPlayerPerformanceStatus: 'idle',
  loadingGettingPlayerPerformanceByPlayerAndEventStatus: 'idle',
  loadingGettingPlayerPerformanceByPlayerIdStatus: 'idle',
  playerPerformance: null,
  performanceByPlayerId: [],
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

export const getPerformanceByEventAndPlayerThunk = createAsyncThunk<
  PlayerPerformance,
  { eventId: string; playerId: string }
>(
  'performance/getPerformanceByEventAndPlayer',
  async ({ eventId, playerId }, { rejectWithValue }) => {
    try {
      return await getPerformanceByEventAndPlayer(eventId, playerId)
    } catch (e) {
      if (e instanceof ClientError) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('Unexpected error in getting performance data')
    }
  },
)

export const getPerformancesForPlayerThunk = createAsyncThunk<
  PlayerPerformanceResponse,
  { playerId: string }
>('performance/getPerformanceByPlayerId', async ({ playerId }, { rejectWithValue }) => {
  try {
    return await getPerformancesForPlayer(playerId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in getting full player performance')
  }
})

export const playerPerformanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    clearPerformanceState: state => {
      state.performance = []
      state.loadingGettingPlayerPerformanceStatus = 'idle'
    },
    clearPlayerPerformanceData: state => {
      state.playerPerformance = null
      state.loadingGettingPlayerPerformanceByPlayerIdStatus = 'idle'
    },
  },
  extraReducers: builder => {
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
        if (state.loadingGettingPlayerPerformanceStatus === 'pending') {
          state.loadingGettingPlayerPerformanceStatus = 'failed'
          console.error('Error getting performance', action.error)
        }
      })
      .addCase(getPerformanceByEventAndPlayerThunk.pending, state => {
        state.loadingGettingPlayerPerformanceByPlayerAndEventStatus = 'pending'
      })
      .addCase(getPerformanceByEventAndPlayerThunk.fulfilled, (state, action) => {
        state.loadingGettingPlayerPerformanceByPlayerAndEventStatus = 'succeeded'

        if (action.payload) {
          state.playerPerformance = action.payload
        }
      })
      .addCase(getPerformanceByEventAndPlayerThunk.rejected, (state, action) => {
        if (state.loadingGettingPlayerPerformanceByPlayerAndEventStatus === 'pending') {
          state.loadingGettingPlayerPerformanceByPlayerAndEventStatus = 'failed'
          console.error('Error getting player performance', action.error)
        }
      })
      .addCase(getPerformancesForPlayerThunk.pending, state => {
        state.loadingGettingPlayerPerformanceByPlayerIdStatus = 'pending'
      })
      .addCase(getPerformancesForPlayerThunk.fulfilled, (state, action) => {
        state.loadingGettingPlayerPerformanceByPlayerIdStatus = 'succeeded'

        if (action.payload) {
          state.performanceByPlayerId = action.payload.data
        }
      })
      .addCase(getPerformancesForPlayerThunk.rejected, (state, action) => {
        if (state.loadingGettingPlayerPerformanceByPlayerIdStatus === 'pending') {
          state.loadingGettingPlayerPerformanceByPlayerIdStatus = 'failed'
          console.error('Error getting full player performance', action.error)
        }
      })
  },
})

export const { clearPerformanceState, clearPlayerPerformanceData } = playerPerformanceSlice.actions

export const playerPerformanceSelector = (state: RootState) => state.playerPerformance

export const playerPerformanceReducer = playerPerformanceSlice.reducer

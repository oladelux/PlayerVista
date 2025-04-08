import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import {
  assignReporter,
  ClientError,
  createReporter,
  getReporters,
  Reporter,
  ReporterData,
  retractReporter,
} from '../../api'
import { AsyncThunkLoading, RootState } from '../types.ts'

type InitialStaffState = {
  reporters: Reporter[]
  /**
   * The loading state of creating new reporter
   */
  loadingCreatingReporter: AsyncThunkLoading
  /**
   * The loading state of getting all reporters
   */
  loadingGettingReporters: AsyncThunkLoading
  loadingAssigningReporter: AsyncThunkLoading
  loadingRetractingReporter: AsyncThunkLoading
}

const initialState: InitialStaffState = {
  reporters: [],
  loadingCreatingReporter: 'idle',
  loadingGettingReporters: 'idle',
  loadingAssigningReporter: 'idle',
  loadingRetractingReporter: 'idle',
}

/**
 * Create a new reporter
 */
export const createReporterThunk = createAsyncThunk<Reporter, { data: ReporterData }>(
  'reporters/add-reporter',
  async ({ data }, { rejectWithValue }) => {
    try {
      return await createReporter(data)
    } catch (e) {
      if (e instanceof ClientError) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('Unexpected error in creating reporter')
    }
  },
)

/**
 * Gets all reporters
 */
export const getReportersThunk = createAsyncThunk<Reporter[], { teamId: string }>(
  'reporters/getReporters',
  async ({ teamId }, { rejectWithValue }) => {
    try {
      return await getReporters(teamId)
    } catch (e) {
      if (e instanceof ClientError) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('Unexpected error in getting reporters')
    }
  },
)

/**
 * The thunk for assigning reporter to an event
 */
export const assignReporterThunk = createAsyncThunk<
  Reporter,
  { data: { eventId: string }; reporterId: string }
>('reporters/assignReporter', ({ data, reporterId }, { rejectWithValue }) => {
  try {
    return assignReporter(data, reporterId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in assigning reporter')
  }
})

/**
 * The thunk for retracting an event from a reporter
 */
export const retractReporterThunk = createAsyncThunk<
  Reporter,
  { data: { eventId: string }; reporterId: string }
>('reporters/retractReporter', ({ data, reporterId }, { rejectWithValue }) => {
  try {
    return retractReporter(data, reporterId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in retracting reporter')
  }
})

export const reporterSlice = createSlice({
  name: 'reporters',
  initialState,
  reducers: {
    clearReporterState: state => {
      state.loadingCreatingReporter = 'idle'
      state.reporters = []
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createReporterThunk.pending, state => {
        state.loadingCreatingReporter = 'pending'
      })
      .addCase(createReporterThunk.fulfilled, (state, action) => {
        state.loadingCreatingReporter = 'succeeded'
        if (action.payload) {
          state.reporters.push(action.payload)
        }
      })
      .addCase(createReporterThunk.rejected, (state, action) => {
        if (state.loadingCreatingReporter === 'pending') {
          state.loadingCreatingReporter = 'failed'
          console.error('Error creating new reporter', action.error)
        }
      })
      .addCase(getReportersThunk.pending, state => {
        state.loadingGettingReporters = 'pending'
      })
      .addCase(getReportersThunk.fulfilled, (state, action) => {
        state.loadingGettingReporters = 'succeeded'
        if (action.payload) {
          state.reporters = action.payload
        }
      })
      .addCase(getReportersThunk.rejected, (state, action) => {
        if (state.loadingGettingReporters === 'pending') {
          state.loadingGettingReporters = 'failed'
          console.error('Error getting all reporters', action.error)
        }
      })
      .addCase(assignReporterThunk.pending, state => {
        state.loadingAssigningReporter = 'pending'
      })
      .addCase(assignReporterThunk.fulfilled, (state, action) => {
        state.loadingAssigningReporter = 'succeeded'
        const updatedReporter = action.payload

        if (updatedReporter) {
          const reportersFromState = state.reporters
          const reporterIndex = reportersFromState.findIndex(
            reporter => reporter.id === updatedReporter.id,
          )
          if (reporterIndex !== -1) {
            state.reporters[reporterIndex] = updatedReporter
          }
        }
      })
      .addCase(assignReporterThunk.rejected, (state, action) => {
        if (state.loadingAssigningReporter === 'pending') {
          state.loadingAssigningReporter = 'failed'
          console.error('Error assigning reporter', action.error)
        }
      })
      .addCase(retractReporterThunk.pending, state => {
        state.loadingRetractingReporter = 'pending'
      })
      .addCase(retractReporterThunk.fulfilled, (state, action) => {
        state.loadingRetractingReporter = 'succeeded'
        const updatedReporter = action.payload

        if (updatedReporter) {
          const reportersFromState = state.reporters
          const reporterIndex = reportersFromState.findIndex(
            reporter => reporter.id === updatedReporter.id,
          )
          if (reporterIndex !== -1) {
            state.reporters[reporterIndex] = updatedReporter
          }
        }
      })
      .addCase(retractReporterThunk.rejected, (state, action) => {
        if (state.loadingRetractingReporter === 'pending') {
          state.loadingRetractingReporter = 'failed'
          console.error('Error retracting reporter', action.error)
        }
      })
  },
})

export const { clearReporterState } = reporterSlice.actions

export const reporterSelector = (state: RootState) => state.reporters

export const reporterReducer = reporterSlice.reducer

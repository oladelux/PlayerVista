import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types'
import {
  ClientError,
  createTeam,
  getTeams,
  TeamDataResponse,
  TeamFormData,
  TeamResult,
} from '../../api'

type InitialTeamState = {
  teams: TeamResult[]
  /**
   * The loading state of creating new team
   */
  loadingCreatingTeamStatus: AsyncThunkLoading
  loadingGettingTeams: AsyncThunkLoading
}

const initialState: InitialTeamState = {
  teams: [],
  loadingCreatingTeamStatus: 'idle',
  loadingGettingTeams: 'idle',
}

/**
 * Create a new player profile
 */
export const createTeamThunk = createAsyncThunk<
  unknown,
  { data: TeamFormData }
>('teams/add-team', ({ data }) => {
  try {
    return createTeam(data)
  } catch (e) {
    if (e instanceof ClientError) {
      return e.message
    }
    return 'Unexpected error in creating team'
  }
})

/**
 * Gets all teams
 */
export const getTeamsThunk = createAsyncThunk<
  undefined | TeamDataResponse
>('teams/teams', () => {
  return getTeams()
})

export const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearTeamState: (
      state,
    ) => {
      state.loadingCreatingTeamStatus = 'idle'
      state.loadingGettingTeams = 'idle'
      state.teams = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTeamThunk.pending, state => {
        state.loadingCreatingTeamStatus = 'pending'
      })
      .addCase(createTeamThunk.fulfilled, state => {
        state.loadingCreatingTeamStatus = 'succeeded'
      })
      .addCase(createTeamThunk.rejected, (state, action) => {
        if (
          state.loadingCreatingTeamStatus === 'pending'
        ) {
          state.loadingCreatingTeamStatus = 'failed'
          console.error('Error creating new team', action.error)
        }
      })
      .addCase(getTeamsThunk.pending, state => {
        state.loadingGettingTeams = 'pending'
      })
      .addCase(getTeamsThunk.fulfilled, (state, action) => {
        if (
          state.loadingGettingTeams === 'pending'
        ) {
          state.loadingGettingTeams = 'succeeded'
          if (action.payload) {
            state.teams = action.payload.results
          }
        }
      })
      .addCase(getTeamsThunk.rejected, (state, action) => {
        if (
          state.loadingGettingTeams === 'pending'
        ) {
          state.loadingGettingTeams = 'failed'
          console.error('Error getting teams', action.error)
        }
      })
  },
})

export const {
  clearTeamState,
} = teamSlice.actions

export const teamSelector = (state: RootState) => state.teams

export const teamReducer = teamSlice.reducer

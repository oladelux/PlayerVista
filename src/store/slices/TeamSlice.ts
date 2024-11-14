import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types'
import {
  ClientError,
  createTeam, getTeam, getTeamsByUser,
  TeamDataResponse,
  TeamFormData, TeamResponse,
} from '@/api'

type InitialTeamState = {
  teams: TeamResponse[]
  team: TeamResponse | null
  /**
   * The loading state of creating new team
   */
  loadingCreatingTeamStatus: AsyncThunkLoading
  loadingGettingTeams: AsyncThunkLoading
  loadingGettingTeam: AsyncThunkLoading
}

const initialState: InitialTeamState = {
  teams: [],
  team: null,
  loadingCreatingTeamStatus: 'idle',
  loadingGettingTeams: 'idle',
  loadingGettingTeam: 'idle',
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
 * Gets teams by a user
 */
export const getTeamsThunk = createAsyncThunk<
  undefined | TeamDataResponse,
  { userId: string }
>('teams/teams', ({ userId }) => {
  return getTeamsByUser(userId)
})

/**
 * Gets a single team
 */
export const getTeamThunk = createAsyncThunk<
  undefined | TeamResponse,
  { id: string }
>('teams/team', ({ id }) => {
  return getTeam(id)
} )

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
            state.teams = action.payload.data
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
      .addCase(getTeamThunk.pending, state => {
        state.loadingGettingTeam = 'pending'
      })
      .addCase(getTeamThunk.fulfilled, (state, action) => {
        if (
          state.loadingGettingTeam === 'pending'
        ) {
          state.loadingGettingTeam = 'succeeded'
          if (action.payload) {
            state.team = action.payload
          }
        }
      })
      .addCase(getTeamThunk.rejected, (state, action) => {
        if (
          state.loadingGettingTeam === 'pending'
        ) {
          state.loadingGettingTeam = 'failed'
          console.error('Error getting team', action.error)
        }
      })
  },
})

export const {
  clearTeamState,
} = teamSlice.actions

export const teamSelector = (state: RootState) => state.teams

export const teamReducer = teamSlice.reducer

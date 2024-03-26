import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types'
import {
  addPlayer,
  ClientError,
  getPlayers, Player,
  PlayerDataResponse,
  PlayerFormData, updatePlayer,
} from '../../api'

type InitialPlayersState = {
  players: Record<string, Player[]>
  /**
   * The loading state of creating new player
   */
  loadingCreatingNewPlayerStatus: AsyncThunkLoading
  /**
   * The loading state of getting players for a team
   */
  loadingGettingTeamPlayersStatus: AsyncThunkLoading
  /**
   * The loading state of updating a player
   */
  loadingUpdatingPlayer: AsyncThunkLoading
}

const initialState: InitialPlayersState = {
  players: {},
  loadingCreatingNewPlayerStatus: 'idle',
  loadingGettingTeamPlayersStatus: 'idle',
  loadingUpdatingPlayer: 'idle',
}

/**
 * Create a new player
 */
export const createNewPlayerThunk = createAsyncThunk<
  unknown,
  { data: PlayerFormData, teamId: string }
>('players/addPlayer', ({ data, teamId }, { rejectWithValue }) => {
  try {
    return addPlayer(data, teamId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in adding player')
  }
})

/**
 * Gets all players for a team
 */
export const getPlayersThunk = createAsyncThunk<
  PlayerDataResponse,
  { teamId: string }
>('players/getPlayers', async ({ teamId }, { rejectWithValue }) => {
  try {
    return await getPlayers(teamId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in getting players')
  }
})

/**
 * The thunk for updating player data
 */
export const updatePlayerThunk = createAsyncThunk<
  unknown,
  { data: PlayerFormData, playerId: string }
>('players/updatePlayer', ({ data, playerId }, { rejectWithValue }) => {
  try {
    return updatePlayer(data, playerId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in updating player')
  }
})

export const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewPlayerThunk.pending, state => {
        state.loadingCreatingNewPlayerStatus = 'pending'
      })
      .addCase(createNewPlayerThunk.fulfilled, state => {
        if (
          state.loadingCreatingNewPlayerStatus === 'pending'
        ) {
          state.loadingCreatingNewPlayerStatus = 'succeeded'
        }
      })
      .addCase(createNewPlayerThunk.rejected, (state, action) => {
        if (
          state.loadingCreatingNewPlayerStatus === 'pending'
        ) {
          state.loadingCreatingNewPlayerStatus = 'failed'
          console.error('Error creating new player', action.error)
        }
      })
      .addCase(getPlayersThunk.pending, state => {
        state.loadingGettingTeamPlayersStatus = 'pending'
      })
      .addCase(getPlayersThunk.fulfilled, (state, action) => {
        const { arg } = action.meta
        const { teamId } = arg
        state.loadingGettingTeamPlayersStatus = 'succeeded'

        if (action.payload) {
          state.players[teamId] = action.payload.results
        }
      })
      .addCase(getPlayersThunk.rejected, (state, action) => {
        if (
          state.loadingGettingTeamPlayersStatus === 'pending'
        ) {
          state.loadingGettingTeamPlayersStatus = 'failed'
          console.error('Error getting players', action.error)
        }
      })
      .addCase(updatePlayerThunk.pending, state => {
        state.loadingUpdatingPlayer = 'pending'
      })
      .addCase(updatePlayerThunk.fulfilled, state => {
        if (
          state.loadingUpdatingPlayer === 'pending'
        ) {
          state.loadingUpdatingPlayer = 'succeeded'
        }
      })
      .addCase(updatePlayerThunk.rejected, (state, action) => {
        if (
          state.loadingUpdatingPlayer === 'pending'
        ) {
          state.loadingUpdatingPlayer = 'failed'
          console.error('Error updating player', action.error)
        }
      })
  },
})

export const playersSelector = (state: RootState) => state.players

export const playersReducer = playersSlice.reducer

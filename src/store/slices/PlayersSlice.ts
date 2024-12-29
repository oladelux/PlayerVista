import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types'
import {
  addPlayer,
  ClientError, getPlayerById,
  getPlayersByTeamId, getPlayersByUserId, Player,
  PlayerDataResponse,
  PlayerFormData, updatePlayer,
} from '@/api'

type InitialPlayersState = {
  player: Player | null
  players: Player[]
  allPlayers: Player[]
  /**
   * The loading state of creating new player
   */
  loadingCreatingNewPlayerStatus: AsyncThunkLoading
  /**
   * The loading state of getting players for a team
   */
  loadingGettingTeamPlayersStatus: AsyncThunkLoading
  /**
   * The loading state of getting players for a team by user
   */
  loadingGettingTeamPlayersByUsersStatus: AsyncThunkLoading
  /**
   * The loading state of updating a player
   */
  loadingUpdatingPlayer: AsyncThunkLoading
  loadingGettingPlayerStatus: AsyncThunkLoading
}

const initialState: InitialPlayersState = {
  player: null,
  players: [],
  allPlayers: [],
  loadingCreatingNewPlayerStatus: 'idle',
  loadingGettingTeamPlayersStatus: 'idle',
  loadingGettingTeamPlayersByUsersStatus: 'idle',
  loadingUpdatingPlayer: 'idle',
  loadingGettingPlayerStatus: 'idle',
}

/**
 * Create a new player
 */
export const createNewPlayerThunk = createAsyncThunk<
  unknown,
  { data: PlayerFormData }
>('players/addPlayer', ({ data }, { rejectWithValue }) => {
  try {
    return addPlayer(data)
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
export const getPlayersByTeamIdThunk = createAsyncThunk<
  undefined | PlayerDataResponse,
  { teamId: string | undefined }
>('players/team', ({ teamId }) => {
  if(teamId)
    return getPlayersByTeamId(teamId)
})

/**
 * Gets all players for a user
 */
export const getPlayersByUserIdThunk = createAsyncThunk<
  undefined | PlayerDataResponse,
  { userId: string }
>('players/user', ({ userId }) => {
  return getPlayersByUserId(userId)
})

export const getPlayerByIdThunk = createAsyncThunk<
  undefined | Player,
  { id: string }
>('players/player', async ({ id }) => {
  return await getPlayerById(id)
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
  reducers: {
    clearPlayerState: (
      state,
    ) => {
      state.loadingUpdatingPlayer = 'idle'
      state.loadingCreatingNewPlayerStatus = 'idle'
      state.loadingGettingTeamPlayersStatus = 'idle'
      state.players = []
    },
  },
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
      .addCase(getPlayerByIdThunk.pending, state => {
        state.loadingGettingPlayerStatus = 'pending'
      })
      .addCase(getPlayerByIdThunk.fulfilled, (state, action) => {
        if (
          state.loadingGettingPlayerStatus === 'pending'
        )
          if (action.payload) {
            state.loadingGettingPlayerStatus = 'succeeded'
            state.player = action.payload
          }
      })
      .addCase(getPlayerByIdThunk.rejected, (state, action) => {
        if (
          state.loadingGettingPlayerStatus === 'pending'
        ) {
          state.loadingGettingPlayerStatus = 'failed'
          console.error('Error getting player', action.error)
        }
      })
      .addCase(getPlayersByTeamIdThunk.pending, state => {
        state.loadingGettingTeamPlayersStatus = 'pending'
        state.players = []
      })
      .addCase(getPlayersByTeamIdThunk.fulfilled, (state, action) => {
        if (
          state.loadingGettingTeamPlayersStatus === 'pending'
        )
          if (action.payload) {
            state.loadingCreatingNewPlayerStatus = 'succeeded'
            state.players = action.payload.data
          }
      })
      .addCase(getPlayersByTeamIdThunk.rejected, (state, action) => {
        if (
          state.loadingGettingTeamPlayersStatus === 'pending'
        ) {
          state.loadingGettingTeamPlayersStatus = 'failed'
          console.error('Error getting team players', action.error)
        }
      })
      .addCase(getPlayersByUserIdThunk.pending, state => {
        state.loadingGettingTeamPlayersByUsersStatus = 'pending'
        state.allPlayers = []
      })
      .addCase(getPlayersByUserIdThunk.fulfilled, (state, action) => {
        if (
          state.loadingGettingTeamPlayersByUsersStatus === 'pending'
        )
          if (action.payload) {
            state.loadingGettingTeamPlayersByUsersStatus = 'succeeded'
            state.allPlayers = action.payload.data
          }
      })
      .addCase(getPlayersByUserIdThunk.rejected, (state, action) => {
        if (
          state.loadingGettingTeamPlayersByUsersStatus === 'pending'
        ) {
          state.loadingGettingTeamPlayersByUsersStatus = 'failed'
          console.error('Error getting team players', action.error)
        }
      })
  },
})

export const {
  clearPlayerState,
} = playersSlice.actions

export const playersSelector = (state: RootState) => state.players

export const playersReducer = playersSlice.reducer

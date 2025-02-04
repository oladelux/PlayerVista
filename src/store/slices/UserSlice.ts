import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types'
import { AuthenticatedUserData, getAuthenticatedUser } from '@/api'

type InitialSettingsState = {
  user: Omit<AuthenticatedUserData, 'password'> | null
  loadingUserData: AsyncThunkLoading
}

// src/utils/omitPassword.ts
export function omitPassword(user: AuthenticatedUserData): Omit<AuthenticatedUserData, 'password'> {
  const { password, ...rest } = user
  return rest
}

const initialState: InitialSettingsState = {
  user: null,
  loadingUserData: 'idle',
}

export const getUserDataThunk = createAsyncThunk<
  AuthenticatedUserData,
  void
>('user/get-data', async () => {
  return await getAuthenticatedUser()
})

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Omit<AuthenticatedUserData, 'password'>>) {
      state.user = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUserDataThunk.pending, state => {
        state.loadingUserData = 'pending'
      })
      .addCase(getUserDataThunk.fulfilled, (state, action) => {
        if (
          state.loadingUserData === 'pending'
        ) {
          state.loadingUserData = 'succeeded'
          if (action.payload) {
            state.user = omitPassword(action.payload)
          }
        }
      })
      .addCase(getUserDataThunk.rejected, state => {
        if (
          state.loadingUserData === 'pending'
        ) {
          state.loadingUserData = 'failed'
        }
      })
  },
})

export const { setUser } = UserSlice.actions

export const userSelector = (state: RootState) => state.user
export const userReducer = UserSlice.reducer

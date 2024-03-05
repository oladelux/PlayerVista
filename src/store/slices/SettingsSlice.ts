import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../types'

type InitialSettingsState = {
  activeTeamId: string
}

const initialState: InitialSettingsState = {
  activeTeamId: '',
}

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
  extraReducers: (builder) => {},
})

export const {
  setActiveTeamId,
} = settingsSlice.actions

export const settingsSelector = (state: RootState) => state.settings

export const settingsReducer = settingsSlice.reducer

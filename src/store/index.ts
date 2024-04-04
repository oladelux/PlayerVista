import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { playersReducer } from './slices/PlayersSlice'
import { settingsReducer } from './slices/SettingsSlice'
import { teamReducer } from './slices/TeamSlice'
import { eventsReducer } from './slices/EventsSlice.ts'

export const rootReducer = combineReducers({
  players: playersReducer,
  settings: settingsReducer,
  teams: teamReducer,
  events: eventsReducer,
})

export const setupStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {},
    }),
})

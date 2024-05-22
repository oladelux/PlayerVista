import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { playersReducer } from './slices/PlayersSlice'
import { settingsReducer } from './slices/SettingsSlice'
import { teamReducer } from './slices/TeamSlice'
import { eventsReducer } from './slices/EventsSlice.ts'
import { staffReducer } from './slices/StaffSlice.ts'
import { reporterReducer } from './slices/ReporterSlice.ts'
import { playerPerformanceReducer } from './slices/PlayerPerformanceSlice.ts'

export const rootReducer = combineReducers({
  players: playersReducer,
  settings: settingsReducer,
  teams: teamReducer,
  events: eventsReducer,
  staffs: staffReducer,
  reporters: reporterReducer,
  playerPerformance: playerPerformanceReducer,
})

export const setupStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {},
    }),
})

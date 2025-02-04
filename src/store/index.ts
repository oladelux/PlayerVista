import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { eventsReducer } from './slices/EventsSlice.ts'
import { playerPerformanceReducer } from './slices/PlayerPerformanceSlice.ts'
import { playersReducer } from './slices/PlayersSlice'
import { reporterReducer } from './slices/ReporterSlice.ts'
import { settingsReducer } from './slices/SettingsSlice'
import { staffReducer } from './slices/StaffSlice.ts'
import { teamReducer } from './slices/TeamSlice'
import { userReducer } from '@/store/slices/UserSlice.ts'

export const rootReducer = combineReducers({
  players: playersReducer,
  user: userReducer,
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

import { useSelector } from 'react-redux'
import { eventsSelector } from '@/store/slices/EventsSlice.ts'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import { teamSelector } from '@/store/slices/TeamSlice.ts'

const { loadingGettingLogs } = useSelector(settingsSelector)
const { loadingGettingTeam } = useSelector(teamSelector)

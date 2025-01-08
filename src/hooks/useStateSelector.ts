import { useSelector } from 'react-redux'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import { teamSelector } from '@/store/slices/TeamSlice.ts'

export const useStateSelector = () => {
  const { loadingGettingLogs } = useSelector(settingsSelector)
  const { loadingGettingTeam } = useSelector(teamSelector)

  const stateIsLoading = loadingGettingLogs === 'pending' || loadingGettingTeam === 'pending'

  return {
    stateIsLoading,
  }
}

import { LocalSessionType } from '@/utils/LocalSessionType.ts'

export const setCurrentTeam =(teamId: string) => localStorage.setItem('currentTeam', teamId)
export const getCurrentTeam = () => localStorage.getItem('currentTeam') || ''
export const clearLocalStorage = () => localStorage.clear()
export const setLocalSession = (session: Partial<LocalSessionType>) => localStorage.setItem('localSession', JSON.stringify(session))
export const getLocalSession = async (): Promise<LocalSessionType | null> => {
  const session = localStorage.getItem('localSession')
  if (!session) return null
  return JSON.parse(session)
}

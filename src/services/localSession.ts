import { LocalSessionType } from '@/utils/LocalSessionType.ts'
import { getLocalSession, setLocalSession } from '@/utils/localStorage.ts'

export const toLocalSession = (data: Partial<LocalSessionType>) => {
  setLocalSession(data)
}

export const fromLocalSession = (): LocalSessionType | null => {
  const session = getLocalSession()
  if (!session) return null
  return session
}

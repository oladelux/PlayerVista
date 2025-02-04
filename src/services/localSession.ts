import { LocalSessionType } from '@/utils/LocalSessionType.ts'
import { setLocalSession } from '@/utils/localStorage.ts'

export const toLocalSession = (data: Partial<LocalSessionType>) => {
  setLocalSession(data)
}

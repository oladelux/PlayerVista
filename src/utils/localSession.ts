import { LocalSessionType } from '@/utils/LocalSessionType.ts'
import { SessionInstance } from '@/utils/SessionInstance.ts'

export const toLocalSession = async (session: Partial<LocalSessionType>) => {
  const existingSession = await getLocalSession()
  const newSession = { ...existingSession, ...session }
  localStorage.setItem('localSession', JSON.stringify(newSession))
  SessionInstance.setInstance(newSession as LocalSessionType)
  return newSession
}

export const getLocalSession = async () => {
  const session = localStorage.getItem('localSession')
  if (!session) return undefined
  const localSession: LocalSessionType = JSON.parse(session)
  SessionInstance.setInstance(localSession)
  return localSession
}

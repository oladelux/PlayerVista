import * as api from '../api'
import { UpdateType } from '../api'
import { useUser } from './useUser.ts'

export type UseUpdates = ReturnType<typeof useUpdates>

export function useUpdates () {
  const user = useUser()
  let updateLog: UpdateType | undefined

  async function sendUpdates() {
    if(updateLog) {
      const username = await user.getUserName(updateLog.userId)
      const data: UpdateType = {
        userId: username,
        message: updateLog.message,
        date: new Date(),
      }
      return api.sendLog(data)
    }
  }

  return {
    sendUpdates,
    setUpdate(logParam: UpdateType) {
      updateLog = logParam
    },
  }
}

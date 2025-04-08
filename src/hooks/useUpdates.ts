import * as api from '../api'
import { UpdateType } from '../api'

export type UseUpdates = ReturnType<typeof useUpdates>

export function useUpdates() {
  let updateLog: UpdateType | undefined

  async function sendUpdates(groupId: string) {
    if (updateLog) {
      // TODO: There is no need to make additional request, you can get user data from redux
      // TODO: Add user data to redux store
      const data: UpdateType = {
        userId: updateLog.userId,
        groupId: groupId,
        message: updateLog.message,
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

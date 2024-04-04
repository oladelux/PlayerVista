import * as api from '../api'
import { UpdateType } from '../api'
import { useUser } from './useUser.ts'

export type UseUpdates = ReturnType<typeof useUpdates>

export function useUpdates () {
  const user = useUser()
  let updateLog: UpdateType | undefined

  async function sendUpdates(groupId: string) {
    if(updateLog) {
      // TODO: There is no need to make additional request, you can get user data from redux
      // TODO: Add user data to redux store
      const username = await user.getUserName(updateLog.userId)
      const data: UpdateType = {
        userId: username,
        groupId: groupId,
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

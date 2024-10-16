import { LogType } from '../api'

export function sortApplicationLogs(data: LogType[]): LogType[] {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()

    return dateB - dateA
  })
}

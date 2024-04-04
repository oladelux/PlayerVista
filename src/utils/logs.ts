import { LogType } from '../api'

export function sortApplicationLogs(data: LogType[]): LogType[] {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()

    return dateB - dateA
  })
}

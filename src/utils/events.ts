import { CalenderEvents } from '../constants/events.ts'

const today = new Date()
type EventType = 'match' | 'training'

export const filterEventsByMonth = (
  data: CalenderEvents[],
  eventType: EventType,
  targetMonth: number,
) => {
  const targetDate = new Date(today.getFullYear(), targetMonth, 1)

  return data.filter(event => {
    const eventDate = new Date(event.start)
    return eventDate.getMonth() === targetDate.getMonth() && event.title === eventType
  })
}

type EventTrendResponse = {
  trendPercentage: number
  positiveTrend: boolean
}

export const eventTrend = (
  thisMonthEvents: CalenderEvents[],
  lastMonthEvents: CalenderEvents[],
): EventTrendResponse | null => {
  if (thisMonthEvents.length === 0 || lastMonthEvents.length === 0) {
    return null
  } else {
    const trendPercentage =
      ((thisMonthEvents.length - lastMonthEvents.length) / Math.abs(lastMonthEvents.length)) * 100
    return {
      trendPercentage,
      positiveTrend: trendPercentage > 0,
    }
  }
}

import { getCookie } from './cookies'

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const getTodayDate = () => {
  const currentDate = new Date()
  const day = String(currentDate.getDate()).padStart(2, '0')
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const year = currentDate.getFullYear()

  return `${month}/${day}/${year}`
}

export const formattedTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}

export function renderUpcomingFixtureDate(dateString: Date): string {
  // Parse the date string considering the timezone information (Z for UTC)
  const parsedDate = new Date(dateString)

  // Adjust the hours to reflect the desired 12-hour format with noon indicator
  parsedDate.setHours(parsedDate.getHours() + (parsedDate.getHours() >= 12 ? -12 : 0))

  // Format the date according to the desired output
  return parsedDate.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export function calculateAge(birthDate: Date): number {
  const birthDateObj = new Date(birthDate)
  const today = new Date()
  // Calculate the difference in years
  let age = today.getFullYear() - birthDateObj.getFullYear()
  // Adjust for months and days if the current date is before the birthday of the current year
  if (today.getMonth() < birthDateObj.getMonth()
    || (today.getMonth() === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
    age--
  }
  return age
}

export function isAccessToken(): boolean {
  const accessToken = getCookie('access-token')
  return !!accessToken
}

// Create a new Date object with combined values
export const combinedDate = (date: Date, time: string) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    parseInt(time.slice(0, 2)),
    parseInt(time.slice(3, 5)),
    parseInt(time.slice(6, 8)),
  )
}

export function convertToCalenderDate(dateStr: Date) {
// Extract year, month, and day from the parsed date
  const year = new Date(dateStr).getUTCFullYear()
  const month = new Date(dateStr).getUTCMonth()
  const day = new Date(dateStr).getUTCDate()
  const hour = new Date(dateStr).getHours()
  const minutes = new Date(dateStr).getMinutes()
  const seconds = new Date(dateStr).getSeconds()

  return new Date(year, month, day, hour, minutes, seconds)
}

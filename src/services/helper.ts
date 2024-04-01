import {getCookie} from './cookies'

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function convertToDate(dateStr: string): Date {
  // Split the date string into components (day, month, year)
  const [day, month, year] = dateStr.split('.') as [string, string, string]

  // Create a Date object using the numeric values
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
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
    parseInt(time.slice(6, 8))
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

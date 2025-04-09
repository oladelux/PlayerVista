/**
 * Combines a Date object and a time string into a single Date object
 * @param {Date} dateInput - The date object (year, month, day)
 * @param {string} time - Time in format "HH:MM" (24-hour format)
 * @returns {Date} A new Date object with the combined date and time
 */
export function combineDateAndTime(dateInput: Date, time: string): Date {
  const date = new Date(dateInput)
  // Validate inputs
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date object')
  }

  // Support both HH:MM:SS and HH:MM formats
  if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(time)) {
    throw new Error('Time string must be in format "HH:MM" or "HH:MM:SS"')
  }

  // Split the time string
  const timeParts = time.split(':').map(Number)
  const hours = timeParts[0]
  const minutes = timeParts[1]
  const seconds = timeParts[2] || 0 // Default to 0 if seconds not provided

  // Validate components
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    throw new Error('Invalid time: hours must be 0-23, minutes and seconds must be 0-59')
  }

  // Create a new date object to avoid modifying the original
  const combinedDate = new Date(date)

  // Set the time components
  combinedDate.setHours(hours, minutes, 0, 0)

  return combinedDate
}

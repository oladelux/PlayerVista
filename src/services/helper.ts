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

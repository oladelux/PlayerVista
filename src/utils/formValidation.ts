import { DateTime } from 'luxon'
import { z } from 'zod'

export const dateInputValidation = z
  .string()
  .refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  })

export function toDateFormValue(
  value: Date | undefined | null,
): string | '' | undefined {
  if (value) {
    try {
      return DateTime.fromJSDate(value).toFormat('yyyy-MM-dd')
    } catch (e) {
      console.error(`Failed to parse date: ${value}: '${e}'`)
      return undefined
    }
  }
  return undefined
}

import { z } from 'zod'

export const eventSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
  info: z.string().optional(),
  eventLocation: z.string(),
  opponent: z.string(),
})

export type EventSchemaIn = Partial<z.input<typeof eventSchema>>
export type EventSchemaOut = z.output<typeof eventSchema>

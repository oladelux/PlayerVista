import { z } from 'zod'

export const staffSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.string(),
  isEmailVerified: z.boolean(),
})

export type StaffSchemaIn = Partial<z.input<typeof staffSchema>>
export type StaffSchemaOut = z.output<typeof staffSchema>

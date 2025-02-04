import { z } from 'zod'

import { dateInputValidation } from '@/utils/formValidation.ts'
import { PlayerPositionType } from '@/views/PlayersView/form/PlayerPosition.ts'

export const playerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  uniformNumber: z.coerce.number().int().min(1),
  street: z.string().optional(),
  city: z.string().optional(),
  postCode: z.string().optional(),
  country: z.string().optional(),
  birthDate: dateInputValidation,
  position: z.nativeEnum(PlayerPositionType),
  contactPersonFirstName: z.string().optional(),
  contactPersonLastName: z.string().optional(),
  contactPersonPhoneNumber: z.string().optional(),
  contactPersonStreet: z.string().optional(),
  contactPersonCity: z.string().optional(),
  contactPersonPostCode: z.string().optional(),
  contactPersonCountry: z.string().optional(),
  teamCaptain: z.boolean().default(false),
})

export type PlayerSchemaIn = Partial<z.input<typeof playerSchema>>
export type PlayerSchemaOut = z.output<typeof playerSchema>

import { z } from 'zod'

import { PlayerPositionType } from '@/views/PlayersView/form/PlayerPosition.ts'

export const playerSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  birthDate: z.date({ required_error: 'Please select a date of birth.' }),
  preferredFoot: z.string().min(1, { message: 'Please select a preferred foot.' }),
  height: z.string().min(1, { message: 'Please enter a valid height.' }),
  weight: z.string().min(1, { message: 'Please enter a valid weight.' }),
  nationality: z.string().min(1, { message: 'Please enter a valid nationality.' }),
  isTeamCaptain: z.boolean().default(false),

  // Address
  street: z.string().min(2, { message: 'Street is required.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  postCode: z.string().min(2, { message: 'Post code is required.' }),
  country: z.string().min(2, { message: 'Country is required.' }),

  // Player Details
  position: z.nativeEnum(PlayerPositionType, { required_error: 'Please select a position.' }),
  uniformNumber: z.string().min(1, { message: 'Uniform number is required.' }),

  // Contact Person
  contactPersonFirstName: z.string().optional(),
  contactPersonLastName: z.string().optional(),
  contactPersonPhoneNumber: z.string().optional(),
  contactPersonStreet: z.string().optional(),
  contactPersonCity: z.string().optional(),
  contactPersonPostCode: z.string().optional(),
  contactPersonCountry: z.string().optional(),
})

export type PlayerSchemaIn = Partial<z.input<typeof playerSchema>>
export type PlayerSchemaOut = z.output<typeof playerSchema>

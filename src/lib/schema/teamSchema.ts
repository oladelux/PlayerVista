import { z } from 'zod'

export const teamFormSchema = z.object({
  // Team Info
  teamName: z.string().min(1, 'Team name is required'),
  creationYear: z.string().min(1, 'Year of establishment is required'),
  teamGender: z.string().min(1, 'Team gender is required'),
  ageGroup: z.string().min(1, 'Age group is required'),
  logo: z.string().optional(),

  // Team Personnel
  headCoach: z.string().min(1, 'Head coach name is required'),
  headCoachContact: z.string().min(1, 'Head coach contact is required'),
  assistantCoach: z.string().optional(),
  assistantCoachContact: z.string().optional(),
  medicalPersonnel: z.string().optional(),
  medicalPersonnelContact: z.string().optional(),
  kitManager: z.string().optional(),
  kitManagerContact: z.string().optional(),
  mediaManager: z.string().optional(),
  mediaManagerContact: z.string().optional(),
  logisticsCoordinator: z.string().optional(),
  logisticsCoordinatorContact: z.string().optional(),

  // Team Location
  stadiumName: z.string().min(1, 'Stadium name is required'),
  street: z.string().min(1, 'Street is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
})

export type TeamFormValues = z.infer<typeof teamFormSchema>

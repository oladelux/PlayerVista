import { z } from 'zod'

export const teamSchema = z.object({
  teamName: z.string(),
  establishmentYear: z.string(),
  teamGender: z.string(),
  ageGroup: z.string(),
  headCoach: z.string(),
  headCoachContact: z.string(),
  assistantCoach: z.string(),
  assistantCoachContact: z.string(),
  medicalPersonnel: z.string(),
  medicalPersonnelContact: z.string(),
  kitManager: z.string(),
  kitManagerContact: z.string(),
  mediaManager: z.string(),
  mediaManagerContact: z.string(),
  logisticsCoordinator: z.string(),
  logisticsCoordinatorContact: z.string(),
  stadiumName: z.string(),
  stadiumLocationStreet: z.string(),
  stadiumLocationPostalCode: z.string(),
  stadiumLocationCity: z.string(),
  stadiumLocationCountry: z.string(),
})

export type TeamSchemaIn = Partial<z.input<typeof teamSchema>>
export type TeamSchemaOut = z.output<typeof teamSchema>

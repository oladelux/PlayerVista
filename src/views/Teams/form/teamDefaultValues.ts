import { TeamResponse } from '@/api'

export function getTeamDefaultValues(team: TeamResponse | null) {
  return {
    teamName: team?.teamName,
    establishmentYear: team ? new Date(team.creationYear).getFullYear() : '',
    teamGender: team?.teamGender,
    ageGroup: team?.ageGroup,
    headCoach: team?.headCoach,
    headCoachContact: team?.headCoachContact,
    assistantCoach: team?.assistantCoach,
    assistantCoachContact: team?.assistantCoachContact,
    medicalPersonnel: team?.medicalPersonnel,
    medicalPersonnelContact: team?.medicalPersonnelContact,
    kitManager: team?.kitManager,
    kitManagerContact: team?.kitManagerContact,
    mediaManager: team?.mediaManager,
    mediaManagerContact: team?.mediaManagerContact,
    logisticsCoordinator: team?.logisticsCoordinator,
    logisticsCoordinatorContact: team?.logisticsCoordinatorContact,
    stadiumName: team?.stadiumName,
    stadiumLocationStreet: team?.street,
    stadiumLocationPostalCode: team?.postcode,
    stadiumLocationCity: team?.city,
    stadiumLocationCountry: team?.country,
  }
}

import { Player } from '@/api'
import { PlayerPositionType } from '@/views/PlayersView/form/PlayerPosition.ts'
import { PlayerSchemaOut } from '@/views/PlayersView/form/playerSchema.ts'

export function getPlayerDefaultValues(player: Player): PlayerSchemaOut {
  return {
    firstName: player.firstName,
    lastName: player.lastName,
    email: player.email,
    phoneNumber: player.phoneNumber ?? undefined,
    uniformNumber: player.uniformNumber.toString(),
    street: player.street ?? undefined,
    city: player.city ?? undefined,
    postCode: player.postCode ?? undefined,
    country: player.country ?? undefined,
    birthDate: new Date(player.birthDate),
    position: player.position as PlayerPositionType,
    contactPersonFirstName: player.contactPersonFirstName ?? undefined,
    contactPersonLastName: player.contactPersonLastName ?? undefined,
    contactPersonPhoneNumber: player.contactPersonPhoneNumber ?? undefined,
    contactPersonStreet: player.contactPersonStreet ?? undefined,
    contactPersonCity: player.contactPersonCity ?? undefined,
    contactPersonPostCode: player.contactPersonPostCode ?? undefined,
    contactPersonCountry: player.contactPersonCountry ?? undefined,
    teamCaptain: player.teamCaptain,
    preferredFoot: player.preferredFoot,
    height: player.height.toString(),
    weight: player.weight.toString(),
    nationality: player.nationality,
  }
}

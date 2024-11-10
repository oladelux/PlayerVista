import { PermissionsType } from '@/api'

export const AllPermissions: PermissionsType = [
  'create_roles',
  'manage_roles',
  'create_team',
  'manage_teams',
  'create_players',
  'manage_players',
  'create_staffs',
  'manage_staffs',
  'create_event',
  'manage_events',
]

export enum PermissionEnum {
  CREATE_TEAM = 'create_team',
  MANAGE_TEAMS = 'manage_teams',
  CREATE_PLAYERS = 'create_players',
  MANAGE_PLAYERS = 'manage_players',
  CREATE_STAFFS = 'create_staffs',
  MANAGE_STAFFS = 'manage_staffs',
  CREATE_ROLES = 'create_roles',
  MANAGE_ROLES = 'manage_roles',
  CREATE_EVENT = 'create_event',
  MANAGE_EVENTS = 'manage_events',
}

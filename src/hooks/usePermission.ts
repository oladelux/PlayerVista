import { useSelector } from 'react-redux'

import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import { PermissionEnum } from '@/utils/allPermissions.ts'

export const usePermission = (role: string) => {
  const { roles } = useSelector(settingsSelector)
  const userRole = roles.find((r) => r.name === role)

  if(!userRole)
    return {
      canCreateTeam: false,
      canCreateEvent: false,
      canCreateStaff: false,
      canCreatePlayer: false,
      canCreateRole: false,
      canManageTeam: false,
      canManageEvent: false,
      canManageStaff: false,
      canManagePlayer: false,
      canManageRole: false,
    }

  const canCreateTeam = userRole.permissions.includes(PermissionEnum.CREATE_TEAM)
  const canCreateEvent = userRole.permissions.includes(PermissionEnum.CREATE_EVENT)
  const canCreateStaff = userRole.permissions.includes(PermissionEnum.CREATE_STAFFS)
  const canCreatePlayer = userRole.permissions.includes(PermissionEnum.CREATE_PLAYERS)
  const canCreateRole = userRole.permissions.includes(PermissionEnum.CREATE_ROLES)
  const canManageTeam = userRole.permissions.includes(PermissionEnum.MANAGE_TEAMS)
  const canManageEvent = userRole.permissions.includes(PermissionEnum.MANAGE_EVENTS)
  const canManageStaff = userRole.permissions.includes(PermissionEnum.MANAGE_STAFFS)
  const canManagePlayer = userRole.permissions.includes(PermissionEnum.MANAGE_PLAYERS)
  const canManageRole = userRole.permissions.includes(PermissionEnum.MANAGE_ROLES)

  return {
    canCreateTeam,
    canCreateEvent,
    canCreateStaff,
    canCreatePlayer,
    canCreateRole,
    canManageTeam,
    canManageEvent,
    canManageStaff,
    canManagePlayer,
    canManageRole,
  }

}

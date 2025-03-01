import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types'
import {
  getLogs,
  LogType,
  LogsResponse,
  RolesResponse,
  getRolesAndPermissions,
  ClientError,
  Roles,
  updateRolePermissions, RoleFormData, createRole,
} from '@/api'

type InitialSettingsState = {
  activeTeamId: string,
  userRole: string,
  userId: string,
  logs: LogType[],
  roles: Roles[]
  /**
   * The loading state of getting logs
   */
  loadingGettingLogs: AsyncThunkLoading
  loadingGettingRoles: AsyncThunkLoading
  loadingUpdatingRolePermissions: AsyncThunkLoading
  loadingCreatingRoleStatus: AsyncThunkLoading
}

const initialState: InitialSettingsState = {
  activeTeamId: '',
  userRole: '',
  userId: '',
  logs: [],
  roles: [],
  loadingGettingLogs: 'idle',
  loadingGettingRoles: 'idle',
  loadingUpdatingRolePermissions: 'idle',
  loadingCreatingRoleStatus: 'idle',
}

/**
 * Gets the application logs
 */
export const getApplicationLogsThunk = createAsyncThunk<
  undefined | LogsResponse,
  { groupId: string }
>('settings/logs', async ({ groupId }) => {
  return await getLogs(groupId)
})

export const createRoleThunk = createAsyncThunk<
  unknown,
  { data: RoleFormData }
>('settings/create-role', ({ data }) => {
  try {
    return createRole(data)
  } catch (e) {
    if (e instanceof ClientError) {
      return e.message
    }
    return 'Unexpected error in creating a new role'
  }
})

/**
 * Gets all roles for a group
 */
export const getRolesByGroupIdThunk = createAsyncThunk<
  RolesResponse,
  { groupId: string }
>('settings/get-roles-by-groupId', async ({ groupId }, { rejectWithValue }) => {
  try {
    return await getRolesAndPermissions(groupId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in getting roles')
  }
})

export const updateRolePermissionsThunk = createAsyncThunk<
  unknown,
  { roleId: string, updatedPermissions: string[] }
>('settings/update-role', ({ roleId, updatedPermissions }) => {
  try {
    return updateRolePermissions(roleId, updatedPermissions)
  } catch (e) {
    if (e instanceof ClientError) {
      return e.message
    }
    return 'Unexpected error in update role permissions'
  }
})

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setActiveTeamId: (
      state,
      action: PayloadAction<{ teamId: string }>,
    ) => {
      const { teamId } = action.payload
      state.activeTeamId = teamId
    },
    setUserRole: (
      state,
      action: PayloadAction<{ role: string }>,
    ) => {
      const { role } = action.payload
      state.userRole = role
    },
    setUserId: (
      state,
      action: PayloadAction<{ id: string }>,
    ) => {
      const { id } = action.payload
      state.userId = id
    },
    clearSettingsState: (
      state,
    ) => {
      state.logs = []
      state.activeTeamId = ''
      state.userRole = ''
      state.userId = ''
      state.loadingGettingLogs = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationLogsThunk.pending, state => {
        state.loadingGettingLogs = 'pending'
      })
      .addCase(getApplicationLogsThunk.fulfilled, (state, action) => {
        if (
          state.loadingGettingLogs === 'pending'
        ) {
          state.loadingGettingLogs = 'succeeded'
          if (action.payload) {
            state.logs = action.payload.data
          }
        }
      })
      .addCase(getApplicationLogsThunk.rejected, (state, action) => {
        if (
          state.loadingGettingLogs === 'pending'
        ) {
          state.loadingGettingLogs = 'failed'
          console.error('Error getting logs', action.error)
        }
      })
      .addCase(createRoleThunk.pending, state => {
        state.loadingCreatingRoleStatus = 'pending'
      })
      .addCase(createRoleThunk.fulfilled, state => {
        state.loadingCreatingRoleStatus = 'succeeded'
      })
      .addCase(createRoleThunk.rejected, (state, action) => {
        if (
          state.loadingCreatingRoleStatus === 'pending'
        ) {
          state.loadingCreatingRoleStatus = 'failed'
          console.error('Error creating new role', action.error)
        }
      })
      .addCase(getRolesByGroupIdThunk.pending, state => {
        state.loadingGettingRoles = 'pending'
      })
      .addCase(getRolesByGroupIdThunk.fulfilled, (state, action) => {
        state.loadingGettingRoles = 'succeeded'

        if (action.payload) {
          state.roles = action.payload.data
        }
      })
      .addCase(getRolesByGroupIdThunk.rejected, (state, action) => {
        if (
          state.loadingGettingRoles === 'pending'
        ) {
          state.loadingGettingRoles = 'failed'
          console.error('Error getting roles', action.error)
        }
      })
      .addCase(updateRolePermissionsThunk.pending, state => {
        state.loadingUpdatingRolePermissions = 'pending'
      })
      .addCase(updateRolePermissionsThunk.fulfilled, state => {
        state.loadingUpdatingRolePermissions = 'succeeded'
      })
      .addCase(updateRolePermissionsThunk.rejected, (state, action) => {
        if (
          state.loadingUpdatingRolePermissions === 'pending'
        ) {
          state.loadingUpdatingRolePermissions = 'failed'
          console.error('Error updating role permissions', action.error)
        }
      })
  },
})

export const {
  setActiveTeamId,
  setUserRole,
  setUserId,
  clearSettingsState,
} = settingsSlice.actions

export const settingsSelector = (state: RootState) => state.settings
export const settingsReducer = settingsSlice.reducer

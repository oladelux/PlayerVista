import { BehaviorSubject, from } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import {
  createRole,
  getRolesAndPermissions,
  RoleFormData,
  Roles,
  updateRolePermissions,
} from '@/api'

type RoleState = {
  roles: Roles[]
  loading: boolean
  error: string | undefined
}

export class RoleService {
  private roleSubject = new BehaviorSubject<RoleState>({
    roles: [],
    loading: false,
    error: undefined,
  })

  public role$ = this.roleSubject.asObservable()

  private get currentState() {
    return this.roleSubject.getValue()
  }

  private updateState(newState: Partial<RoleState>) {
    this.roleSubject.next({ ...this.currentState, ...newState })
  }

  public getRolesByGroupId(groupId: string | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!groupId) {
      this.updateState({ roles: [], loading: false, error: 'No groupId found' })
      return
    }
    from(getRolesAndPermissions(groupId))
      .pipe(
        map(xResponse => {
          this.updateState({ roles: xResponse.data, loading: false })
        }),
        catchError(e => {
          this.updateState({ roles: [], loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public async insert(data: RoleFormData) {
    this.updateState({ loading: true, error: undefined })
    from(createRole(data))
      .pipe(
        map(() => {
          this.updateState({ loading: false })
          this.getRolesByGroupId(data.groupId)
        }),
        catchError(e => {
          this.updateState({ loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public async patch(roleId: string, updatedPermissions: string[], groupId: string) {
    this.updateState({ loading: true, error: undefined })
    from(updateRolePermissions(roleId, updatedPermissions))
      .pipe(
        map(() => {
          this.updateState({ loading: false })
          this.getRolesByGroupId(groupId)
        }),
        catchError(e => {
          this.updateState({ loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }
}

import { BehaviorSubject, from } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { getStaffs, getUserDetails, Staff, UserDetailsResponse } from '@/api'

type StaffState = {
  staffs: Staff[]
  staff: UserDetailsResponse | null
  loading: boolean
  error: string | undefined
}

export class StaffService {
  private staffSubject = new BehaviorSubject<StaffState>({
    staffs: [],
    staff: null,
    loading: false,
    error: undefined,
  })

  public staff$ = this.staffSubject.asObservable()

  private get currentState() {
    return this.staffSubject.getValue()
  }

  private updateState(newState: Partial<StaffState>) {
    this.staffSubject.next({ ...this.currentState, ...newState })
  }

  public getStaffs(groupId: string | null | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!groupId) {
      this.updateState({ staffs: [], loading: false, error: 'No group id found' })
      return
    }
    from(getStaffs(groupId))
      .pipe(
        map(xResponse => {
          this.updateState({ staffs: xResponse.data, loading: false })
        }),
        catchError(e => {
          this.updateState({ staffs: [], loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public getStaff(userId: string | null | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!userId) {
      this.updateState({ staff: null, loading: false, error: 'No staff found' })
      return
    }
    from(getUserDetails(userId))
      .pipe(
        map(xResponse => {
          this.updateState({ staff: xResponse, loading: false })
        }),
        catchError(e => {
          this.updateState({ staff: null, loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }
}

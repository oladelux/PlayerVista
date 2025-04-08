import { BehaviorSubject, from } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

import { getLogs, LogType } from '@/api'
import { appService } from '@/singletons'

type LogState = {
  logs: LogType[]
  loading: boolean
  error: string | undefined
}

export class LogService {
  private logSubject = new BehaviorSubject<LogState>({
    logs: [],
    loading: false,
    error: undefined,
  })

  public log$ = this.logSubject.asObservable()

  private get currentState() {
    return this.logSubject.getValue()
  }

  private updateState(newState: Partial<LogState>) {
    this.logSubject.next({ ...this.currentState, ...newState })
  }

  public getLogs() {
    this.updateState({ loading: true, error: undefined })
    const userData = appService.getUserData()
    if (!userData) {
      this.updateState({ logs: [], loading: false, error: 'No user found' })
      return
    }
    from(getLogs(userData.groupId))
      .pipe(
        map(xResponse => {
          this.updateState({ logs: xResponse.data, loading: false })
        }),
        catchError(e => {
          this.updateState({ logs: [], loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }
}

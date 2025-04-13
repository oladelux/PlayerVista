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
    const allLogs: LogType[] = []
    const fetchPage = (currentPage: number = 1, limit: number = 5) => {
      from(getLogs(userData.groupId, currentPage, limit))
        .pipe(
          map(xResponse => {
            allLogs.push(...xResponse.data)
            if (xResponse.hasNextPage) {
              fetchPage(currentPage + 1, limit)
            } else {
              this.updateState({ logs: allLogs, loading: false })
            }
          }),
          catchError(e => {
            this.updateState({ logs: [], loading: false, error: e.message })
            return []
          }),
        )
        .subscribe()
    }
    fetchPage(1)
  }
}

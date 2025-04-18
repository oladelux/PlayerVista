import { BehaviorSubject, from } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import {
  getPerformanceByEvent,
  getPerformanceByEventAndPlayer,
  getPerformancesByTeamId,
  getPerformancesForPlayer,
  PlayerPerformance,
} from '@/api'

type PerformanceState = {
  performanceByPlayer: PlayerPerformance[]
  performanceByEventAndPlayer: PlayerPerformance | null
  performanceByEvent: PlayerPerformance[]
  performanceByTeam: PlayerPerformance[]
  loading: boolean
  error: string | undefined
}

export class PerformanceService {
  private performanceSubject = new BehaviorSubject<PerformanceState>({
    performanceByPlayer: [],
    performanceByEventAndPlayer: null,
    performanceByEvent: [],
    performanceByTeam: [],
    loading: false,
    error: undefined,
  })

  public performance$ = this.performanceSubject.asObservable()

  private get currentState() {
    return this.performanceSubject.getValue()
  }

  private updateState(newState: Partial<PerformanceState>) {
    this.performanceSubject.next({ ...this.currentState, ...newState })
  }

  public getPerformanceByPlayerId(playerId: string | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!playerId) {
      this.updateState({ performanceByPlayer: [], loading: false, error: 'No player found' })
      return
    }
    from(getPerformancesForPlayer(playerId))
      .pipe(
        map(xResponse => {
          this.updateState({ performanceByPlayer: xResponse.data, loading: false })
        }),
        catchError(e => {
          this.updateState({ performanceByPlayer: [], loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public getPerformanceByEventAndPlayer(eventId: string | undefined, playerId: string | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!eventId || !playerId) {
      this.updateState({
        performanceByEventAndPlayer: null,
        loading: false,
        error: 'No player or event found',
      })
      return
    }
    from(getPerformanceByEventAndPlayer(eventId, playerId))
      .pipe(
        map(xResponse => {
          this.updateState({ performanceByEventAndPlayer: xResponse, loading: false })
        }),
        catchError(e => {
          this.updateState({ performanceByEventAndPlayer: null, loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public getPerformanceByEventId(eventId: string | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!eventId) {
      this.updateState({ performanceByEvent: [], loading: false, error: 'No event found' })
      return
    }
    from(getPerformanceByEvent(eventId))
      .pipe(
        map(xResponse => {
          this.updateState({ performanceByEvent: xResponse, loading: false })
        }),
        catchError(e => {
          this.updateState({ performanceByEvent: [], loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public getAllPerformanceByTeam(teamId: string | null | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!teamId) {
      this.updateState({ performanceByTeam: [], loading: false, error: 'No active user' })
      return
    }
    const allPerformance: PlayerPerformance[] = []
    const fetchPage = (currentPage: number = 1, limit: number = 10) => {
      from(getPerformancesByTeamId(teamId, currentPage, limit))
        .pipe(
          map(xResponse => {
            allPerformance.push(...xResponse.data)
            if (xResponse.hasNextPage) {
              fetchPage(currentPage + 1, limit)
            } else {
              this.updateState({ performanceByTeam: allPerformance, loading: false })
            }
          }),
          catchError(e => {
            this.updateState({ performanceByTeam: [], loading: false, error: e.message })
            return []
          }),
        )
        .subscribe()
    }
    fetchPage(1)
  }
}

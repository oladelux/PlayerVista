import { BehaviorSubject, from } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { Event, SingleEventType, getEventsByTeamId, getSingleEvent } from '@/api'

type EventState = {
  events: Event[]
  event: SingleEventType | null
  loading: boolean
  error: string | undefined
}

export class EventService {
  private eventSubject = new BehaviorSubject<EventState>({
    events: [],
    event: null,
    loading: false,
    error: undefined,
  })

  public event$ = this.eventSubject.asObservable()

  private get currentState() {
    return this.eventSubject.getValue()
  }

  private updateState(newState: Partial<EventState>) {
    this.eventSubject.next({ ...this.currentState, ...newState })
  }

  public getEventsByTeamId(teamId: string | null | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!teamId) {
      this.updateState({ events: [], loading: false, error: 'No team found' })
      return
    }
    from(getEventsByTeamId(teamId))
      .pipe(
        map(xResponse => {
          this.updateState({ events: xResponse.data, loading: false })
        }),
        catchError(e => {
          this.updateState({ events: [], loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public getEvent(eventId: string | null | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!eventId) {
      this.updateState({ event: null, loading: false, error: 'No event found' })
      return
    }
    from(getSingleEvent(eventId))
      .pipe(
        map(xResponse => {
          this.updateState({ event: xResponse, loading: false })
        }),
        catchError(e => {
          this.updateState({ event: null, loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }
}

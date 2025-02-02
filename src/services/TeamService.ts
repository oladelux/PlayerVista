import { BehaviorSubject, from } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { createTeam, getTeam, getTeamsByUser, TeamFormData, TeamResponse, updateTeam } from '@/api'

type TeamState = {
  teams: TeamResponse[]
  team: TeamResponse | null
  loading: boolean
  error: string | undefined
}

export class TeamService {
  private teamSubject = new BehaviorSubject<TeamState>({
    teams: [],
    team: null,
    loading: false,
    error: undefined,
  })

  public team$ = this.teamSubject.asObservable()

  private get currentState() {
    return this.teamSubject.getValue()
  }

  private updateState(newState: Partial<TeamState>) {
    this.teamSubject.next({ ...this.currentState, ...newState })
  }

  public getTeams(userId: string | null | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!userId) {
      this.updateState({ teams: [], loading: false, error: 'No user found' })
      return
    }
    from(getTeamsByUser(userId))
      .pipe(
        map((xResponse) => {
          this.updateState({ teams: xResponse.data, loading: false })
        }),
        catchError((e) => {
          this.updateState({ teams: [], loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public getTeam(teamId: string | null | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!teamId) {
      this.updateState({ teams: [], loading: false, error: 'No team found' })
      return
    }
    from(getTeam(teamId))
      .pipe(
        map((xResponse) => {
          this.updateState({ team: xResponse, loading: false })
        }),
        catchError((e) => {
          this.updateState({ team: null, loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public async patch(teamId: string, data: Partial<TeamFormData>) {
    this.updateState({ loading: true, error: undefined })
    from(updateTeam(data, teamId))
      .pipe(
        map(() => {
          this.updateState({ loading: false })
        }),
        catchError((e) => {
          this.updateState({ loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public async insert(data: TeamFormData) {
    this.updateState({ loading: true, error: undefined })
    from(createTeam(data))
      .pipe(
        map(() => {
          this.updateState({ loading: false })
          this.getTeams(data.userId)
        }),
        catchError((e) => {
          this.updateState({ loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }
}

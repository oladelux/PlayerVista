import { BehaviorSubject, from } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { createTeam, getTeam, getTeamsByUser, TeamFormData, TeamResponse, updateTeam } from '@/api'

type TeamState = {
  teams: TeamResponse[]
  team: TeamResponse | null
  teamLoading: boolean
  teamsLoading: boolean
  error: string | undefined
}

export class TeamService {
  private teamSubject = new BehaviorSubject<TeamState>({
    teams: [],
    team: null,
    teamLoading: false,
    teamsLoading: false,
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
    this.updateState({ teamsLoading: true, error: undefined })
    if (!userId) {
      this.updateState({ teams: [], teamsLoading: false, error: 'No user found' })
      return
    }
    from(getTeamsByUser(userId))
      .pipe(
        map(xResponse => {
          this.updateState({ teams: xResponse.data, teamsLoading: false })
        }),
        catchError(e => {
          this.updateState({ teams: [], teamsLoading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public getTeamById(teamId: string | null | undefined) {
    this.updateState({ teamLoading: true, error: undefined })
    if (!teamId) {
      this.updateState({ team: null, teamLoading: false, error: 'No team found' })
      return
    }
    from(getTeam(teamId))
      .pipe(
        map(xResponse => {
          this.updateState({ team: xResponse, teamLoading: false })
        }),
        catchError(e => {
          this.updateState({ team: null, teamLoading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public async patch(teamId: string, data: Partial<TeamFormData>) {
    this.updateState({ teamLoading: true, error: undefined })
    from(updateTeam(data, teamId))
      .pipe(
        map(() => {
          this.updateState({ teamLoading: false })
        }),
        catchError(e => {
          this.updateState({ teamLoading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public async insert(data: TeamFormData) {
    this.updateState({ teamsLoading: true, error: undefined })
    from(createTeam(data))
      .pipe(
        map(() => {
          this.updateState({ teamsLoading: false })
          this.getTeams(data.userId)
        }),
        catchError(e => {
          this.updateState({ teamsLoading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }
}

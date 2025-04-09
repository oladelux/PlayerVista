import { BehaviorSubject, from } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import {
  addPlayer,
  getPlayerById,
  getPlayersByTeamId,
  getPlayersByUserId,
  Player,
  PlayerFormData,
  updatePlayer,
} from '@/api'

type PlayerState = {
  players: Player[]
  player: Player | null
  allUserPlayers: Player[]
  loading: boolean
  error: string | undefined
}

export class PlayerService {
  private playerSubject = new BehaviorSubject<PlayerState>({
    players: [],
    player: null,
    allUserPlayers: [],
    loading: false,
    error: undefined,
  })

  public player$ = this.playerSubject.asObservable()

  private get currentState() {
    return this.playerSubject.getValue()
  }

  private updateState(newState: Partial<PlayerState>) {
    this.playerSubject.next({ ...this.currentState, ...newState })
  }

  public getPlayer(playerId: string | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!playerId) {
      this.updateState({ player: null, loading: false, error: 'No active player selected' })
      return
    }
    from(getPlayerById(playerId))
      .pipe(
        map(xResponse => {
          this.updateState({ player: xResponse, loading: false })
        }),
        catchError(e => {
          this.updateState({ player: null, loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public getPlayers(teamId: string | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!teamId) {
      this.updateState({ players: [], loading: false, error: 'No active team' })
      return
    }
    const allPlayers: Player[] = []
    const fetchPage = (currentPage: number = 1, limit: number = 10) => {
      from(getPlayersByTeamId(teamId, currentPage, limit))
        .pipe(
          map(response => {
            allPlayers.push(...response.data)
            if (response.hasNextPage) {
              fetchPage(currentPage + 1, limit)
            } else {
              this.updateState({
                players: allPlayers,
                loading: false,
              })
            }
          }),
          catchError(e => {
            this.updateState({
              players: allPlayers,
              loading: false,
              error: e.message,
            })
            return []
          }),
        )
        .subscribe()
    }
    fetchPage(1)
  }

  public getAllPlayers(userId: string | null | undefined) {
    this.updateState({ loading: true, error: undefined })
    if (!userId) {
      this.updateState({ allUserPlayers: [], loading: false, error: 'No active team' })
      return
    }
    from(getPlayersByUserId(userId))
      .pipe(
        map(xResponse => {
          this.updateState({ allUserPlayers: xResponse.data, loading: false })
        }),
        catchError(e => {
          this.updateState({ allUserPlayers: [], loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public async insert(data: PlayerFormData, teamId: string) {
    this.updateState({ loading: true, error: undefined })
    from(addPlayer(data))
      .pipe(
        map(() => {
          this.updateState({ loading: false })
          this.getPlayers(teamId)
        }),
        catchError(e => {
          this.updateState({ loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }

  public async patch(playerId: string, data: Partial<PlayerFormData>) {
    this.updateState({ loading: true, error: undefined })
    from(updatePlayer(data, playerId))
      .pipe(
        map(() => {
          this.updateState({ loading: false })
          this.getPlayer(playerId)
        }),
        catchError(e => {
          this.updateState({ loading: false, error: e.message })
          return []
        }),
      )
      .subscribe()
  }
}

import { BehaviorSubject } from 'rxjs'

import { AuthenticatedUserData } from '@/api'

export class AppService {
  private activeTeamSubject = new BehaviorSubject<string | null>(null)
  private userIdSubject = new BehaviorSubject<string | null>(null)
  private userDataSubject = new BehaviorSubject<AuthenticatedUserData | null>(null)

  // Observable for subscribers
  public activeTeam$ = this.activeTeamSubject.asObservable()
  public userId$ = this.userIdSubject.asObservable()

  // Method to set the active team
  public setActiveTeam(teamId: string) {
    this.activeTeamSubject.next(teamId)
  }

  public setUserId(userId: string) {
    this.userIdSubject.next(userId)
  }

  public setUserData(userData: AuthenticatedUserData) {
    this.userDataSubject.next(userData)
  }

  // Method to clear the active team
  public clearActiveTeam() {
    this.activeTeamSubject.next(null)
  }

  public clearUserId() {
    this.userIdSubject.next(null)
  }

  public clearUserData() {
    this.userDataSubject.next(null)
  }

  // Method to get the current active team synchronously
  public getActiveTeam() {
    return this.activeTeamSubject.getValue()
  }

  public getUserId() {
    return this.userIdSubject.getValue()
  }

  public getUserData() {
    return this.userDataSubject.getValue()
  }
}

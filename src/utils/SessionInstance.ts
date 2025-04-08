import { LocalSessionType } from '@/utils/LocalSessionType.ts'

export class SessionInstance {
  private static instance: LocalSessionType

  private constructor() {}

  public static getInstance(): LocalSessionType {
    return this.instance
  }

  public static getTeamId(): string | undefined {
    if (!this.instance.currentTeamId) {
      return undefined
    }
    return this.instance.currentTeamId
  }

  public static setInstance(localSession: LocalSessionType): void {
    this.instance = localSession
  }
}

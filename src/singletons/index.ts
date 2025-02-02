import { AppService } from '@/services/AppService.ts'
import { EventService } from '@/services/EventService.ts'
import { LogService } from '@/services/LogService.ts'
import { PerformanceService } from '@/services/PerformanceService.ts'
import { PlayerService } from '@/services/PlayerService.ts'
import { StaffService } from '@/services/StaffService.ts'
import { TeamService } from '@/services/TeamService.ts'

export const appService = new AppService()
export const teamService = new TeamService()
export const playerService = new PlayerService()
export const logService = new LogService()
export const staffService = new StaffService()
export const eventService = new EventService()
export const performanceService = new PerformanceService()

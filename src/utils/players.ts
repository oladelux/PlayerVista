import {
  Action,
  Event,
  HeatmapEntry,
  MatchStatus,
  Player,
  PlayerActionPeriod,
  PlayerActions,
  PlayerPerformance,
} from '@/api'
import { getHalfData, HalfType } from '@/utils/phaseMetrics.ts'
import { PlayerPositionType } from '@/views/PlayersView/form/PlayerPosition.ts'

export type PlayerStats =
  | 'shotsOnTarget'
  | 'shotsOffTarget'
  | 'tacklesWon'
  | 'tacklesLost'
  | 'goals'
  | 'pass'
  | 'assists'
  | 'interceptions'
  | 'clearance'
  | 'blockedShots'
  | 'aerialDuels'
  | 'aerialClearance'
  | 'fouls'
  | 'saves'
  | 'mistakes'
  | 'recoveries'
  | 'blocks'
  | 'yellowCards'
  | 'redCards'
  | 'offside'
  | 'cornerKick'
  | 'freekick'
  | 'dribble'
  | 'penaltyWon'
  | 'penaltyTaken'
  | 'PossessionLost'
  | 'duels'
  | 'duelsWon'
  | 'touches'
  | 'successfulDribble'
  | 'dribbles'
  | 'groundDuels'
  | 'groundDuelsWon'
  | 'foulsConceded'
  | 'aerialDuelsWon'
  | 'errors'

export type FilteredActions = {
  [key in keyof PlayerActions]: {
    firstHalf: Action[]
    secondHalf: Action[]
  }
}

export type LocationData = {
  x: number
  y: number
}

export type HeatSectorsType = {
  count: number
  x1: number
  x2: number
  y1: number
  y2: number
}

const convertLandscapeToPortraitOnXAxis = (data: number) => {
  const fieldHeight = 80
  const computeValue = 120 / (120 - data)
  return fieldHeight / computeValue
}

const convertLandscapeToPortraitOnYAxis = (data: number) => {
  const fieldHeight = 120
  const computeValue = 200 / (200 - data)
  const xScaleFactor = 120 / computeValue
  return fieldHeight - xScaleFactor
}

export const getPositionalData = (events: PlayerPerformance[], playerId: string) => {
  const playerEvents = events.find(evt => evt.playerId === playerId)

  if (!playerEvents) {
    return []
  }

  return playerEvents.heatmap.map(point => {
    return {
      x: convertLandscapeToPortraitOnYAxis(point.y),
      y: convertLandscapeToPortraitOnXAxis(point.x),
    }
  })
}

export const getHeatmapSectors = (
  locations: LocationData[],
  noOfColumns: number,
  noOfRows: number,
) => {
  const sectorWidth = 120 / noOfColumns
  const sectorHeight = 80 / noOfRows

  const sectors = []
  let sector = 0
  let xCount = 0
  while (xCount < 120) {
    let yCount = 0
    while (yCount < 80) {
      sectors[sector] = {
        count: 0,
        x1: xCount,
        x2: xCount + sectorWidth,
        y1: yCount,
        y2: yCount + sectorHeight,
      }
      for (const loc of locations) {
        if (
          loc.x > xCount &&
          loc.x < xCount + sectorWidth &&
          loc.y > yCount &&
          loc.y <= yCount + sectorHeight
        ) {
          sectors[sector].count++
        }
      }
      yCount += sectorHeight
      sector++
    }
    xCount += sectorWidth
    sector++
  }
  return sectors
}

export const getPlayerActions = (players: Player[], events: PlayerPerformance[]) => {
  // Map player data to a lookup object for faster access by player ID
  const playerDataMap = events.reduce(
    (acc, event) => {
      acc[event.playerId] = event.actions
      return acc
    },
    {} as Record<string, PlayerActions>,
  )

  const playerMinutePlayed = events.reduce(
    (acc, event) => {
      acc[event.playerId] = event.minutePlayed
      return acc
    },
    {} as Record<string, number>,
  )

  // Loop through players and retrieve actions (handling missing data)
  return players.map(player => {
    const actions = playerDataMap[player.id]
    return {
      playerId: player.id,
      name: player.firstName + ' ' + player.lastName,
      jerseyNum: player.uniformNumber,
      position: player.position,
      minutePlayed: playerMinutePlayed[player.id],
      actions: actions,
    }
  })
}

export const getPlayerActionsForSinglePlayer = (events: PlayerPerformance[], playerId?: string) => {
  if (!playerId) {
    return null
  }
  // Find the specific player's performance data
  const playerEvent = events.find(event => event.playerId === playerId)

  if (!playerEvent) {
    return null
  }

  // Retrieve the player's actions and minutes played
  const actions = playerEvent.actions
  const minutePlayed = playerEvent.minutePlayed

  // Return the player's data
  return {
    playerId: playerId,
    minutePlayed: minutePlayed,
    actions: actions,
  }
}
export const convertSecondsToGameMinute = (seconds: number) => {
  return Math.floor(seconds / 60) + 1
}

type PositionType = {
  [key in PlayerPositionType]: {
    x: number
    y: number
  }
}

export const positionData: PositionType = {
  GK: { x: 5, y: 40 },
  LB: { x: 20, y: 10 },
  LCB: { x: 20, y: 25 },
  RCB: { x: 20, y: 55 },
  CB: { x: 20, y: 40 },
  RB: { x: 20, y: 70 },
  LWB: { x: 40, y: 5 },
  RWB: { x: 40, y: 75 },
  CDM: { x: 40, y: 40 },
  DM: { x: 60, y: 75 },
  CM: { x: 60, y: 40 },
  CAM: { x: 80, y: 40 },
  LCM: { x: 60, y: 30 },
  RCM: { x: 60, y: 50 },
  LM: { x: 60, y: 10 },
  RM: { x: 60, y: 70 },
  RW: { x: 90, y: 70 },
  LW: { x: 90, y: 10 },
  ST: { x: 110, y: 40 },
  CF: { x: 110, y: 40 },
}

const filterActionsByHalf = (actions: Action[]) => {
  const firstHalf = actions.filter(action => action.period === PlayerActionPeriod.FirstHalf)
  const secondHalf = actions.filter(action => action.period === PlayerActionPeriod.SecondHalf)

  return { firstHalf, secondHalf }
}

export const getFilteredActions = (playerActions: PlayerActions) => {
  const filteredActions = {} as FilteredActions

  for (const [key, actions] of Object.entries(playerActions)) {
    filteredActions[key as keyof PlayerActions] = filterActionsByHalf(actions)
  }

  return filteredActions
}

export type OffensiveChartDataType = {
  TS: number[]
  S_ONT: number[]
  S_OFFT: number[]
  TD: number[]
  SD: number[]
  TP: number[]
  SP: number[]
  TG: number[]
  TA: number[]
  P_SC: number[]
  P_LS: number[]
}

export type DefensiveChartDataType = {
  S_TKLs: number[]
  T_TKLs: number[]
  TI: number[]
  TC: number[]
  TB: number[]
  T_AD: number[]
  ADW: number[]
}

export type PossessionChartDataType = {
  S_TKLs: number[]
  SUS_C: number[]
  T: number[]
  ATT_TO: number[]
  SUC_TO: number[]
}

export type DisciplineChartDataType = {
  CrdY: number[]
  CrdR: number[]
  Fls: number[]
}

export type GoalkeeperChartDataType = {
  SOT_A: number[]
  Saves: number[]
  P_Sv: number[]
  P_ms: number[]
  DFK_F: number[]
  FK_S: number[]
  FK_GS: number[]
  '1v1_F': number[]
  '1v1_S': number[]
}

export const getOffensiveChartData = (playerPerformance: PlayerPerformance[]) => {
  const offensiveChartData = {
    TS: [],
    S_ONT: [],
    S_OFFT: [],
    TD: [],
    SD: [],
    TP: [],
    SP: [],
    TG: [],
    TA: [],
    P_SC: [],
    P_LS: [],
  } as OffensiveChartDataType

  playerPerformance.reduce((acc: OffensiveChartDataType, performance) => {
    const shots = performance.actions?.shots || []
    const dribbles = performance.actions?.dribbles || []
    const passes = performance.actions?.passes || []
    const goals = performance.actions?.goals || []
    const assists = performance.actions?.assists || []
    const penalty = performance.actions?.penalty || []

    const totalShots = shots.length
    const shotsOnTarget = shots.filter(shot => shot.successful).length
    const shotsOffTarget = shots.filter(shot => !shot.successful).length
    const totalDribbles = dribbles.length
    const successfulDribbles = dribbles.filter(dribble => dribble.successful).length
    const totalPasses = passes.length
    const successfulPasses = passes.filter(pass => pass.successful).length
    const totalGoals = goals.length
    const totalAssists = assists.length
    const penaltiesScored = penalty.filter(x => x.successful).length
    const penaltiesLost = penalty.filter(x => !x.successful).length

    // Append data for charts
    acc.TS.push(totalShots)
    acc.S_ONT.push(shotsOnTarget)
    acc.S_OFFT.push(shotsOffTarget)
    acc.TD.push(totalDribbles)
    acc.SD.push(successfulDribbles)
    acc.TP.push(totalPasses)
    acc.SP.push(successfulPasses)
    acc.TG.push(totalGoals)
    acc.TA.push(totalAssists)
    acc.P_SC.push(penaltiesScored)
    acc.P_LS.push(penaltiesLost)

    return acc
  }, offensiveChartData)

  return offensiveChartData
}

export const getDefensiveChartData = (playerPerformance: PlayerPerformance[]) => {
  const defensiveChartData = {
    S_TKLs: [],
    T_TKLs: [],
    TI: [],
    TC: [],
    TB: [],
    T_AD: [],
    ADW: [],
  } as DefensiveChartDataType

  playerPerformance.reduce((acc: DefensiveChartDataType, performance) => {
    const tackles = performance.actions?.tackles || []
    const interceptions = performance.actions?.interceptions || []
    const clearances = performance.actions?.clearances || []
    const blocks = performance.actions?.blocks || []
    const aerialDuels = performance.actions?.aerialDuels || []

    const totalTackles = tackles.length
    const successfulTackles = tackles.filter(tackle => tackle.successful).length
    const totalInterceptions = interceptions.length
    const totalClearances = clearances.length
    const totalBlocks = blocks.length
    const totalAerialDuels = aerialDuels.length
    const aerialDuelsWon = aerialDuels.filter(duel => duel.successful).length

    // Append data for charts
    acc.S_TKLs.push(successfulTackles)
    acc.T_TKLs.push(totalTackles)
    acc.TI.push(totalInterceptions)
    acc.TC.push(totalClearances)
    acc.TB.push(totalBlocks)
    acc.T_AD.push(totalAerialDuels)
    acc.ADW.push(aerialDuelsWon)

    return acc
  }, defensiveChartData)

  return defensiveChartData
}

export const getPossessionChartData = (playerPerformance: PlayerPerformance[]) => {
  const possessionChartData = {
    S_TKLs: [],
    SUS_C: [],
    T: [],
    ATT_TO: [],
    SUC_TO: [],
  } as PossessionChartDataType

  playerPerformance.reduce((acc: PossessionChartDataType, performance) => {
    const touches = performance.actions?.touches || []
    const takeOns = performance.actions?.dribbles || []
    const crosses = performance.actions?.crosses || []

    const successfulCrosses = crosses.filter(cross => cross.successful).length
    const totalCrosses = crosses.length
    const totalTouches = touches.length
    const attemptedTakeOns = takeOns.length
    const successfulTakeOns = takeOns.filter(takeOn => takeOn.successful).length

    acc.S_TKLs.push(totalCrosses)
    acc.SUS_C.push(successfulCrosses)
    acc.T.push(totalTouches)
    acc.ATT_TO.push(attemptedTakeOns)
    acc.SUC_TO.push(successfulTakeOns)

    return acc
  }, possessionChartData)

  return possessionChartData
}

export const getDisciplinaryChartData = (playerPerformance: PlayerPerformance[]) => {
  const disciplineChartData = {
    CrdY: [],
    CrdR: [],
    Fls: [],
  } as DisciplineChartDataType

  playerPerformance.reduce((acc: DisciplineChartDataType, performance) => {
    const yellowCards = performance.actions?.yellowCard || []
    const redCards = performance.actions?.redCard || []
    const fouls = performance.actions?.fouls || []

    const totalYellowCards = yellowCards.length
    const totalRedCards = redCards.length
    const totalFouls = fouls.length

    acc.CrdY.push(totalYellowCards)
    acc.CrdR.push(totalRedCards)
    acc.Fls.push(totalFouls)

    return acc
  }, disciplineChartData)

  return disciplineChartData
}

export const getGoalkeeperChartData = (playerPerformance: PlayerPerformance[]) => {
  const goalkeeperChartData = {
    SOT_A: [],
    Saves: [],
    P_Sv: [],
    P_ms: [],
    DFK_F: [],
    FK_S: [],
    FK_GS: [],
    '1v1_F': [],
    '1v1_S': [],
  } as GoalkeeperChartDataType

  playerPerformance.reduce((acc: GoalkeeperChartDataType, performance) => {
    const shotsOnTargetAgainst = performance.actions?.shots || []
    const saves = performance.actions?.saves || []
    const penaltySaves = performance.actions?.penaltySaves || []
    const penaltyMisses = performance.actions?.penalty || []
    const directFreeKickFaced = performance.actions?.freekick || []
    const freeKickSaved = performance.actions?.freekickSaves || []
    const oneVOne = performance.actions?.OneVOneSaves || []

    const shotsOnTargetAgainstCount = shotsOnTargetAgainst.length
    const savesCount = saves.length
    const penaltySavesCount = penaltySaves.length
    const penaltyMissesCount = penaltyMisses.filter(penalty => !penalty.successful).length
    const directFreeKickFacedCount = directFreeKickFaced.length
    const freeKickSavedCount = freeKickSaved.filter(freeKick => freeKick.successful).length
    const freeKickGoalSavedCount = freeKickSaved.filter(freeKick => freeKick.successful).length
    const oneVOneFaced = oneVOne.length
    const oneVOneSaved = oneVOne.filter(oneVOne => oneVOne.successful).length

    acc.SOT_A.push(shotsOnTargetAgainstCount)
    acc.Saves.push(savesCount)
    acc.P_Sv.push(penaltySavesCount)
    acc.P_ms.push(penaltyMissesCount)
    acc.DFK_F.push(directFreeKickFacedCount)
    acc.FK_S.push(freeKickSavedCount)
    acc.FK_GS.push(freeKickGoalSavedCount)
    acc['1v1_F'].push(oneVOneFaced)
    acc['1v1_S'].push(oneVOneSaved)

    return acc
  }, goalkeeperChartData)

  return goalkeeperChartData
}
export type OffensiveFullPlayerData = {
  totalShots: number
  shotsOnTarget: number
  shotsOffTarget: number
  shotsAccuracy: number
  totalDribbles: number
  successfulDribbles: number
  dribblesAccuracy: number
  totalPasses: number
  successfulPasses: number
  passAccuracy: number
  totalGoals: number
  totalAssists: number
  penaltiesScored: number
  penaltiesLost: number
  penaltiesAccuracy: number
}

export function getOffensiveData(data: PlayerActions): OffensiveFullPlayerData {
  const totalShots = data.shots.length ?? 0
  const shotsOnTarget = data.shots.filter(shot => shot.successful).length ?? 0
  const shotsOffTarget = data.shots.filter(shot => !shot.successful).length ?? 0
  const shotsAccuracy = totalShots > 0 ? Math.round((shotsOnTarget / totalShots) * 100) : 0
  const totalDribbles = data.dribbles.length ?? 0
  const successfulDribbles = data.dribbles.filter(dribble => dribble.successful).length ?? 0
  const dribblesAccuracy =
    totalDribbles > 0 ? Math.round((successfulDribbles / totalDribbles) * 100) : 0
  const totalPasses = data.passes.length ?? 0
  const successfulPasses = data.passes.filter(pass => pass.successful).length ?? 0
  const passAccuracy = totalPasses > 0 ? Math.round((successfulPasses / totalPasses) * 100) : 0
  const totalGoals = data.goals.length ?? 0
  const totalAssists = data.assists.length ?? 0
  const penaltiesScored = data.penalty ? data.penalty.filter(x => x.successful).length : 0
  const penaltiesLost = data.penalty ? data.penalty.filter(x => !x.successful).length : 0
  const penaltiesAccuracy =
    penaltiesScored > 0
      ? Math.round((penaltiesScored / (penaltiesScored + penaltiesLost)) * 100)
      : 0

  return {
    totalShots,
    shotsOnTarget,
    shotsOffTarget,
    shotsAccuracy,
    totalDribbles,
    successfulDribbles,
    dribblesAccuracy,
    totalPasses,
    successfulPasses,
    passAccuracy,
    totalGoals,
    totalAssists,
    penaltiesScored,
    penaltiesLost,
    penaltiesAccuracy,
  }
}

export type defensiveFullPlayerData = {
  successfulTackles: number
  totalTackles: number
  totalInterceptions: number
  totalClearances: number
  totalBlocks: number
  totalAerialDuels: number
  aerialDuelsWon: number
}

export function getDefensiveData(data: PlayerActions): defensiveFullPlayerData {
  const totalTackles = data.tackles.length ?? 0
  const successfulTackles = data.tackles.filter(tackle => tackle.successful).length ?? 0
  const totalInterceptions = data.interceptions.length ?? 0
  const totalClearances = data.clearances.length ?? 0
  const totalBlocks = data.blocks.length ?? 0
  const totalAerialDuels = data.aerialDuels.length ?? 0
  const aerialDuelsWon = data.aerialDuels.filter(duel => duel.successful).length ?? 0

  return {
    successfulTackles,
    totalTackles,
    totalInterceptions,
    totalClearances,
    totalBlocks,
    totalAerialDuels,
    aerialDuelsWon,
  }
}

export type possessionFullPlayerData = {
  totalCrosses: number
  successfulCrosses: number
  totalTouches: number
  attemptedTakeOns: number
  successfulTakeOns: number
  totalCorners: number
  totalFreeKicks: number
  totalFoulsReceived: number
}

export function getPossessionData(data: PlayerActions): possessionFullPlayerData {
  const totalCrosses = data.crosses.length ?? 0
  const successfulCrosses = data.crosses.filter(cross => cross.successful).length ?? 0
  const totalTouches = data.touches.length ?? 0
  const attemptedTakeOns = data.dribbles.length ?? 0
  const successfulTakeOns = data.dribbles.filter(takeOn => takeOn.successful).length ?? 0
  const totalCorners = data.cornerKick?.length ?? 0
  const totalFreeKicks = data.freekick?.length ?? 0
  const totalFoulsReceived = data.foulsReceived?.length ?? 0

  return {
    totalCrosses,
    successfulCrosses,
    totalTouches,
    attemptedTakeOns,
    successfulTakeOns,
    totalCorners,
    totalFreeKicks,
    totalFoulsReceived,
  }
}

export type disciplinaryFullPlayerData = {
  totalYellowCards: number
  totalRedCards: number
  totalFouls: number
}

export function getDisciplinaryData(data: PlayerActions): disciplinaryFullPlayerData {
  const totalYellowCards = data.yellowCard.length ?? 0
  const totalRedCards = data.redCard.length ?? 0
  const totalFouls = data.fouls.length ?? 0

  return {
    totalYellowCards,
    totalRedCards,
    totalFouls,
  }
}

export type goalkeeperFullPlayerData = {
  shotsOnTargetAgainst: number
  saves: number
  savePercentage: number
  penaltySaves: number
  penaltyMisses: number
  penaltySavePercentage: number
  directFreeKickFaced: number
  freeKickSaved: number
  freeKickGoalSaved: number
  oneVOneFaced: number
  oneVOneSaved: number
  oneVOneSavedPercentage: number
}

export function getGoalkeeperData(data: PlayerActions): goalkeeperFullPlayerData {
  const shotsOnTargetAgainst = data.shots.length ?? 0
  const saves = data.saves.length ?? 0
  const savePercentage =
    shotsOnTargetAgainst > 0 ? Math.round((saves / shotsOnTargetAgainst) * 100) : 0
  const penaltySaves = data.penaltySaves.length ?? 0
  const penaltyMisses = data.penalty
    ? data.penalty.filter(penalty => !penalty.successful).length
    : 0
  const penaltySavePercentage =
    penaltySaves > 0 ? (penaltySaves / Math.round(penaltySaves + penaltyMisses)) * 100 : 0
  const directFreeKickFaced = data.freekick ? data.freekick.length : 0
  const freeKickSaved = data.freekickSaves ? data.freekickSaves.length : 0
  const freeKickGoalSaved = data.freekickSaves
    ? data.freekickSaves.filter(freeKick => freeKick.successful).length
    : 0
  const oneVOneFaced = data.OneVOneSaves ? data.OneVOneSaves.length : 0
  const oneVOneSaved = data.OneVOneSaves
    ? data.OneVOneSaves.filter(oneVOne => oneVOne.successful).length
    : 0
  const oneVOneSavedPercentage =
    oneVOneFaced > 0 ? Math.round((oneVOneSaved / oneVOneFaced) * 100) : 0

  return {
    shotsOnTargetAgainst,
    saves,
    savePercentage,
    penaltySaves,
    penaltyMisses,
    penaltySavePercentage,
    directFreeKickFaced,
    freeKickSaved,
    freeKickGoalSaved,
    oneVOneFaced,
    oneVOneSaved,
    oneVOneSavedPercentage,
  }
}

export function singleMatchOffensiveData(performance: PlayerPerformance) {
  const firstHalfData = getHalfData(performance, HalfType.FirstHalf)
  const secondHalfData = getHalfData(performance, HalfType.SecondHalf)

  if (!firstHalfData || !secondHalfData) {
    return null
  }

  const offensiveData = {
    firstHalf: getOffensiveData(firstHalfData),
    secondHalf: getOffensiveData(secondHalfData),
  }

  const defensiveData = {
    firstHalf: getDefensiveData(firstHalfData),
    secondHalf: getDefensiveData(secondHalfData),
  }

  const possessionData = {
    firstHalf: getPossessionData(firstHalfData),
    secondHalf: getPossessionData(secondHalfData),
  }

  const disciplinaryData = {
    firstHalf: getDisciplinaryData(firstHalfData),
    secondHalf: getDisciplinaryData(secondHalfData),
  }

  const goalkeeperData = {
    firstHalf: getGoalkeeperData(firstHalfData),
    secondHalf: getGoalkeeperData(secondHalfData),
  }

  return {
    offensiveData,
    defensiveData,
    possessionData,
    disciplinaryData,
    goalkeeperData,
  }
}

export type PlayerPerformanceData = {
  month:
    | 'Jan'
    | 'Feb'
    | 'Mar'
    | 'Apr'
    | 'May'
    | 'Jun'
    | 'Jul'
    | 'Aug'
    | 'Sep'
    | 'Oct'
    | 'Nov'
    | 'Dec'
  rating: number
  goals: number
  assists: number
}

export type PlayerEvent = {
  eventDate: Date | undefined
  id: string
  opponent?: string
  result?: string
  eventId: string
  playerId: string
  minutePlayed: number
  heatmap: HeatmapEntry[]
  actions: PlayerActions
  createdAt: Date
  updatedAt: Date
}

export function getPlayerPerformanceData(
  playerEvents: PlayerEvent[],
  position: PlayerPositionType | undefined,
): PlayerPerformanceData[] {
  const performanceData: PlayerPerformanceData[] = []
  playerEvents.forEach(event => {
    if (!event.eventDate) {
      return
    }
    const eventDate = new Date(event.eventDate)
    const performance = getOffensiveData(event.actions)
    const rating = calculatePlayerRating(event.actions, position)
    performanceData.push({
      month: eventDate.toLocaleString('default', { month: 'short' }) as
        | 'Jan'
        | 'Feb'
        | 'Mar'
        | 'Apr'
        | 'May'
        | 'Jun'
        | 'Jul'
        | 'Aug'
        | 'Sep'
        | 'Oct'
        | 'Nov'
        | 'Dec',
      rating: rating,
      goals: performance.totalGoals,
      assists: performance.totalAssists,
    })
  })
  return performanceData
}

export type PlayerMatch = {
  id: string
  date: Date
  opponent: string
  result: string
  goals: number
  assists: number
  rating: number
  minutesPlayed: number
  touches: number
  shots: number
  shotsOnTarget: number
  dribbles: number
  successfulDribbles: number
  passAccuracy: number
  pass: number
  tackles: number
  interceptions: number
  aerialDuelsWon: number
  aerialDuelsTotal: number
  fouls: number
  yellowCards: number
  redCards: number
  offside: number
  cornerKick: number
  freekick: number
  penaltyWon: number
  penaltyTaken: number
  possessionLost: number
  possessionWon: number
  chancesCreated: number
  xG: number
  xA: number
}

export function getPlayerMatches(
  playerEvents: PlayerEvent[],
  position: PlayerPositionType | undefined,
): PlayerMatch[] {
  const playerMatches: PlayerMatch[] = []
  playerEvents.forEach(event => {
    if (!event.eventDate) {
      return
    }
    const eventDate = new Date(event.eventDate)
    const rating = calculatePlayerRating(event.actions, position)
    const offensivePerformance = getOffensiveData(event.actions)
    const defensivePerformance = getDefensiveData(event.actions)
    const possessionPerformance = getPossessionData(event.actions)
    const disciplinaryPerformance = getDisciplinaryData(event.actions)
    const goalkeeperPerformance = getGoalkeeperData(event.actions)
    playerMatches.push({
      id: event.eventId,
      date: eventDate,
      opponent: event.opponent || '',
      result: event.result || '',
      goals: offensivePerformance.totalGoals,
      assists: offensivePerformance.totalAssists,
      rating: rating,
      minutesPlayed: event.minutePlayed,
      touches: possessionPerformance.totalTouches,
      shots: offensivePerformance.totalShots,
      shotsOnTarget: offensivePerformance.shotsOnTarget,
      pass: offensivePerformance.totalPasses,
      passAccuracy: offensivePerformance.passAccuracy,
      dribbles: offensivePerformance.totalDribbles,
      successfulDribbles: offensivePerformance.successfulDribbles,
      tackles: defensivePerformance.totalTackles,
      interceptions: defensivePerformance.totalInterceptions,
      aerialDuelsWon: defensivePerformance.aerialDuelsWon,
      aerialDuelsTotal: defensivePerformance.totalAerialDuels,
      fouls: disciplinaryPerformance.totalFouls,
      yellowCards: disciplinaryPerformance.totalYellowCards,
      redCards: disciplinaryPerformance.totalRedCards,
      offside: possessionPerformance.attemptedTakeOns,
      cornerKick: possessionPerformance.successfulCrosses,
      freekick: goalkeeperPerformance.directFreeKickFaced,
      penaltyWon: goalkeeperPerformance.penaltySaves,
      penaltyTaken: goalkeeperPerformance.penaltyMisses,
      possessionLost: possessionPerformance.totalCrosses,
      possessionWon: possessionPerformance.successfulCrosses,
      chancesCreated: offensivePerformance.totalGoals,
      xG: offensivePerformance.totalShots,
      xA: offensivePerformance.totalAssists,
    })
  })
  return playerMatches
}

export function calculatePlayerRating(
  playerActions: PlayerActions,
  position: PlayerPositionType | undefined,
) {
  const baseScore = 5.0

  // Calculate success rates for key actions
  const passesTotal =
    (playerActions.passes?.length || 0) +
    (playerActions.shortPass?.length || 0) +
    (playerActions.longPass?.length || 0)
  const passesSuccessful =
    (playerActions.passes?.filter(p => p.successful).length || 0) +
    (playerActions.shortPass?.filter(p => p.successful).length || 0) +
    (playerActions.longPass?.filter(p => p.successful).length || 0)
  const passSuccess = passesTotal > 0 ? passesSuccessful / passesTotal : 0

  const tacklesTotal = playerActions.tackles?.length || 0
  const tacklesSuccessful = playerActions.tackles?.filter(t => t.successful).length || 0
  const tackleSuccess = tacklesTotal > 0 ? tacklesSuccessful / tacklesTotal : 0

  const dribblesTotal = playerActions.dribbles?.length || 0
  const dribblesSuccessful = playerActions.dribbles?.filter(d => d.successful).length || 0
  const dribbleSuccess = dribblesTotal > 0 ? dribblesSuccessful / dribblesTotal : 0

  const aerialDuelsTotal = playerActions.aerialDuels?.length || 0
  const aerialDuelsSuccessful = playerActions.aerialDuels?.filter(a => a.successful).length || 0
  const aerialDuelSuccess = aerialDuelsTotal > 0 ? aerialDuelsSuccessful / aerialDuelsTotal : 0

  const duelsTotal = playerActions.aerialDuels?.length || 0
  const duelsSuccessful = playerActions.aerialDuels?.filter(d => d.successful).length || 0
  const duelSuccess = duelsTotal > 0 ? duelsSuccessful / duelsTotal : 0

  const crossesTotal = playerActions.crosses?.length || 0
  const crossesSuccessful = playerActions.crosses?.filter(c => c.successful).length || 0
  const crossSuccess = crossesTotal > 0 ? crossesSuccessful / crossesTotal : 0

  // Get action counts
  const goals = playerActions.goals?.length || 0
  const assists = playerActions.assists?.length || 0
  const shots = playerActions.shots?.length || 0
  const shotsOnTarget = playerActions.shots?.filter(s => s.successful).length || 0
  const shotAccuracy = shots > 0 ? shotsOnTarget / shots : 0
  const interceptions = playerActions.interceptions?.filter(i => i.successful).length || 0
  const clearances = playerActions.clearances?.filter(c => c.successful).length || 0
  const blocks = playerActions.blocks?.filter(b => b.successful).length || 0
  const blockedShots = playerActions.blockedShots?.filter(bs => bs.successful).length || 0
  const recoveries = playerActions.recoveries?.filter(r => r.successful).length || 0
  const fouls = playerActions.fouls?.length || 0
  const saves = playerActions.saves?.filter(s => s.successful).length || 0
  const penaltySaves = playerActions.penaltySaves?.filter(ps => ps.successful).length || 0
  const freekickSaves = playerActions.freekickSaves?.filter(fs => fs.successful).length || 0
  const oneVOneSaves = playerActions.OneVOneSaves?.filter(os => os.successful).length || 0
  const goalsConceded = playerActions.goalConceded?.length || 0
  const yellowCards = playerActions.yellowCard?.length || 0
  const redCards = playerActions.redCard?.length || 0
  const penalties = playerActions.penalty?.filter(p => p.successful).length || 0

  // Start with base rating
  let rating = baseScore

  // Common contributions for all positions (reduced multipliers)

  // Attacking contributions
  rating += goals * 0.7 // Reduced from 1.2
  rating += assists * 0.5 // Reduced from 0.8
  rating += shotsOnTarget * 0.2 // Reduced from 0.3
  rating += shotAccuracy * 0.3 // New metric
  rating += penalties * 0.3 // Reduced from 0.5

  // Possession contributions
  rating += passSuccess * 0.6 // Reduced from 1.0
  rating += dribbleSuccess * 0.5 // Reduced from 0.8

  // Defensive contributions (slightly reduced)
  rating += tackleSuccess * 0.4 // Reduced from 0.7
  rating += duelSuccess * 0.3 // Added for general duels
  rating += interceptions * 0.2 // Reduced from 0.3
  rating += clearances * 0.15 // Reduced from 0.2
  rating += blocks * 0.2 // Reduced from 0.3
  rating += blockedShots * 0.25 // Reduced from 0.4
  rating += recoveries * 0.15 // Reduced from 0.2
  rating += aerialDuelSuccess * 0.4 // Reduced from 0.6

  // Negative factors
  rating -= fouls * 0.1 // Reduced from 0.2
  rating -= yellowCards * 0.3 // Reduced from 0.5
  rating -= redCards * 1.0 // Reduced from 1.5

  // Position-specific adjustments
  switch (position) {
    case 'GK':
      // Goalkeeper-specific metrics
      rating += saves * 0.3
      rating += penaltySaves * 0.7
      rating += freekickSaves * 0.5
      rating += oneVOneSaves * 0.6
      rating -= goalsConceded * 0.3
      rating += passSuccess * 0.3
      break

    case 'LB':
    case 'CB':
    case 'RB':
    case 'LCB':
    case 'RCB':
    case 'LWB':
    case 'RWB':
      // Defenders prioritize defensive actions
      rating += tackleSuccess * 0.3
      rating += interceptions * 0.25
      rating += clearances * 0.2
      rating += blocks * 0.25
      rating += blockedShots * 0.3
      rating += aerialDuelSuccess * 0.3
      rating += goals * 0.4
      rating += assists * 0.2
      break

    case 'CM':
    case 'CDM':
    case 'CAM':
    case 'LM':
    case 'RM':
    case 'LCM':
    case 'RCM':
      // Midfielders are balanced between offense and defense
      rating += passSuccess * 0.4
      rating += dribbleSuccess * 0.3
      rating += recoveries * 0.25
      rating += interceptions * 0.2
      rating += assists * 0.2
      rating += crossSuccess * 0.25
      break

    case 'ST':
    case 'CF':
      // Forwards prioritize offensive contributions
      rating += goals * 0.5
      rating += assists * 0.3
      rating += shotsOnTarget * 0.2
      rating += shotAccuracy * 0.4
      rating += dribbleSuccess * 0.3
      rating += crossSuccess * 0.2
      rating += recoveries * 0.2 // Bonus for forwards
      break
  }

  // Activity level adjustment with more granularity
  const totalActions = Object.values(playerActions).reduce(
    (sum, actions) => sum + (Array.isArray(actions) ? actions.length : 0),
    0,
  )

  // Scale rating based on involvement
  if (totalActions < 5) {
    rating = Math.min(rating, 6.0) // Very low involvement
  } else if (totalActions < 10) {
    rating = Math.min(rating, 7.0) // Low involvement
  } else if (totalActions > 30) {
    // Small bonus for high involvement, but capped
    rating += Math.min(0.5, (totalActions - 30) * 0.02)
  }

  // Add a small scaling factor to spread ratings more evenly
  rating = 5 + (rating - 5) * 0.8

  // Exceptional performance bonus - only if multiple key metrics are excellent
  let exceptionalMetrics = 0
  if (goals > 1) exceptionalMetrics++
  if (assists > 1) exceptionalMetrics++
  if (tacklesTotal > 3 && tackleSuccess > 0.7) exceptionalMetrics++
  if (interceptions > 3) exceptionalMetrics++
  if (clearances > 4) exceptionalMetrics++
  if (passesTotal > 30 && passSuccess > 0.85) exceptionalMetrics++

  // Only truly exceptional performances should approach 9+
  if (exceptionalMetrics >= 3) {
    rating += 0.5 // Bonus for exceptional all-around performance
  }

  // Normalize rating to 1-10 scale
  rating = Math.max(1, Math.min(10, rating))

  // Round to 1 decimal place
  return Math.round(rating * 10) / 10
}

type PerformanceData = {
  month: string
  goals: number
  assists: number
  minutes: number
  passes: number
  tackles: number
  shots: number
  accuracy: number
}

/**
 * Generates real player performance data sets from player events
 * @param playerEvents Array of player events containing performance data
 * @returns A properly formatted array of PerformanceData objects
 */
export function generatePlayerDataSet(playerEvents: PlayerEvent[]): PerformanceData[] {
  // Group events by month
  const eventsByMonth: Record<string, PlayerEvent[]> = {}

  playerEvents.forEach(event => {
    if (!event.eventDate) return

    const date = new Date(event.eventDate)
    const month = date.toLocaleString('default', { month: 'short' }).substring(0, 3)

    if (!eventsByMonth[month]) {
      eventsByMonth[month] = []
    }

    eventsByMonth[month].push(event)
  })

  // Calculate totals for each month
  return Object.entries(eventsByMonth).map(([month, events]) => {
    let totalGoals = 0
    let totalAssists = 0
    let totalMinutes = 0
    let totalPasses = 0
    let totalTackles = 0
    let totalShots = 0
    let totalShotsAccuracy = 0
    let validShotsEvents = 0

    events.forEach(event => {
      const offensiveData = getOffensiveData(event.actions)
      const defensiveData = getDefensiveData(event.actions)

      totalGoals += offensiveData.totalGoals
      totalAssists += offensiveData.totalAssists
      totalMinutes += event.minutePlayed
      totalPasses += offensiveData.totalPasses
      totalTackles += defensiveData.totalTackles
      totalShots += offensiveData.totalShots

      // Only include shots accuracy when shots were taken
      if (offensiveData.totalShots > 0) {
        totalShotsAccuracy += offensiveData.shotsAccuracy
        validShotsEvents++
      }
    })

    // For individual players, we show totals per month
    return {
      month,
      goals: totalGoals,
      assists: totalAssists,
      minutes: Math.round(totalMinutes / events.length), // Average minutes per game
      passes: totalPasses,
      tackles: totalTackles,
      shots: totalShots,
      accuracy: validShotsEvents > 0 ? Math.round(totalShotsAccuracy / validShotsEvents) : 0,
    }
  })
}

/**
 * Generates a complete playerDataSets object for multiple players
 * @param players Array of players with their IDs and names
 * @param events Array of player events with performance data
 * @returns A Record mapping player IDs to arrays of PerformanceData
 */
export function generatePlayerDataSets(
  players: { id: number | string; name: string; position: string }[],
  allPlayerEvents: PlayerEvent[],
): Record<string, PerformanceData[]> {
  const result: Record<string, PerformanceData[]> = {}

  // Generate team average first (ID 0)
  const teamAverageData = generateTeamAverageData(allPlayerEvents)
  result['0'] = teamAverageData

  // Generate individual player data
  players.forEach(player => {
    const playerEventsFiltered = allPlayerEvents.filter(
      event => event.playerId === player.id.toString(),
    )

    // Use the player's ID as string as the key
    result[player.id.toString()] = generatePlayerDataSet(playerEventsFiltered)
  })

  return result
}

/**
 * Generates team average performance data
 * @param allEvents All player events
 * @returns Team average performance data
 */
function generateTeamAverageData(allEvents: PlayerEvent[]): PerformanceData[] {
  // Group events by month
  const eventsByMonth: Record<string, PlayerEvent[]> = {}

  allEvents.forEach(event => {
    if (!event.eventDate) return

    const date = new Date(event.eventDate)
    const month = date.toLocaleString('default', { month: 'short' }).substring(0, 3)

    if (!eventsByMonth[month]) {
      eventsByMonth[month] = []
    }

    eventsByMonth[month].push(event)
  })

  // Calculate averages for each month
  return Object.entries(eventsByMonth).map(([month, events]) => {
    const eventsByPlayer: Record<string, PlayerEvent[]> = {}

    // Group by player to avoid counting the same player multiple times in a month
    events.forEach(event => {
      if (!eventsByPlayer[event.playerId]) {
        eventsByPlayer[event.playerId] = []
      }
      eventsByPlayer[event.playerId].push(event)
    })

    const playerCount = Object.keys(eventsByPlayer).length

    // Initialize with zeros
    let totalGoals = 0
    let totalAssists = 0
    let totalMinutes = 0
    let totalPasses = 0
    let totalTackles = 0
    let totalShots = 0
    let totalShotsAccuracy = 0
    let validShotsPlayers = 0

    // Calculate averages per player first
    Object.values(eventsByPlayer).forEach(playerEvents => {
      let playerGoals = 0
      let playerAssists = 0
      let playerMinutes = 0
      let playerPasses = 0
      let playerTackles = 0
      let playerShots = 0
      let playerShotsAccuracy = 0
      let playerHasShots = false

      playerEvents.forEach(event => {
        const offensiveData = getOffensiveData(event.actions)
        const defensiveData = getDefensiveData(event.actions)

        playerGoals += offensiveData.totalGoals
        playerAssists += offensiveData.totalAssists
        playerMinutes += event.minutePlayed
        playerPasses += offensiveData.totalPasses
        playerTackles += defensiveData.totalTackles
        playerShots += offensiveData.totalShots

        if (offensiveData.totalShots > 0) {
          playerShotsAccuracy += offensiveData.shotsAccuracy
          playerHasShots = true
        }
      })

      // Add player averages to team totals
      totalGoals += playerGoals
      totalAssists += playerAssists
      totalMinutes += playerMinutes / playerEvents.length // Average minutes per game for this player
      totalPasses += playerPasses
      totalTackles += playerTackles
      totalShots += playerShots

      if (playerHasShots) {
        totalShotsAccuracy += playerShotsAccuracy / playerEvents.length
        validShotsPlayers++
      }
    })

    // Calculate team averages (per player)
    return {
      month,
      goals: Math.round(totalGoals / playerCount),
      assists: Math.round(totalAssists / playerCount),
      minutes: Math.round(totalMinutes / playerCount),
      passes: Math.round(totalPasses / playerCount),
      tackles: Math.round(totalTackles / playerCount),
      shots: Math.round(totalShots / playerCount),
      accuracy: validShotsPlayers > 0 ? Math.round(totalShotsAccuracy / validShotsPlayers) : 0,
    }
  })
}

/**
 * Determines if a match was won, lost, or drawn
 */
export const getMatchOutcome = (match: Event): 'win' | 'loss' | 'draw' => {
  if (
    match.status !== MatchStatus.FINISHED ||
    match.homeScore === undefined ||
    match.awayScore === undefined
  ) {
    return 'draw'
  }

  // If we're the home team
  if (match.matchType === 'home') {
    if (match.homeScore > match.awayScore) return 'win'
    if (match.homeScore < match.awayScore) return 'loss'
    return 'draw'
  }
  // If we're the away team
  else {
    if (match.homeScore < match.awayScore) return 'win'
    if (match.homeScore > match.awayScore) return 'loss'
    return 'draw'
  }
}

/**
 * Calculates win rate and other statistics from match data
 */
export const calculateMatchStatistics = (matches: Event[]) => {
  const finishedMatches = matches.filter(match => match.status === MatchStatus.FINISHED)

  if (finishedMatches.length === 0) {
    return {
      winRate: 0,
      totalMatches: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      trend: 0,
    }
  }

  // Count wins, losses, and draws
  const outcomes = finishedMatches.map(match => getMatchOutcome(match))
  const wins = outcomes.filter(outcome => outcome === 'win').length
  const losses = outcomes.filter(outcome => outcome === 'loss').length
  const draws = outcomes.filter(outcome => outcome === 'draw').length

  // Calculate win rate (as a percentage)
  const winRate = Math.round((wins / finishedMatches.length) * 100)

  // Calculate trend (compare recent matches to overall performance)
  // For simplicity, let's compare the most recent 2 matches to the overall rate
  const recentMatches = [...finishedMatches]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)

  const recentOutcomes = recentMatches.map(match => getMatchOutcome(match))
  const recentWins = recentOutcomes.filter(outcome => outcome === 'win').length
  const recentWinRate = recentMatches.length > 0 ? (recentWins / recentMatches.length) * 100 : 0

  // Trend is positive if recent win rate is higher than overall
  const trend = recentWinRate - winRate

  return {
    winRate,
    totalMatches: finishedMatches.length,
    wins,
    losses,
    draws,
    trend,
  }
}

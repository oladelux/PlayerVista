import { Action, Player, PlayerActions, PlayerPerformance } from '@/api'
import { getHalfData, HalfType } from '@/utils/phaseMetrics.ts'
import { PlayerPositionType } from '@/views/PlayersView/form/PlayerPosition.ts'

/*export type PlayerPositionType = 'GK' | 'LB' | 'LCB' | 'RCB' | 'CB' | 'RB'
  | 'LWB' | 'RWB' | 'DM' | 'CDM' | 'CM' | 'CAM' | 'LCM' | 'RCM' | 'LM' | 'RM' | 'RW' | 'LW' | 'ST' | 'CF'*/

export type PlayerStats = 'shotsOnTarget' | 'shotsOffTarget' | 'tacklesWon' | 'tacklesLost' | 'goals' | 'pass' |
  'assists' | 'interceptions' | 'clearance' | 'blockedShots' | 'aerialDuels' | 'aerialClearance' |
  'fouls' | 'saves' | 'mistakes' | 'recoveries' | 'blocks' | 'yellowCards' | 'redCards' | 'offside' |
  'cornerKick' | 'freekick' | 'dribble' | 'penaltyWon' | 'penaltyTaken' | 'PossessionLost' |
  'duels' | 'duelsWon' | 'touches' | 'successfulDribble' | 'dribbles' | 'groundDuels' | 'groundDuelsWon' |
  'foulsConceded' | 'aerialDuelsWon' | 'errors'

export type FilteredActions = {
  [key in keyof PlayerActions]: {
    firstHalf: Action[];
    secondHalf: Action[];
    fullTime: Action[];
  };
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
  const computeValue = (120) / (120 - data)
  return (fieldHeight) / (computeValue)
}

const convertLandscapeToPortraitOnYAxis = (data: number) => {
  const fieldHeight = 120
  const computeValue = (200) / (200 - data)
  const xScaleFactor = (120) / (computeValue)
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
    while(yCount < 80) {
      sectors[sector] = {
        count: 0,
        x1: xCount,
        x2: xCount + sectorWidth,
        y1: yCount,
        y2: yCount + sectorHeight,
      }
      for(const loc of locations) {
        if((loc.x > xCount && loc.x < (xCount + sectorWidth)) &&
          (loc.y > yCount && loc.y <= (yCount + sectorHeight))) {
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
  const playerDataMap = events.reduce((acc, event) => {
    acc[event.playerId] = event.actions
    return acc
  }, {} as Record<string, PlayerActions>)

  const playerMinutePlayed = events.reduce((acc, event) => {
    acc[event.playerId] = event.minutePlayed
    return acc
  }, {} as Record<string, number>)

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
  if(!playerId) {
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
  'GK': { x: 5, y: 40 },
  'LB': { x: 20, y: 10 },
  'LCB': { x: 20, y: 25 },
  'RCB': { x: 20, y: 55 },
  'CB': { x: 20, y: 40 },
  'RB': { x: 20, y: 70 },
  'LWB': { x: 40, y: 5 },
  'RWB': { x: 40, y: 75 },
  'CDM': { x: 40, y: 40 },
  'DM': { x: 60, y: 75 },
  'CM': { x: 60, y: 40 },
  'CAM': { x: 80, y: 40 },
  'LCM': { x: 60, y: 30 },
  'RCM': { x: 60, y: 50 },
  'LM': { x: 60, y: 10 },
  'RM': { x: 60, y: 70 },
  'RW': { x: 90, y: 70 },
  'LW': { x: 90, y: 10 },
  'ST': { x: 110, y: 40 },
  'CF': { x: 110, y: 40 },
}

const filterActionsByHalf = (actions: Action[]) => {
  const firstHalf = actions.filter(action => action.timestamp >= 0 && action.timestamp <= 45)
  const secondHalf = actions.filter(action => action.timestamp >= 46 && action.timestamp <= 90)
  const fullTime = actions.filter(action => action.timestamp >= 0 && action.timestamp <= 90)

  return { firstHalf, secondHalf, fullTime }
}

export const getFilteredActions = (playerActions: PlayerActions) => {
  const filteredActions = {} as FilteredActions

  for (const [key, actions] of Object.entries(playerActions)) {
    filteredActions[key as keyof PlayerActions] = filterActionsByHalf(actions)
  }

  return filteredActions
}

export type OffensiveChartDataType = {
  TS: number[],
  S_ONT: number[],
  S_OFFT: number[],
  TD: number[],
  SD: number[],
  TP: number[],
  SP: number[],
  TG: number[],
  TA: number[],
  P_SC: number[],
  P_LS: number[],
}

export type DefensiveChartDataType = {
  S_TKLs: number[],
  T_TKLs: number[],
  TI: number[],
  TC: number[],
  TB: number[],
  T_AD: number[],
  ADW: number[],
}

export type PossessionChartDataType = {
  S_TKLs: number[],
  SUS_C: number[],
  T: number[],
  ATT_TO: number[],
  SUC_TO: number[],
}

export type DisciplineChartDataType = {
  CrdY: number[],
  CrdR: number[],
  Fls: number[],
}

export type GoalkeeperChartDataType = {
  SOT_A: number[],
  Saves: number[],
  P_Sv: number[],
  P_ms: number[],
  DFK_F: number[],
  FK_S: number[],
  FK_GS: number[],
  '1v1_F': number[],
  '1v1_S': number[],
}

export const getOffensiveChartData = ( playerPerformance: PlayerPerformance[] ) => {
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
    const shotsOnTarget = shots.filter((shot) => shot.value === 'SUCCESSFUL').length
    const shotsOffTarget = shots.filter((shot) => shot.value === 'UNSUCCESSFUL').length
    const totalDribbles = dribbles.length
    const successfulDribbles = dribbles.filter((dribble) => dribble.value === 'SUCCESSFUL').length
    const totalPasses = passes.length
    const successfulPasses = passes.filter((pass) => pass.value === 'SUCCESSFUL').length
    const totalGoals = goals.length
    const totalAssists = assists.length
    const penaltiesScored = penalty.filter((x) => x.value === 'SUCCESSFUL').length
    const penaltiesLost = penalty.filter((x) => x.value === 'UNSUCCESSFUL').length

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

export const getDefensiveChartData = ( playerPerformance: PlayerPerformance[] ) => {
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
    const successfulTackles = tackles.filter((tackle) => tackle.value === 'SUCCESSFUL').length
    const totalInterceptions = interceptions.length
    const totalClearances = clearances.length
    const totalBlocks = blocks.length
    const totalAerialDuels = aerialDuels.length
    const aerialDuelsWon = aerialDuels.filter((duel) => duel.value === 'SUCCESSFUL').length

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

export const getPossessionChartData = ( playerPerformance: PlayerPerformance[] ) => {
  const possessionChartData = {
    S_TKLs: [],
    SUS_C: [],
    T: [],
    ATT_TO: [],
    SUC_TO: [],
  } as PossessionChartDataType

  playerPerformance.reduce((acc: PossessionChartDataType, performance) => {
    const tackles = performance.actions?.tackles || []
    const touches = performance.actions?.touches || []
    const takeOns = performance.actions?.dribbles || []
    const crosses = performance.actions?.crosses || []

    const successfulCrosses = tackles.filter((cross) => cross.value === 'SUCCESSFUL').length
    const totalCrosses = crosses.length
    const totalTouches = touches.length
    const attemptedTakeOns = takeOns.length
    const successfulTakeOns = takeOns.filter((takeOn) => takeOn.value === 'SUCCESSFUL').length

    acc.S_TKLs.push(totalCrosses)
    acc.SUS_C.push(successfulCrosses)
    acc.T.push(totalTouches)
    acc.ATT_TO.push(attemptedTakeOns)
    acc.SUC_TO.push(successfulTakeOns)

    return acc
  }, possessionChartData)

  return possessionChartData
}

export const getDisciplinaryChartData = ( playerPerformance: PlayerPerformance[] ) => {
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

export const getGoalkeeperChartData = ( playerPerformance: PlayerPerformance[] ) => {
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
    const penaltyMissesCount = penaltyMisses.filter((penalty) => penalty.value === 'UNSUCCESSFUL').length
    const directFreeKickFacedCount = directFreeKickFaced.length
    const freeKickSavedCount = freeKickSaved.filter((freeKick) => freeKick.value === 'SUCCESSFUL').length
    const freeKickGoalSavedCount = freeKickSaved.filter((freeKick) => freeKick.value === 'SUCCESSFUL').length
    const oneVOneFaced = oneVOne.length
    const oneVOneSaved= oneVOne.filter((oneVOne) => oneVOne.value === 'SUCCESSFUL').length

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
  totalShots: number;
  shotsOnTarget: number;
  shotsOffTarget: number;
  shotsAccuracy: number;
  totalDribbles: number;
  successfulDribbles: number;
  dribblesAccuracy: number;
  totalPasses: number;
  successfulPasses: number;
  passAccuracy: number;
  totalGoals: number;
  totalAssists: number;
  penaltiesScored: number;
  penaltiesLost: number;
  penaltiesAccuracy: number;
}

export function getOffensiveData(data: PlayerActions): OffensiveFullPlayerData {
  const totalShots = data.shots.length ?? 0
  const shotsOnTarget = data.shots.filter((shot) => shot.value === 'SUCCESSFUL').length ?? 0
  const shotsOffTarget = data.shots.filter((shot) => shot.value === 'UNSUCCESSFUL').length ?? 0
  const shotsAccuracy = totalShots > 0 ? Math.round((shotsOnTarget / totalShots) * 100) : 0 ?? 0
  const totalDribbles = data.dribbles.length ?? 0
  const successfulDribbles = data.dribbles.filter((dribble) => dribble.value === 'SUCCESSFUL').length ?? 0
  const dribblesAccuracy = totalDribbles > 0 ?
    Math.round((successfulDribbles / totalDribbles) * 100) : 0 ?? 0
  const totalPasses = data.passes.length ?? 0
  const successfulPasses = data.passes.filter((pass) => pass.value === 'SUCCESSFUL').length ?? 0
  const passAccuracy = totalPasses > 0 ? Math.round((successfulPasses / totalPasses) * 100) : 0 ?? 0
  const totalGoals = data.goals.length ?? 0
  const totalAssists = data.assists.length ?? 0
  const penaltiesScored = data.penalty.filter((x) => x.value === 'SUCCESSFUL').length ?? 0
  const penaltiesLost = data.penalty.filter((x) => x.value === 'UNSUCCESSFUL').length ?? 0
  const penaltiesAccuracy = penaltiesScored > 0 ?
    Math.round((penaltiesScored / (penaltiesScored + penaltiesLost)) * 100) : 0 ?? 0

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
  successfulTackles: number;
  totalTackles: number;
  totalInterceptions: number;
  totalClearances: number;
  totalBlocks: number;
  totalAerialDuels: number;
  aerialDuelsWon: number;
}

export function getDefensiveData(data: PlayerActions): defensiveFullPlayerData {
  const totalTackles = data.tackles.length ?? 0
  const successfulTackles = data.tackles.filter((tackle) => tackle.value === 'SUCCESSFUL').length ?? 0
  const totalInterceptions = data.interceptions.length ?? 0
  const totalClearances = data.clearances.length ?? 0
  const totalBlocks = data.blocks.length ?? 0
  const totalAerialDuels = data.aerialDuels.length ?? 0
  const aerialDuelsWon = data.aerialDuels.filter((duel) => duel.value === 'SUCCESSFUL').length ?? 0

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
  totalCrosses: number;
  successfulCrosses: number;
  totalTouches: number;
  attemptedTakeOns: number;
  successfulTakeOns: number;
}

export function getPossessionData(data: PlayerActions): possessionFullPlayerData {
  const totalCrosses = data.crosses.length ?? 0
  const successfulCrosses = data.crosses.filter((cross) => cross.value === 'SUCCESSFUL').length ?? 0
  const totalTouches = data.touches.length ?? 0
  const attemptedTakeOns = data.dribbles.length ?? 0
  const successfulTakeOns = data.dribbles.filter((takeOn) => takeOn.value === 'SUCCESSFUL').length ?? 0

  return {
    totalCrosses,
    successfulCrosses,
    totalTouches,
    attemptedTakeOns,
    successfulTakeOns,
  }
}

export type disciplinaryFullPlayerData = {
  totalYellowCards: number;
  totalRedCards: number;
  totalFouls: number;
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
  shotsOnTargetAgainst: number;
  saves: number;
  savePercentage: number;
  penaltySaves: number;
  penaltyMisses: number;
  penaltySavePercentage: number;
  directFreeKickFaced: number;
  freeKickSaved: number;
  freeKickGoalSaved: number;
  oneVOneFaced: number;
  oneVOneSaved: number;
  oneVOneSavedPercentage: number
}

export function getGoalkeeperData(data: PlayerActions): goalkeeperFullPlayerData {
  const shotsOnTargetAgainst = data.shots.length ?? 0
  const saves = data.saves.length ?? 0
  const savePercentage = shotsOnTargetAgainst > 0 ?
    Math.round((saves / shotsOnTargetAgainst) * 100) : 0
  const penaltySaves = data.penaltySaves.length ?? 0
  const penaltyMisses = data.penalty.filter((penalty) => penalty.value === 'UNSUCCESSFUL').length ?? 0
  const penaltySavePercentage = penaltySaves > 0 ?
    (penaltySaves / Math.round((penaltySaves + penaltyMisses)) * 100) : 0 ?? 0
  const directFreeKickFaced = data.freekick.length ?? 0
  const freeKickSaved = data.freekickSaves.length ?? 0
  const freeKickGoalSaved = data.freekickSaves.filter((freeKick) => freeKick.value === 'SUCCESSFUL').length ?? 0
  const oneVOneFaced = data.OneVOneSaves.length ?? 0
  const oneVOneSaved = data.OneVOneSaves.filter((oneVOne) => oneVOne.value === 'SUCCESSFUL').length ?? 0
  const oneVOneSavedPercentage = oneVOneFaced > 0 ?
    Math.round((oneVOneSaved / oneVOneFaced) * 100) : 0 ?? 0

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

export function singleMatchOffensiveData( performance: PlayerPerformance){
  const firstHalfData = getHalfData(performance, HalfType.FirstHalf)
  const secondHalfData = getHalfData(performance, HalfType.SecondHalf)
  const fullTimeData = getHalfData(performance, HalfType.FullTime)

  if(!firstHalfData || !secondHalfData || !fullTimeData) {
    return null
  }

  const offensiveData = {
    firstHalf: getOffensiveData(firstHalfData),
    secondHalf: getOffensiveData(secondHalfData),
    fullTime: getOffensiveData(fullTimeData),
  }

  const defensiveData = {
    firstHalf: getDefensiveData(firstHalfData),
    secondHalf: getDefensiveData(secondHalfData),
    fullTime: getDefensiveData(fullTimeData),
  }

  const possessionData = {
    firstHalf: getPossessionData(firstHalfData),
    secondHalf: getPossessionData(secondHalfData),
    fullTime: getPossessionData(fullTimeData),
  }

  const disciplinaryData = {
    firstHalf: getDisciplinaryData(firstHalfData),
    secondHalf: getDisciplinaryData(secondHalfData),
    fullTime: getDisciplinaryData(fullTimeData),
  }

  const goalkeeperData = {
    firstHalf: getGoalkeeperData(firstHalfData),
    secondHalf: getGoalkeeperData(secondHalfData),
    fullTime: getGoalkeeperData(fullTimeData),
  }

  return {
    offensiveData,
    defensiveData,
    possessionData,
    disciplinaryData,
    goalkeeperData,
  }
}

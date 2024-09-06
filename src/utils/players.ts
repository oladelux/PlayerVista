import { Player, PlayerActions, PlayerPerformance } from '@/api'

export type PlayerPositionType = 'GK' | 'LB' | 'LCB' | 'RCB' | 'CB' | 'RB'
  | 'LWB' | 'RWB' | 'DM' | 'CDM' | 'CM' | 'CAM' | 'LCM' | 'RCM' | 'LM' | 'RM' | 'RW' | 'LW' | 'ST' | 'CF'

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

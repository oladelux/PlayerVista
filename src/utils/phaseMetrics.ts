import { PlayerActionPeriod, PlayerActions, PlayerPerformance } from '@/api'

export type PhaseActions = {
  name: keyof PlayerActions
  label: string
  tailwindColor: string
}

export enum HalfType {
  FullTime = 'fullTime',
  FirstHalf = 'firstHalf',
  SecondHalf = 'secondHalf',
}

export const OffensiveMetrics: PhaseActions[] = [
  {
    name: 'goals',
    label: 'Goals',
    tailwindColor: '#185BE8',
  },
  {
    name: 'assists',
    label: 'Assists',
    tailwindColor: '#9F18E8',
  },
  {
    name: 'shots',
    label: 'Shots',
    tailwindColor: '#E86B18',
  },
  {
    name: 'passes',
    label: 'Passes',
    tailwindColor: '#E818A6',
  },
  {
    name: 'penalty',
    label: 'Penalties',
    tailwindColor: '#004682',
  },
  {
    name: 'dribbles',
    label: 'Dribbles',
    tailwindColor: '#428467',
  },
]
export const DefensiveMetrics: PhaseActions[] = [
  {
    name: 'tackles',
    label: 'Tackles',
    tailwindColor: '#185BE8',
  },
  {
    name: 'interceptions',
    label: 'Interceptions',
    tailwindColor: '#9F18E8',
  },
  {
    name: 'clearances',
    label: 'Clearances',
    tailwindColor: '#E86B18',
  },
  {
    name: 'blocks',
    label: 'Blocks',
    tailwindColor: '#E818A6',
  },
  {
    name: 'aerialDuels',
    label: 'Aerial Duels',
    tailwindColor: '#004682',
  },
]
export const PossessionMetrics: PhaseActions[] = [
  {
    name: 'touches',
    label: 'Touches',
    tailwindColor: '#185BE8',
  },
  {
    name: 'crosses',
    label: 'Crosses',
    tailwindColor: '#9F18E8',
  },
  {
    name: 'recoveries',
    label: 'Recoveries',
    tailwindColor: '#E86B18',
  },
]
export const DisciplineMetric: PhaseActions[] = [
  {
    name: 'yellowCard',
    label: 'Yellow Card',
    tailwindColor: '#185BE8',
  },
  {
    name: 'redCard',
    label: 'Red Card',
    tailwindColor: 'v',
  },
  {
    name: 'fouls',
    label: 'Fouls',
    tailwindColor: '#E86B18',
  },
]
export const GoalkeepingMetrics: PhaseActions[] = [
  {
    name: 'saves',
    label: 'Saves',
    tailwindColor: '#185BE8',
  },
  {
    name: 'goalConceded',
    label: 'Goal Conceded',
    tailwindColor: '#9F18E8',
  },
  {
    name: 'penaltySaves',
    label: 'Penalty Saves',
    tailwindColor: '#E86B18',
  },
  {
    name: 'freekickSaves',
    label: 'Freekick Saves',
    tailwindColor: '#E818A6',
  },
  {
    name: 'OneVOneSaves',
    label: '1 v 1 Saves',
    tailwindColor: '#004682',
  },
]

export const groupActionsByCategory = (actions: PlayerActions, metrics: PhaseActions[]) => {
  return metrics.map(metric => ({
    label: metric.label,
    data: actions[metric.name] || [],
    color: metric.tailwindColor,
  }))
}

export const getHalfData = (performance: PlayerPerformance | null, half: HalfType) => {
  if (!performance) return null
  const { actions } = performance
  const defaultActions: PlayerActions = {
    shots: [],
    tackles: [],
    goals: [],
    passes: [],
    assists: [],
    interceptions: [],
    clearances: [],
    blockedShots: [],
    aerialDuels: [],
    aerialClearance: [],
    shortPass: [],
    longPass: [],
    fouls: [],
    saves: [],
    mistakes: [],
    recoveries: [],
    blocks: [],
    yellowCard: [],
    redCard: [],
    offside: [],
    cornerKick: [],
    freekick: [],
    dribbles: [],
    penalty: [],
    touches: [],
    crosses: [],
    goalConceded: [],
    OneVOneSaves: [],
    penaltySaves: [],
    freekickSaves: [],
  }

  // Filter actions based on the half timestamp range
  return Object.keys(defaultActions).reduce(
    (acc, key) => {
      const actionList = actions[key as keyof PlayerActions] || []
      acc[key as keyof PlayerActions] = actionList.filter(action => {
        if (half === 'firstHalf') return action.period === PlayerActionPeriod.FirstHalf
        if (half === 'secondHalf') return action.period === PlayerActionPeriod.SecondHalf
        return true
      })
      return acc
    },
    { ...defaultActions },
  )
}

export function aggregatePlayerActions(performanceData: PlayerPerformance[]): PlayerActions {
  const aggregatedActions: PlayerActions = {
    shots: [],
    touches: [],
    tackles: [],
    goals: [],
    passes: [],
    shortPass: [],
    longPass: [],
    assists: [],
    interceptions: [],
    clearances: [],
    blockedShots: [],
    aerialDuels: [],
    aerialClearance: [],
    fouls: [],
    saves: [],
    mistakes: [],
    recoveries: [],
    blocks: [],
    yellowCard: [],
    redCard: [],
    offside: [],
    cornerKick: [],
    freekick: [],
    dribbles: [],
    penalty: [],
    crosses: [],
    goalConceded: [],
    penaltySaves: [],
    freekickSaves: [],
    OneVOneSaves: [],
  }
  if (!performanceData || !performanceData.length) {
    return aggregatedActions
  }
  performanceData.forEach(performance => {
    Object.entries(performance.actions).forEach(([key, actions]) => {
      if (aggregatedActions[key as keyof PlayerActions]) {
        aggregatedActions[key as keyof PlayerActions].push(...actions)
      }
    })
  })

  return aggregatedActions
}

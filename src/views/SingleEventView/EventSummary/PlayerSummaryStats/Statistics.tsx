import { FC, useState } from 'react'

import { convertSecondsToGameMinute, getPlayerActions } from '@/utils/players.ts'
import { Player, PlayerPerformance } from '@/api'

import { TabButton } from '@/component/TabButton/TabButton.tsx'
import { TabContent } from '@/component/TabContent/TabContent.tsx'
import { Offensive, OffensiveData } from '@/component/Offensive/Offensive.tsx'
import { Defensive, DefensiveData } from '@/component/Defensive/Defensive.tsx'

type StatisticsProps = {
  players: Player[]
  performance: PlayerPerformance[]
}

const tabCategory = ['Offensive', 'Defensive']

export const Statistics: FC<StatisticsProps> = ({ players, performance }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(tabCategory[0])
  const data = getPlayerActions(players, performance)

  const offensiveData: OffensiveData[] = data.map(item => {
    const actions = item.actions || {}
    const shotOnTarget = actions.shots?.filter(shot => shot.value === 'SUCCESSFUL')?.length || 0
    const shotOffTarget = actions.shots?.filter(shot => shot.value === 'NOT_SUCCESSFUL')?.length || 0
    const completedPasses = actions.pass?.filter(item => item.value === 'SUCCESSFUL')?.length || 0

    return {
      number: item.jerseyNum,
      name: item.name,
      position: item.position,
      minutePlayed: convertSecondsToGameMinute(item.minutePlayed) || 0,
      goals: actions.goals?.length || 0,
      shots: shotOnTarget + shotOffTarget,
      assist: actions.assists?.length || 0,
      shotsOnTarget: shotOnTarget,
      shotsOffTarget: shotOffTarget,
      cmp: completedPasses,
    }
  })

  const defensiveData: DefensiveData[] = data.map(item => {
    const actions = item.actions || {}
    return {
      number: item.jerseyNum,
      name: item.name,
      position: item.position,
      minutePlayed: convertSecondsToGameMinute(item.minutePlayed) || 0,
      totalTackles: actions.tackles?.length || 0,
      interceptions: actions.interceptions?.length || 0,
      clearance: actions.clearance?.length || 0,
      blockedShots: actions.blocked_shots?.length || 0,
      aerialDuels: actions.aerial_duels?.length || 0,
      fouls: actions.fouls?.length || 0,
    }
  })

  return (
    <div className='Statistics'>
      <div className='Statistics__title'>Player Statistics</div>
      <div className='Statistics__wrapper'>
        <div className='Statistics__wrapper-tab'>
          {tabCategory.map(category =>
            <TabButton
              className='Statistics__wrapper-tab-category'
              key={category}
              isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </TabButton>,
          )}
        </div>
        <div className='Event-summary__content-section'>
          {tabCategory.map(category =>
            <TabContent key={category} isActive={selectedCategory === category}>
              {category === 'Offensive' && <Offensive offensiveData={offensiveData} />}
              {category === 'Defensive' && <Defensive defensiveData={defensiveData} />}
            </TabContent>,
          )}
        </div>
      </div>
    </div>
  )
}

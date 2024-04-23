import { FC, useState } from 'react'

import { EventData, getPlayerActions } from '../../../../utils/players.ts'
import { Player } from '../../../../api'

import { TabButton } from '../../../../component/TabButton/TabButton.tsx'
import { TabContent } from '../../../../component/TabContent/TabContent.tsx'
import { Offensive, OffensiveData } from '../../../../component/Offensive/Offensive.tsx'
import { Defensive, DefensiveData } from '../../../../component/Defensive/Defensive.tsx'

type StatisticsProps = {
  players: Player[]
  footballEventsData: EventData[]
}

const tabCategory = ['Offensive', 'Defensive']

export const Statistics:FC<StatisticsProps> = ({ players, footballEventsData }) => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const data = getPlayerActions(players, footballEventsData)

  const offensiveData: OffensiveData[] = data.map(item => {
    const actions = item.actions || {}
    const shotOnTarget = actions.shots?.find(shot => shot.type === 'shotsOnTarget')
    const shotOffTarget = actions.shots?.find(shot => shot.type === 'shotsOffTarget')
    return ({
      number: item.jerseyNum,
      name: item.name,
      position: item.position,
      minutePlayed: 90,
      goals: actions.goals?.value || 0,
      shots: shotOnTarget && shotOffTarget &&(shotOnTarget.value + shotOffTarget.value) || 0,
      assist: actions.assist?.value || 0,
      shotsOnTarget: shotOnTarget?.value || 0,
      shotsOffTarget: shotOffTarget?.value || 0,
    })
  })

  const defensiveData: DefensiveData[] = data.map(item => {
    const actions = item.actions || {}
    return ({
      number: item.jerseyNum,
      name: item.name,
      position: item.position,
      minutePlayed: 90,
      totalTackles: actions.totalTackles?.value || 0,
      interceptions: actions.interceptions?.value || 0,
      clearance: actions.clearance?.value || 0,
      blockedShots: actions.blockedShots?.value || 0,
      aerialDuels: actions.aerialDuels?.value || 0,
      fouls: actions.fouls?.value || 0,
    })
  })

  const activeCategory = selectedCategory || tabCategory[0]

  return (
    <div className='Statistics'>
      <div className='Statistics__title'>Player Statistics</div>
      <div className='Statistics__wrapper'>
        <div className='Statistics__wrapper-tab'>
          {tabCategory.map(category =>
            <TabButton
              className='Statistics__wrapper-tab-category'
              key={category}
              isActive={activeCategory === category}
              onClick={() => setSelectedCategory(category)}>{category}
            </TabButton>,
          )}
        </div>
        <div className='Event-summary__content-section'>
          {tabCategory.map(category =>
            <TabContent key={category} isActive={activeCategory === category}>
              {category === 'Offensive' && <Offensive offensiveData={offensiveData} />}
              {category === 'Defensive' && <Defensive defensiveData={defensiveData} />}
            </TabContent>,
          )}
        </div>
      </div>
    </div>
  )
}

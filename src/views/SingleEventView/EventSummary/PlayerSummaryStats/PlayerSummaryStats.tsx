import { Player } from '../../../../api'
import { ChangeEvent, FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { Radio } from '@mui/material'

import {
  getHeatmapSectors,
  getPositionalData, HeatSectorsType,
  LocationData,
} from '../../../../utils/players.ts'
import { playerPerformanceSelector } from '../../../../store/slices/PlayerPerformanceSlice.ts'

import { HeatMap } from './HeatMap.tsx'
import { Statistics } from './Statistics.tsx'

import './PlayerSummaryStats.scss'

const predefinedOrder = [
  'GK', 'LB', 'LWB', 'CB', 'RWB', 'RB', 'CDM', 'CM', 'LM', 'RM', 'CAM', 'LW', 'RW', 'CF', 'ST',
]

type PlayerSummaryStatsProps = {
  players: Player[]
}

export const PlayerSummaryStats:FC<PlayerSummaryStatsProps> = ({ players }) => {
  const { performance } = useSelector(playerPerformanceSelector)
  const teamPlayers = performance.map(player => ({
    select: player.playerId,
    num: player.jerseyNumber,
    position: player.position,
    name: player.firstName + ' ' + player.lastName,
  }))

  const sortedTeamPlayers = teamPlayers.sort((a, b) => {
    return predefinedOrder.indexOf(a.position) - predefinedOrder.indexOf(b.position)
  })

  const currentPlayerId = teamPlayers.length > 0 ? teamPlayers[0].select : ''
  const currentLocations = getPositionalData(performance, currentPlayerId )
  const currentHeatSectors = getHeatmapSectors(currentLocations, 4, 4)

  const [selectedPlayer, setSelectedPlayer] = useState<string>(currentPlayerId)
  const [playerLocations, setPlayerLocations] = useState<LocationData[]>(currentLocations)
  const [heatSectors, setHeatSectors] = useState<HeatSectorsType[]>(currentHeatSectors)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const playerId = event.target.value
    setSelectedPlayer(playerId)
    const locations = getPositionalData(performance, playerId )
    setPlayerLocations(locations)
    const heatSectors = locations && getHeatmapSectors(locations, 4, 4)
    heatSectors && setHeatSectors(heatSectors)
  }

  const summaryStatsColumns = [
    {
      key: 'select',
      title: '',
      render: (value: string) => (
        <Radio
          checked={selectedPlayer === value}
          onChange={handleChange}
          value={value}
        />
      ),
    },
    { key: 'num', title: 'Num' },
    { key: 'position', title: 'Position' },
    { key: 'name', title: 'Name' },
  ]

  if(performance.length === 0){
    return 'No player data available'
  }

  return (
    <div className='Player-summary'>
      <HeatMap
        playerLocations={playerLocations}
        heatSectors={heatSectors}
        summaryStatsColumns={summaryStatsColumns}
        teamPlayers={sortedTeamPlayers}
      />
      <Statistics players={players} performance={performance} />
    </div>
  )
}

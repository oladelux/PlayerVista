import { Player } from '../../../../api'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Radio } from '@mui/material'

import {
  footballEventsData,
  getHeatmapSectors,
  getPositionalData,
  HeatSectorsType,
  LocationData,
} from '../../../../utils/players.ts'

import { HeatMap } from './HeatMap.tsx'
import { Statistics } from './Statistics.tsx'

import './PlayerSummaryStats.scss'

type PlayerSummaryStatsProps = {
  players: Player[]
}

export const PlayerSummaryStats:FC<PlayerSummaryStatsProps> = ({ players }) => {
  const teamPlayers = players.map(player => ({
    select: player.id,
    num: player.uniformNumber,
    position: player.position,
    name: player.firstName + ' ' + player.lastName,
  }))
  const playerChecked = [teamPlayers[0].select]
  const currentPlayerId = teamPlayers[0].select
  const currentLocations = getPositionalData(footballEventsData, currentPlayerId )
  const currentHeatSectors = getHeatmapSectors(currentLocations, 4, 4)

  const [selectedPlayer, setSelectedPlayer] = useState<string>(playerChecked[0])
  const [scale, setScale] = useState<number>(0)
  const [playerLocations, setPlayerLocations] = useState<LocationData[]>(currentLocations)
  const [heatSectors, setHeatSectors] = useState<HeatSectorsType[]>(currentHeatSectors)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const playerId = event.target.value
    setSelectedPlayer(playerId)
    const locations = getPositionalData(footballEventsData, playerId )
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

  useEffect(() => {
    setScale(window.innerWidth <= 500 ? 4.5 : 5)
  }, [])

  return (
    <div className='Player-summary'>
      <HeatMap
        scale={scale}
        playerLocations={playerLocations}
        heatSectors={heatSectors}
        summaryStatsColumns={summaryStatsColumns}
        teamPlayers={teamPlayers}
      />
      <Statistics players={players} footballEventsData={footballEventsData} />
    </div>
  )
}

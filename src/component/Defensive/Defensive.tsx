import { FC } from 'react'

import { Table } from '../Table/Table'

import './Defensive.scss'

export type DefensiveData = {
  number: number
  name: string
  position: string
  minutePlayed: number
  totalTackles: number
  interceptions: number
  clearance: number
  blockedShots: number
  aerialDuels: number
  fouls: number
}

const defensiveColumns = [
  { key: 'number', title: 'Num' },
  { key: 'name', title: 'Player' },
  { key: 'position', title: 'Position' },
  { key: 'minutePlayed', title: 'MP', placeholder: 'Match Played' },
  { key: 'totalTackles', title: 'TT', placeholder: 'Total Tackles' },
  { key: 'interceptions', title: 'INT', placeholder: 'Interceptions' },
  { key: 'clearance', title: 'C', placeholder: 'Clearance' },
  { key: 'blockedShots', title: 'B.Shots', placeholder: 'Blocked Shots' },
  { key: 'aerialDuels', title: 'AD', placeholder: 'Aerial Duels' },
  { key: 'fouls', title: 'F', placeholder: 'Fouls' },
]

type DefensiveProps = {
  defensiveData: DefensiveData[]
}

export const Defensive: FC<DefensiveProps> = ({ defensiveData }) => {
  return (
    <div className='Defensive'>
      <Table columns={defensiveColumns} data={defensiveData} />
    </div>
  )
}

import { FC } from 'react'

import { Table } from '../Table/Table.tsx'

import './Offensive.scss'

export type OffensiveData = {
  number: string
  name: string
  position: string
  minutePlayed: number
  goals: number
  assist: number
  shots: number
  shotsOnTarget: string | number
  shotsOffTarget: string | number
}

const offensiveColumns = [
  { key: 'number', title: 'Num' },
  { key: 'name', title: 'Player' },
  { key: 'position', title: 'Position' },
  { key: 'minutePlayed', title: 'MP', placeholder: 'Match Played' },
  { key: 'goals', title: 'G', placeholder: 'Goals' },
  { key: 'assist', title: 'A', placeholder: 'Assists' },
  { key: 'shots', title: 'S', placeholder: 'Total Shots' },
  { key: 'cmp', title: 'Cmp', placeholder: 'Completed Passes' },
  { key: 'shotsOnTarget', title: 'S.ON', placeholder: 'Shots On Target' },
  { key: 'shotsOffTarget', title: 'S.OFF', placeholder: 'Shots Off Target' },
]

type OffensiveProps = {
  offensiveData: OffensiveData[]
}

export const Offensive:FC<OffensiveProps> = ({ offensiveData }) => {
  return (
    <div className='Offensive'>
      <Table columns={offensiveColumns} data={offensiveData} />
    </div>
  )
}

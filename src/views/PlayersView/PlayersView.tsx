import { FC, useMemo } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'

import { Player } from '@/api'
import { calculateAge } from '@/services/helper.ts'
import { usePlayers } from '@/hooks/usePlayers.ts'

import { Link, useParams } from 'react-router-dom'
import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { Table } from '../../component/Table/Table'

import './PlayersView.scss'

const playerColumns = [
  { key: 'name', title: 'Name' },
  { key: 'age', title: 'Age' },
  { key: 'position', title: 'Position' },
  { key: 'jerseyNumber', title: 'Jersey' },
  {
    key: 'status',
    title: 'Status',
    render: (value: boolean) => <span className={value ? 'active' : 'inactive'}>{value ? 'Active' : 'Inactive'}</span>,
  },
  {
    key: 'action',
    title: 'Action',
    render: (value: string) => <Link className='table-link' to={value}>View</Link>,
  },
]

type PlayersViewProps = {
  players: Player[]
}

const predefinedOrder = [
  'GK', 'LB', 'LWB', 'CB', 'RWB', 'RB', 'CDM', 'CM', 'LM', 'RM', 'CAM', 'LW', 'RW', 'CF', 'ST',
]

export const PlayersView:FC<PlayersViewProps> = ({ players }) => {
  const { teamId } = useParams()
  const { searchPlayerValue, handleSearchInput } = usePlayers()

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      if (searchPlayerValue) {
        // Convert both search term and player names to lowercase
        const lowercaseSearchTerm = searchPlayerValue.toLowerCase()
        const lowercasePlayerNames = `${player.firstName || ''} ${player.lastName || ''}`.toLowerCase()

        return lowercasePlayerNames.includes(lowercaseSearchTerm)
      } else {
        // If no search term, return all players
        return true
      }
    })
  }, [players, searchPlayerValue])

  const formattedPlayers = filteredPlayers.map(player => ({
    name: player.firstName + ' ' + player.lastName,
    age: calculateAge(player.birthDate),
    position: player.position,
    jerseyNumber: player.uniformNumber,
    status: true,
    action: `/team/${teamId}/players/${player.id}`,
  }))

  const sortedTeamPlayers = formattedPlayers.sort((a, b) => {
    return predefinedOrder.indexOf(a.position) - predefinedOrder.indexOf(b.position)
  })

  return (
    <DashboardLayout>
      <div className='Players-view'>
        <div className='Players-view__title'>Players</div>
        <div className='Players-view__header'>
          <div className='Players-view__header-form'>
            <FiSearch className='Players-view__header-form--search-icon'/>
            <input
              className='Players-view__header-form--input'
              type='text'
              name='search'
              placeholder='Search'
              value={searchPlayerValue}
              onChange={handleSearchInput}
            />
          </div>
          <Link to={`/team/${teamId}/players/add-player`} className='Players-view__header-link'>
            <FaPlus />
            <span className='Players-view__header-link--text'>Add Player</span>
          </Link>
        </div>
        <div className='Players-view__content'>
          <Table columns={playerColumns} data={sortedTeamPlayers} />
        </div>
      </div>
    </DashboardLayout>
  )
}

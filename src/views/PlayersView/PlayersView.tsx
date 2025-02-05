import { EyeIcon } from 'lucide-react'
import React, { useMemo } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import { Column, Table } from '../../component/Table/Table'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { usePermission } from '@/hooks/usePermission.ts'
import { usePlayer } from '@/hooks/usePlayer.ts'
import { usePlayers } from '@/hooks/usePlayers.ts'
import { calculateAge } from '@/services/helper.ts'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import './PlayersView.scss'

const playerColumns: Column<never>[] = [
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
    render: (value: { teamId: string, playerId: string }) => (<div className='flex items-center gap-2'>
      <Link className='table-link' to={`/${value.teamId}/players/${value.playerId}`}><EyeIcon width={16} /></Link>
      <Link className='table-link border-l border-l-border-line px-2' to={`/${value.teamId}/player/${value.playerId}/statistics`}>View Stats</Link>
    </div>),
  },
]

const predefinedOrder = [
  'GK', 'LB', 'LWB', 'CB', 'RWB', 'RB', 'CDM', 'CM', 'LM', 'RM', 'CAM', 'LW', 'RW', 'CF', 'ST',
]

export function PlayersView(){
  const { teamId } = useParams()
  const { searchPlayerValue, handleSearchInput } = usePlayers()
  const { userRole } = useSelector(settingsSelector)
  const { canCreatePlayer } = usePermission(userRole)
  const { players, loading, error } = usePlayer(undefined, teamId)

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
    action: { teamId, playerId: player.id },
  }))

  const sortedTeamPlayers = formattedPlayers.sort((a, b) => {
    return predefinedOrder.indexOf(a.position) - predefinedOrder.indexOf(b.position)
  })

  if (loading) return <LoadingPage />
  //TODO: Create Error Page
  if (error) {
    console.log(error)
    return 'This is an error page'
  }

  return (
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
        {canCreatePlayer && <Link to={'add-player'} className='Players-view__header-link'>
          <FaPlus/>
          <span className='Players-view__header-link--text'>Add Player</span>
        </Link>}
      </div>
      <div className='Players-view__content'>
        <Table columns={playerColumns} data={sortedTeamPlayers} />
      </div>
    </div>
  )
}

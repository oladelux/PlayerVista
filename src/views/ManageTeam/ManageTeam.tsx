import { FC, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { FaPlus } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { Player, TeamResponse } from '@/api'
import { formatDate } from '@/services/helper.ts'

import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { Table } from '../../component/Table/Table'

import './ManageTeam.scss'
import { useSelector } from 'react-redux'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import { usePermission } from '@/hooks/usePermission.ts'
import { EyeIcon } from 'lucide-react'

type ManageTeamProps = {
  teams: TeamResponse[]
  players: Player[]
  team: TeamResponse | null
}

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'noOfPlayers', title: 'No of Players' },
  { key: 'dateCreated', title: 'Date Created' },
  { key: 'homeStadium', title: 'Home Stadium' },
  {
    key: 'action',
    title: 'Action',
    render: (value: string) => (<div className='flex gap-2 items-center'>
      <Link className='table-link' to={value}><EyeIcon width={16} /></Link>
      <Link className='table-link border-l border-l-border-line px-2' to={value}>View Stats</Link>
    </div>),
  },
]

export const ManageTeam:FC<ManageTeamProps> = ({ teams, players, team }) => {
  const { userRole } = useSelector(settingsSelector)
  const { canCreateTeam } = usePermission(userRole)
  const { teamId } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const data = teams.length > 0 ? teams.map(team => ({
    name: team.teamName,
    noOfPlayers: players.filter(player => player.teamId === team.id).length,
    dateCreated: formatDate(new Date(team.creationYear)),
    homeStadium: team.stadiumName,
    action: `manage-teams/${team.id}`,
  })) : team ? [{
    name: team.teamName,
    noOfPlayers: players.filter(player => player.teamId === team.id).length,
    dateCreated: formatDate(new Date(team.creationYear)),
    homeStadium: team.stadiumName,
    action: `manage-teams/${team.id}`,
  }] : []

  return (
    <DashboardLayout>
      <div className='Manage-teams'>
        <div className='Manage-teams__title'>Team</div>
        <div className='Manage-teams__header'>
          <div className='Manage-teams__header-form'>
            <FiSearch className='Manage-teams__header-form--search-icon'/>
            <input
              className='Manage-teams__header-form--input'
              type='text'
              name='search'
              placeholder='Search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {canCreateTeam && <Link to={`/team/${teamId}/team/create-team`} className='Manage-teams__header-link'>
            <FaPlus/>
            <span className='Manage-teams__header-link--text'>Add Team</span>
          </Link>}
        </div>
        <div className='Manage-teams__content'>
          <Table columns={columns} data={data} />
        </div>
      </div>
    </DashboardLayout>
  )
}

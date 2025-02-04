import { EyeIcon } from 'lucide-react'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { Table } from '../../component/Table/Table'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { usePermission } from '@/hooks/usePermission.ts'
import { usePlayer } from '@/hooks/usePlayer.ts'
import { useTeams } from '@/hooks/useTeams.ts'
import { formatDate } from '@/services/helper.ts'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import './Teams.scss'

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'noOfPlayers', title: 'No of Players' },
  { key: 'dateCreated', title: 'Date Created' },
  { key: 'homeStadium', title: 'Home Stadium' },
  {
    key: 'action',
    title: 'Action',
    render: (value: { manageLink: string, viewStatsLink: string }) => (<div className='flex items-center gap-2'>
      <Link className='table-link' to={value.manageLink}><EyeIcon width={16} /></Link>
    </div>),
  },
]

export function Teams() {
  const { userRole } = useSelector(settingsSelector)
  const { canCreateTeam } = usePermission(userRole)
  const { teamId } = useParams()

  const { teams, error, loading } = useTeams()
  const {
    allUserPlayers: players,
    loading: playersLoading,
    error: playersError,
  } = usePlayer(undefined, teamId)

  const [searchQuery, setSearchQuery] = useState('')
  const team = teams.find(team => team.id === teamId)

  const data = teams.length > 0 ? teams.map(team => ({
    name: team.teamName,
    noOfPlayers: players.filter(player => player.teamId === team.id).length,
    dateCreated: formatDate(new Date(team.creationYear)),
    homeStadium: team.stadiumName,
    action: {
      manageLink: `${team.id}/manage-team`,
      viewStatsLink: 'view-stats',
    },
  })) : team ? [{
    name: team.teamName,
    noOfPlayers: players.filter(player => player.teamId === team.id).length,
    dateCreated: formatDate(new Date(team.creationYear)),
    homeStadium: team.stadiumName,
    action: {
      manageLink: 'manage-team',
      viewStatsLink: 'view-stats',
    },
  }] : []

  if (loading || playersLoading) return <LoadingPage message='Loading team page' />
  //TODO: Create Error Page
  if (error || playersError) return 'This is an error page'

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
          {canCreateTeam && <Link to={`/${teamId}/add-team`} className='Manage-teams__header-link'>
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

import { EyeIcon } from 'lucide-react'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { Link, useOutletContext, useParams } from 'react-router-dom'

import { Table } from '../../component/Table/Table'
import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { usePermission } from '@/hooks/usePermission.ts'
import { usePlayer } from '@/hooks/usePlayer.ts'
import { formatDate } from '@/services/helper.ts'
import './ManageTeams.scss'
import { SessionInstance } from '@/utils/SessionInstance.ts'

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

export function ManageTeams() {
  const { canCreateTeam } = usePermission()
  const teamId = SessionInstance.getTeamId()
  const { teams, teamsError: error, teamsLoading: loading } =
    useOutletContext<DashboardLayoutOutletContext>()
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
      manageLink: `/${team.id}/manage-team`,
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

  if (loading || playersLoading) return <LoadingPage />
  //TODO: Create Error Page
  if (error || playersError) return 'This is an error page'

  return (
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
        {canCreateTeam && <Link to={'/add-team'} className='Manage-teams__header-link'>
          <FaPlus/>
          <span className='Manage-teams__header-link--text'>Add Team</span>
        </Link>}
      </div>
      <div className='Manage-teams__content'>
        <Table columns={columns} data={data} />
      </div>
    </div>
  )
}

import { FC, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { FaPlus } from 'react-icons/fa'
import {Link, useParams} from 'react-router-dom'

import { TeamResult } from '../../api'
import { formatDate } from '../../services/helper'

import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { Table } from '../../component/Table/Table'

import './ManageTeam.scss'

type ManageTeamProps = {
  teams: TeamResult[]
}

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'noOfPlayers', title: 'No of Players' },
  { key: 'dateCreated', title: 'Date Created' },
  { key: 'homeStadium', title: 'Home Stadium' },
  {
    key: 'status',
    title: 'Status',
    render: (value: boolean) => <span className={value ? 'active' : 'inactive'}>{value ? 'Active' : 'Inactive'}</span>,
  },
  {
    key: 'action',
    title: 'Action',
    render: (value: string) => <a className='table-link' href={value}>View</a>,
  },
]

export const ManageTeam:FC<ManageTeamProps> = props => {
  const { teamId } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const data = props.teams.map(team => ({
    name: team.teamName,
    noOfPlayers: team.players.length,
    dateCreated: formatDate(new Date(team.creationYear)),
    homeStadium: team.stadiumName,
    status: team.active,
    action: `manage-team/${team.id}`,
  }))

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
          <Link to={`/team/${teamId}/team/create-team`} className='Manage-teams__header-link'>
            <FaPlus />
            <span className='Manage-teams__header-link--text'>Add Team</span>
          </Link>
        </div>
        <div className='Manage-teams__content'>
          <Table columns={columns} data={data} />
        </div>
      </div>
    </DashboardLayout>
  )
}

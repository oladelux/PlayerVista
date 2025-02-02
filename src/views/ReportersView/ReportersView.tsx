import classnames from 'classnames'
import { FC, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'

import { AssignModal } from '../../component/AssignModal/AssignModal.tsx'
import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout.tsx'
import { Column, Table } from '../../component/Table/Table.tsx'
import { AuthenticatedUserData, Reporter, TeamResponse } from '@/api'
import { useEvents } from '@/hooks/useEvents.ts'


import './ReportersView.scss'

type ReportersViewProps = {
  user: AuthenticatedUserData
  reporters: Reporter[]
  teams: TeamResponse[]
}

export const ReportersView:FC<ReportersViewProps> = ({ user, reporters, teams }) => {
  const { teamId } = useParams()
  const { scheduledMatches } = useEvents()
  const [isActiveAssignPopup, setIsActiveAssignPopup] = useState(false)
  const [activeReporter, setActiveReporter] = useState<string>('')
  const currentTeam = teams.find((team) => team.id === teamId)

  const filteredReporters = reporters.filter((item) => item.id !== user.id)
  const reporterColumns: Column<never>[] = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    {
      key: 'verified',
      title: 'Verified',
      render: (value: boolean) => <span
        className={classnames('Reporters-view__verification', { 'Reporters-view__verification--yes': value })}></span>,
    },
    {
      key: 'assignedMatch',
      title: 'Assigned Match',
      render: (value: string) => <div>{value}</div>,
    },
    {
      key: 'assign',
      title: '',
      render: (value: string) => <button className='Reporters-view__assignBtn' onClick={() => openAssignPopup(value)}>
        Assign match</button>,
    },
    {
      key: 'action',
      title: 'Action',
      render: (value: string) => <a className='table-link' href={value}>Delete</a>,
    },
  ]

  const allReporters = filteredReporters.map(reporter => ({
    name: reporter.firstName + ' ' + reporter.lastName,
    email: reporter.email,
    verified: reporter.isEmailVerified,
    assignedMatch: getMatch(reporter.eventId) || '',
    assign: reporter.id,
    action: `/team/${teamId}/reporters/${reporter.id}`,
  }))

  const openAssignPopup = (reporterId: string) => {
    setActiveReporter(reporterId)
    setIsActiveAssignPopup(true)
  }
  const closeAssignPopup = () => setIsActiveAssignPopup(false)

  function getMatch(eventId: string) {
    const isMatch = scheduledMatches.find(match => eventId === match.id )
    if(isMatch){
      return isMatch.location === 'Home'
        ? `${currentTeam?.teamName} vs ${isMatch.opponent}` : `${isMatch.opponent} vs ${currentTeam?.teamName}`
    }
  }

  return (
    <DashboardLayout>
      <div className='Reporters-view'>
        <div className='Reporters-view__title'>Reporters</div>
        <div className='Reporters-view__header'>
          <div className='Reporters-view__header-form'>
            <FiSearch className='Reporters-view__header-form--search-icon'/>
            <input
              className='Reporters-view__header-form--input'
              type='text'
              name='search'
              placeholder='Search'
            />
          </div>
          <Link to={`/team/${teamId}/reporters/add-reporter`} className='Reporters-view__header-link'>
            <FaPlus />
            <span className='Reporters-view__header-link--text'>Add New Reporter</span>
          </Link>
        </div>
        <div className='Reporters-view__content'>
          <Table columns={reporterColumns} data={allReporters} />
        </div>
      </div>
      {isActiveAssignPopup && <AssignModal onClose={closeAssignPopup}
        activeReporter={activeReporter} scheduledMatches={scheduledMatches}
        currentTeam={currentTeam} />}
    </DashboardLayout>
  )
}

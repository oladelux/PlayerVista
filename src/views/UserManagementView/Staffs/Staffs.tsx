import { FC } from 'react'
import { FiSearch } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import classnames from 'classnames'

import { usePlayers } from '../../../hooks/usePlayers'
import { AuthenticatedUserData, Staff } from '../../../api'

import { DashboardLayout } from '../../../component/DashboardLayout/DashboardLayout'
import { Table } from '../../../component/Table/Table'

import './Staffs.scss'
import { useSelector } from 'react-redux'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import { usePermission } from '@/hooks/usePermission.ts'

const staffColumns = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  {
    key: 'role',
    title: 'Role',
    render: (value: string) => <span className='Staffs__role'>{value}</span>,
  },
  {
    key: 'verified',
    title: 'Verified',
    render: (value: boolean) => <span
      className={classnames('Staffs__verification', { 'Staffs__verification--yes': value })}></span>,
  },
  {
    key: 'action',
    title: 'Action',
    render: (value: string) => <a className='table-link' href={value}>View</a>,
  },
]

type StaffsProps = {
  staffs: Staff[]
  user: AuthenticatedUserData
}

export const Staffs: FC<StaffsProps> = ({ staffs, user }) => {
  const { teamId } = useParams()
  const { userRole } = useSelector(settingsSelector)
  const { canCreateStaff } = usePermission(userRole)
  const { searchPlayerValue, handleSearchInput } = usePlayers()
  const filteredStaffs = staffs.filter((item) => item.id !== user.id && item.teamId === teamId)

  const allStaffs = filteredStaffs.map(staff => ({
    name: staff.firstName + ' ' + staff.lastName,
    email: staff.email,
    role: staff.role,
    verified: staff.isEmailVerified,
    action: `/team/${teamId}/staffs/${staff.id}`,
  }))

  return (
    <DashboardLayout>
      <div className='Staffs'>
        <div className='Staffs__title'>Staffs</div>
        <div className='Staffs__header'>
          <div className='Staffs__header-form'>
            <FiSearch className='Staffs__header-form--search-icon'/>
            <input
              className='Staffs__header-form--input'
              type='text'
              name='search'
              placeholder='Search'
              value={searchPlayerValue}
              onChange={handleSearchInput}
            />
          </div>
          {canCreateStaff && <Link to={`/team/${teamId}/staffs/add-staff`} className='Staffs__header-link'>
            <FaPlus/>
            <span className='Staffs__header-link--text'>Add New Staff</span>
          </Link>}
        </div>
        <div className='Staffs__content'>
          <Table columns={staffColumns} data={allStaffs} />
        </div>
      </div>
    </DashboardLayout>
  )
}

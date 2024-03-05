import { FC } from 'react'

import { DashboardLayout } from '../../../component/DashboardLayout/DashboardLayout'

import './Staffs.scss'
import { FiSearch } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { Table } from '../../../component/Table/Table'
import { usePlayers } from '../../../hooks/usePlayers'

const staffColumns = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Role' },
  { key: 'dateCreated', title: 'Date Created' },
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

export const Staffs: FC = () => {
  const { teamId } = useParams()
  const { searchPlayerValue, handleSearchInput } = usePlayers()
  const allStaffs: { [key: string]: string | number | boolean | JSX.Element; }[] = []

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
          <Link to={`/team/${teamId}/staffs/add-staff`} className='Staffs__header-link'>
            <FaPlus />
            <span className='Staffs__header-link--text'>Add New Staff</span>
          </Link>
        </div>
        <div className='Staffs__content'>
          <Table columns={staffColumns} data={allStaffs} />
        </div>
      </div>
    </DashboardLayout>
  )
}

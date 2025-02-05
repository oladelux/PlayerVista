import classnames from 'classnames'
import { FaPlus } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import { Column, Table } from '@/component/Table/Table.tsx'
import { useToast } from '@/hooks/use-toast.ts'
import { usePermission } from '@/hooks/usePermission.ts'
import { usePlayers } from '@/hooks/usePlayers.ts'


import './Staffs.scss'

import { useStaff } from '@/hooks/useStaff.ts'
import { useUpdates } from '@/hooks/useUpdates.ts'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'

import { EyeIcon } from 'lucide-react'

import { deleteStaffThunk } from '@/store/slices/StaffSlice.ts'
import { AppDispatch } from '@/store/types.ts'
import useAuth from '@/useAuth.ts'
import { ConfirmStaffDeletion } from '@/views/UserManagementView/Staffs/ConfirmStaffDeletion.tsx'

const staffColumns: Column<never>[] = [
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
    render: (value: { manageLink: string, deleteStaffLink: () => void }) => (<div className='flex items-center gap-2'>
      <Link className='table-link' to={value.manageLink}><EyeIcon width={16} /></Link>
      <ConfirmStaffDeletion onDeleted={value.deleteStaffLink} />
    </div>),
  },
]

export function Staffs() {
  const { teamId } = useParams()
  const { toast } = useToast()
  const logger = useUpdates()
  const dispatch = useDispatch<AppDispatch>()
  const { userRole } = useSelector(settingsSelector)
  const { canCreateStaff } = usePermission(userRole)
  const { searchPlayerValue, handleSearchInput } = usePlayers()
  const { staffs } = useStaff()
  const { localSession } = useAuth()

  if(!localSession) {
    return null
  }
  const filteredStaffs = staffs.filter((item) =>
    item.id !== localSession.userId && item.teamId === teamId)

  const handleDeleteStaff = (staffId: string) => {
    try {
      dispatch(deleteStaffThunk({ id: staffId } ))
        .unwrap()
        .then(() => {
          logger.setUpdate({ message: 'deleted a staff', userId: localSession.userId, groupId: localSession.groupId })
          logger.sendUpdates(localSession.groupId)
          toast({
            variant: 'success',
            description: 'Staff member successfully deleted',
          })
        })
    } catch (error) {
      toast({
        variant: 'error',
        description: 'Error deleting staff',
      })
      console.error('Error deleting staff:', error)
    }
  }

  const allStaffs = filteredStaffs.map(staff => ({
    name: staff.firstName + ' ' + staff.lastName,
    email: staff.email,
    role: staff.role,
    verified: staff.isEmailVerified,
    action: {
      manageLink: `/${teamId}/staffs/${staff.id}`,
      deleteStaffLink: () => handleDeleteStaff(staff.id),
    },
  }))

  return (
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
        {canCreateStaff && <Link to='add-staff' className='Staffs__header-link'>
          <FaPlus/>
          <span className='Staffs__header-link--text'>Add New Staff</span>
        </Link>}
      </div>
      <div className='Staffs__content'>
        <Table columns={staffColumns} data={allStaffs} />
      </div>
    </div>
  )
}

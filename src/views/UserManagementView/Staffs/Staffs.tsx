import { FC } from 'react'
import { FiSearch } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import classnames from 'classnames'

import { usePlayers } from '@/hooks/usePlayers.ts'
import { AuthenticatedUserData, Staff } from '@/api'

import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { Column, Table } from '@/component/Table/Table.tsx'

import './Staffs.scss'
import { useDispatch, useSelector } from 'react-redux'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import { usePermission } from '@/hooks/usePermission.ts'
import { EyeIcon } from 'lucide-react'
import { ConfirmStaffDeletion } from '@/views/UserManagementView/Staffs/ConfirmStaffDeletion.tsx'
import { AppDispatch } from '@/store/types.ts'
import { useToast } from '@/hooks/use-toast.ts'
import { UseUpdates } from '@/hooks/useUpdates.ts'
import { deleteStaffThunk } from '@/store/slices/StaffSlice.ts'

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
    render: (value: { manageLink: string, deleteStaffLink: () => void }) => (<div className='flex gap-2 items-center'>
      <Link className='table-link' to={value.manageLink}><EyeIcon width={16} /></Link>
      <ConfirmStaffDeletion onDeleted={value.deleteStaffLink} />
    </div>),
  },
]

type StaffsProps = {
  staffs: Staff[]
  user: AuthenticatedUserData
  logger: UseUpdates
}

export const Staffs: FC<StaffsProps> = ({ staffs, user, logger }) => {
  const { teamId } = useParams()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const { userRole } = useSelector(settingsSelector)
  const { canCreateStaff } = usePermission(userRole)
  const { searchPlayerValue, handleSearchInput } = usePlayers()
  const filteredStaffs = staffs.filter((item) => item.id !== user.id && item.teamId === teamId)

  const handleDeleteStaff = (staffId: string) => {
    try {
      dispatch(deleteStaffThunk({ id: staffId } ))
        .unwrap()
        .then(() => {
          logger.setUpdate({ message: 'deleted a staff', userId: user.id, groupId: user.groupId })
          logger.sendUpdates(user.groupId)
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
      manageLink: `/team/${teamId}/staffs/${staff.id}`,
      deleteStaffLink: () => handleDeleteStaff(staff.id),
    },
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

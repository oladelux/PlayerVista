import { useEffect, useState } from 'react'

import { Staff, StaffData, UserDetailsResponse } from '@/api'
import { appService, staffService } from '@/singletons'
import { getStaffThunk, updateStaffThunk } from '@/store/slices/StaffSlice.ts'
import { useAppDispatch } from '@/store/types.ts'

export const useStaff = (staffId?: string) => {
  const dispatch = useAppDispatch()
  const userData = appService.getUserData()
  const userGroupId = userData?.groupId

  const [staff, setStaff] = useState<UserDetailsResponse | null>(null)
  const [staffs, setStaffs] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  async function updateStaff(data: Partial<StaffData>) {
    if (staffId) {
      await dispatch(updateStaffThunk({ id: staffId, data }))
    }
  }

  useEffect(() => {
    if (staffId) {
      dispatch(getStaffThunk({ id: staffId }))
    }
  }, [dispatch, staffId])

  useEffect(() => {
    const staffSubscription = staffService.staff$.subscribe(state => {
      setStaffs(state.staffs)
      setStaff(state.staff)
      setLoading(state.loading)
      setError(state.error)
    })
    staffService.getStaffs(userGroupId)
    if (staffId) {
      staffService.getStaff(staffId)
    }

    return () => {
      staffSubscription.unsubscribe()
    }
  }, [staffId, userGroupId])

  return {
    staff,
    staffs,
    error,
    loading,
    updateStaff,
  }
}

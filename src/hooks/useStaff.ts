import { useAppDispatch } from '@/store/types.ts'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getStaffThunk, staffSelector, updateStaffThunk } from '@/store/slices/StaffSlice.ts'
import { StaffData } from '@/api'

export const useStaff = (staffId?: string) => {
  const dispatch = useAppDispatch()
  const { staff } = useSelector(staffSelector)

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

  return { staff, updateStaff }
}

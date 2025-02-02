import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types.ts'
import {
  ClientError,
  createStaff, deleteStaff,
  getStaffs,
  getUserDetails,
  Staff,
  StaffData,
  StaffDataResponse, updateStaff,
  UserDetailsResponse,
} from '@/api'

type InitialStaffState = {
  staffs: Staff[]
  /**
   * The loading state of creating new staff member
   */
  loadingCreatingStaff: AsyncThunkLoading
  /**
   * The loading state of getting all staffs
   */
  loadingGettingStaff: AsyncThunkLoading
  loadingGettingSingleStaff: AsyncThunkLoading
  loadingUpdatingStaff: AsyncThunkLoading
  loadingDeletingStaff: AsyncThunkLoading
  staff: UserDetailsResponse | null
}

const initialState: InitialStaffState = {
  staffs: [],
  loadingCreatingStaff: 'idle',
  loadingGettingStaff: 'idle',
  loadingGettingSingleStaff: 'idle',
  loadingUpdatingStaff: 'idle',
  loadingDeletingStaff: 'idle',
  staff: null,
}

/**
 * Create a new staff profile
 */
export const createStaffThunk = createAsyncThunk<
  void,
  { data: StaffData }
>('staff/add-staff', async ({ data }, { rejectWithValue }) => {
  try {
    await createStaff(data)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in creating staff')
  }
})

/**
 * Gets all staffs
 */
export const getStaffsThunk = createAsyncThunk<
  StaffDataResponse,
  { groupId: string }
>('staffs/getStaffs', async ({ groupId }, { rejectWithValue }) => {
  try {
    return await getStaffs(groupId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in getting staffs')
  }
})

/**
 * Gets a staff member
 */
export const getStaffThunk = createAsyncThunk<
  undefined | UserDetailsResponse,
  { id: string | undefined }
>('staffs/staff', ({ id }) => {
  if(id)
    return getUserDetails(id)
} )

/**
 * Update the staff
 */
export const updateStaffThunk = createAsyncThunk<
  unknown,
  { id: string, data: Partial<StaffData> }
>('staffs/updateStaff', ({ id, data }, { rejectWithValue }) => {
  try {
    return updateStaff(id, data)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in updating staff')
  }
})

export const deleteStaffThunk = createAsyncThunk<
  unknown,
  { id: string }
>('staffs/deleteStaff', async ({ id }, { rejectWithValue }) => {
  try {
    await deleteStaff(id)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in deleting staff')
  }
})

export const staffSlice = createSlice({
  name: 'staffs',
  initialState,
  reducers: {
    clearStaffState: (
      state,
    ) => {
      state.loadingCreatingStaff = 'idle'
      state.staffs = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStaffThunk.pending, state => {
        state.loadingCreatingStaff = 'pending'
      })
      .addCase(createStaffThunk.fulfilled, state => {
        if (
          state.loadingCreatingStaff === 'pending'
        ) {
          state.loadingCreatingStaff = 'succeeded'
        }
      })
      .addCase(createStaffThunk.rejected, (state, action) => {
        if (
          state.loadingCreatingStaff === 'pending'
        ) {
          state.loadingCreatingStaff = 'failed'
          console.error('Error creating new staff', action.error)
        }
      })
      .addCase(getStaffsThunk.pending, state => {
        state.loadingGettingStaff = 'pending'
      })
      .addCase(getStaffsThunk.fulfilled, (state, action) => {
        state.loadingGettingStaff = 'succeeded'
        if(action.payload) {
          state.staffs = action.payload.data
        }
      })
      .addCase(getStaffsThunk.rejected, (state, action) => {
        if (
          state.loadingGettingStaff === 'pending'
        ) {
          state.loadingGettingStaff = 'failed'
          console.error('Error getting all staffs', action.error)
        }
      })
      .addCase(getStaffThunk.pending, state => {
        state.loadingGettingSingleStaff = 'pending'
      })
      .addCase(getStaffThunk.fulfilled, (state, action) => {
        if (
          state.loadingGettingSingleStaff === 'pending'
        ) {
          state.loadingGettingSingleStaff = 'succeeded'
          if (action.payload) {
            state.staff = action.payload
          }
        }
      })
      .addCase(getStaffThunk.rejected, (state, action) => {
        if (
          state.loadingGettingSingleStaff === 'pending'
        ) {
          state.loadingGettingSingleStaff = 'failed'
          console.error('Error getting single staff', action.error)
        }
      })
      .addCase(updateStaffThunk.pending, state => {
        state.loadingUpdatingStaff = 'pending'
      })
      .addCase(updateStaffThunk.fulfilled, state => {
        if (
          state.loadingUpdatingStaff === 'pending'
        ) {
          state.loadingUpdatingStaff = 'succeeded'
        }
      })
      .addCase(updateStaffThunk.rejected, (state, action) => {
        if (
          state.loadingUpdatingStaff === 'pending'
        ) {
          state.loadingUpdatingStaff = 'failed'
          console.error('Error updating staff', action.error)
        }
      })
      .addCase(deleteStaffThunk.pending, state => {
        state.loadingDeletingStaff = 'pending'
      })
      .addCase(deleteStaffThunk.fulfilled, state => {
        if (
          state.loadingDeletingStaff === 'pending'
        ) {
          state.loadingDeletingStaff = 'succeeded'
        }
      })
      .addCase(deleteStaffThunk.rejected, (state, action) => {
        if (
          state.loadingDeletingStaff === 'pending'
        ) {
          state.loadingDeletingStaff = 'failed'
          console.error('Error deleting staff', action.error)
        }
      })
  },
})


export const {
  clearStaffState,
} = staffSlice.actions

export const staffSelector = (state: RootState) => state.staffs

export const staffReducer = staffSlice.reducer

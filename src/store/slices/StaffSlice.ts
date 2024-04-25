import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { ClientError, createStaff, getStaffs, Staff, StaffData } from '../../api'
import { AsyncThunkLoading, RootState } from '../types.ts'

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
}

const initialState: InitialStaffState = {
  staffs: [],
  loadingCreatingStaff: 'idle',
  loadingGettingStaff: 'idle',
}

/**
 * Create a new staff profile
 */
export const createStaffThunk = createAsyncThunk<
  Staff,
  { data: StaffData }
>('staff/add-staff', async ({ data }, { rejectWithValue }) => {
  try {
    return await createStaff(data)
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
  Staff[],
  { teamId: string }
>('staffs/getStaffs', async ({ teamId }, { rejectWithValue }) => {
  try {
    return await getStaffs(teamId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in getting staffs')
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
      .addCase(createStaffThunk.fulfilled, (state, action) => {
        state.loadingCreatingStaff = 'succeeded'
        if(action.payload) {
          state.staffs.push(action.payload)
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
          state.staffs = action.payload
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
  },
})


export const {
  clearStaffState,
} = staffSlice.actions

export const staffSelector = (state: RootState) => state.staffs

export const staffReducer = staffSlice.reducer

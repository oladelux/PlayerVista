import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { AsyncThunkLoading, RootState } from '../types'
import {
  ClientError, Event,
  EventFormData, addEvent, EventDataResponse, getEvents, SingleEventType,
  getSingleEvent, updateEvent,
} from '@/api'

type InitialEventsState = {
  /**
   * The team's event
   */
  events: Event[]
  /**
   * The selected team event
   */
  selectedEvent: SingleEventType | undefined
  /**
   * The loading state of creating new event
   */
  loadingCreatingNewEventStatus: AsyncThunkLoading
  /**
   * The loading state of getting players for a team
   */
  loadingGettingEventsStatus: AsyncThunkLoading
  /**
   * The loading state of getting single event for a team
   */
  loadingGettingSingleEvent: AsyncThunkLoading
  /**
   * The loading state of updating team event
   */
  loadingUpdatingEvent: AsyncThunkLoading
}

const initialState: InitialEventsState = {
  events: [],
  selectedEvent: undefined,
  loadingCreatingNewEventStatus: 'idle',
  loadingGettingEventsStatus: 'idle',
  loadingGettingSingleEvent: 'idle',
  loadingUpdatingEvent: 'idle',
}

/**
 * Create a new event
 */
export const createEventThunk = createAsyncThunk<
  Event,
  { data: EventFormData, teamId: string }
>('events/addEvent', async ({ data, teamId }, { rejectWithValue }) => {
  try {
    return await addEvent(data, teamId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in adding event')
  }
})

/**
 * Gets all events for a team
 */
export const getEventsThunk = createAsyncThunk<
  EventDataResponse,
  { teamId: string }
>('events/getEvents', async ({ teamId }, { rejectWithValue }) => {
  try {
    return await getEvents(teamId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in getting events')
  }
})

export const getSingleEventThunk = createAsyncThunk<
  SingleEventType,
  { eventId: string }
>('events/getSingleEvent', async({ eventId }, { rejectWithValue }) => {
  try {
    return await getSingleEvent(eventId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in getting single team event')
  }
})

/**
 * The thunk for updating team event
 */
export const updateEventThunk = createAsyncThunk<
  unknown,
  { data: EventFormData, eventId: string }
>('events/updateEvent', ({ data, eventId }, { rejectWithValue }) => {
  try {
    return updateEvent(data, eventId)
  } catch (e) {
    if (e instanceof ClientError) {
      return rejectWithValue(e.message)
    }
    return rejectWithValue('Unexpected error in updating player')
  }
})

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEventState: (
      state,
    ) => {
      state.loadingCreatingNewEventStatus = 'idle'
      state.loadingGettingEventsStatus = 'idle'
      state.loadingGettingSingleEvent = 'idle'
      state.loadingUpdatingEvent = 'idle'
      state.events = []
      state.selectedEvent = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEventThunk.pending, state => {
        state.loadingCreatingNewEventStatus = 'pending'
      })
      .addCase(createEventThunk.fulfilled, (state) => {
        state.loadingCreatingNewEventStatus = 'succeeded'
        /*const { teamId } = action.meta.arg
        if (action.payload) {
          state.events[teamId].push(action.payload)
        }*/
      })
      .addCase(createEventThunk.rejected, (state, action) => {
        if (
          state.loadingCreatingNewEventStatus === 'pending'
        ) {
          state.loadingCreatingNewEventStatus = 'failed'
          console.error('Error creating new event', action.error)
        }
      })
      .addCase(getEventsThunk.pending, state => {
        state.loadingGettingEventsStatus = 'pending'
      })
      .addCase(getEventsThunk.fulfilled, (state, action) => {
        state.loadingGettingEventsStatus = 'succeeded'

        if (action.payload) {
          state.events = action.payload.results
        }
      })
      .addCase(getEventsThunk.rejected, (state, action) => {
        if (
          state.loadingGettingEventsStatus === 'pending'
        ) {
          state.loadingGettingEventsStatus = 'failed'
          console.error('Error getting events', action.error)
        }
      })
      .addCase(getSingleEventThunk.pending, state => {
        state.loadingGettingSingleEvent = 'pending'
      })
      .addCase(getSingleEventThunk.fulfilled, (state, action) => {
        state.loadingGettingSingleEvent = 'succeeded'

        if (action.payload) {
          state.selectedEvent = action.payload
        }
      })
      .addCase(getSingleEventThunk.rejected, (state, action) => {
        if (
          state.loadingGettingSingleEvent === 'pending'
        ) {
          state.loadingGettingSingleEvent = 'failed'
          console.error('Error getting selected event', action.error)
        }
      })
      .addCase(updateEventThunk.pending, state => {
        state.loadingUpdatingEvent = 'pending'
      })
      .addCase(updateEventThunk.fulfilled, state => {
        if (
          state.loadingUpdatingEvent === 'pending'
        ) {
          state.loadingUpdatingEvent = 'succeeded'
        }
      })
      .addCase(updateEventThunk.rejected, (state, action) => {
        if (
          state.loadingUpdatingEvent === 'pending'
        ) {
          state.loadingUpdatingEvent = 'failed'
          console.error('Error updating event', action.error)
        }
      })
  },
})

export const {
  clearEventState,
} = eventsSlice.actions

export const eventsSelector = (state: RootState) => state.events

export const eventsReducer = eventsSlice.reducer

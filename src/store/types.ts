import { useDispatch } from 'react-redux'
import { rootReducer, setupStore } from './index'

export type AppDispatch = typeof setupStore.dispatch
export type RootState = ReturnType<typeof rootReducer>
export type AsyncThunkLoading = 'idle' | 'pending' | 'succeeded' | 'failed'
export const useAppDispatch = () => useDispatch<AppDispatch>()

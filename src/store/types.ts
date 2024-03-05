import {useDispatch} from "react-redux";
import {rootReducer, setupStore} from "./index"

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<typeof rootReducer>
export type ThunkApi = { dispatch: AppDispatch, state: RootState }
export type AsyncThunkLoading = 'idle' | 'pending' | 'succeeded' | 'failed'
export const useAppDispatch = () => useDispatch<AppDispatch>()

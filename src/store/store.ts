import { configureStore } from '@reduxjs/toolkit'
import search from './searchSlice'
import detail from './detailSlice'

export const store = configureStore({
  reducer: { search, detail }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

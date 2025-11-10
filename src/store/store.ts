import { configureStore } from '@reduxjs/toolkit'
import search from './searchSlice'
import detail from './detailSlice'
import favorites, { favoritesInitialState, type FavoritesState } from './favoritesSlice'
import { loadFavoritesState, saveFavoritesState } from './persistence'

function sanitize(v?: FavoritesState): FavoritesState {
  if (!v) return { ids: [] }
  const ids = Array.from(new Set((v.ids || []).map(Number).filter(Number.isFinite)))
  return { ids }
}

const preloadedFavorites = sanitize(loadFavoritesState() ?? favoritesInitialState)

export const store = configureStore({
  reducer: { search, detail, favorites },
  preloadedState: { favorites: preloadedFavorites },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
})

// throttle persistence
let last = 0
store.subscribe(() => {
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
  if (now - last < 100) return
  last = now
  saveFavoritesState(sanitize(store.getState().favorites))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
